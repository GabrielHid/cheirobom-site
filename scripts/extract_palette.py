# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow", "numpy", "scikit-learn", "scikit-image"]
# ///
"""Extrai a paleta real das fotos da Cheiro Bom com k-means em CIELAB.

Uso (na raiz do projeto, sem instalar nada):
    uv run scripts/extract_palette.py <pasta-de-saida>

Três passes, porque cada um responde a uma pergunta diferente:
  1. Global: k-means em todas as fotos, cada foto com o mesmo peso.
     Mostra o clima geral, mas médias tendem ao marrom.
  2. Cromático: só pixels com croma alto. Recupera os acentos que o passe 1 engole.
  3. Por material: k-means dentro de recortes de um material específico (vaso,
     tora, pele do frango). É o passe que define os hex de cada papel da paleta.

Saídas: palette.json, palette_swatches.png e palette_crops.jpg (para conferir
visualmente que cada recorte pegou o material certo).
"""
import glob
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageOps
from skimage.color import deltaE_ciede2000, lab2rgb, rgb2lab
from sklearn.cluster import KMeans

RAW = "assets/raw"
BRAND = "assets/brand"
MENU = "assets/menu"
SEED = 7

# Papel da seção 2 do design.md -> hex atuais da tabela + recortes.
# Recorte: (arquivo, x0, y0, x1, y1) em coordenadas normalizadas.
# pick: "largest" (cluster dominante), "chroma" (cluster mais saturado, para
# misturas como o xadrez azul e branco) ou "lit" (cluster mais claro com pelo
# menos 20% da área, para fugir da sombra em materiais com relevo).
ROLES = {
    "Verde folha (planta)": {
        "current": ["#244319"], "pick": "largest",
        "crops": [("frango-assado.jpg", .13, .04, .28, .28),
                  ("maionese.jpg", .36, .02, .55, .16)],
    },
    "Adesivo verde (embalagem)": {
        "current": ["#244319"], "pick": "largest",
        "crops": [("torta-limao.jpg", .37, .46, .62, .56)],
    },
    "Capa do cardápio": {
        "current": ["#073701"], "pick": "largest",
        "crops": [("pudim.jpg", .80, .10, .93, .20)],
    },
    "Barro escuro (cumbuca na sombra)": {
        "current": ["#9D502C", "#4D2013"], "pick": "largest",
        "crops": [("coxa-sobrecoxa.jpg", .05, .16, .38, .30),
                  ("farofa.jpg", .25, .74, .70, .84)],
    },
    "Vaso terracota": {
        "current": ["#9D502C"], "pick": "largest",
        "crops": [("costela.jpg", .06, .08, .36, .22)],
    },
    "Vaso vermelho": {
        "current": ["#9D502C"], "pick": "largest",
        "crops": [("pudim.jpg", .17, .44, .37, .60)],
    },
    "Madeira tora": {
        "current": ["#C27921"], "pick": "lit",
        "crops": [("berinjela.jpg", .02, .85, .60, .98),
                  ("imagem-background.jpg", .36, .40, .46, .55)],
    },
    "Madeira mel (mesa)": {
        "current": ["#C27921"], "pick": "largest",
        "crops": [("pudim.jpg", .02, .72, .12, .85)],
    },
    "Dourado frango (pele)": {
        "current": ["#B88A35", "#BE832A"], "pick": "largest",
        "crops": [("frango-assado.jpg", .35, .22, .70, .52)],
    },
    "Tostado (coxa assada)": {
        "current": ["#B88A35", "#925038"], "pick": "largest",
        "crops": [("coxa-sobrecoxa.jpg", .18, .55, .45, .67),
                  ("coxa-sobrecoxa.jpg", .27, .72, .60, .95)],
    },
    "Farofa": {
        "current": ["#D3B35B"], "pick": "lit",
        "crops": [("costela.jpg", .20, .62, .85, .82),
                  ("farofa.jpg", .18, .50, .75, .72)],
    },
    "Crosta (costela)": {
        "current": ["#4D2013", "#925038"], "pick": "largest",
        "crops": [("costela.jpg", .20, .30, .70, .45)],
    },
    "Azul prato (fosco)": {
        "current": ["#395894", "#5B6C8C"], "pick": "largest",
        "crops": [("costela.jpg", .25, .90, .80, .97)],
    },
    "Azul toalha (xadrez)": {
        "current": ["#2C68B1"], "pick": "chroma",
        "crops": [("macarrao.jpg", .03, .12, .20, .22)],
    },
    "Parede azul-petróleo (sombra)": {
        "current": ["#25281F", "#4F6D6D"], "pick": "largest",
        "crops": [("torta-limao.jpg", .02, .02, .25, .20)],
    },
    "Parede azul-petróleo (luz)": {
        "current": ["#4F6D6D"], "pick": "largest",
        "crops": [("pudim.jpg", .01, .01, .12, .12)],
    },
    "Ardósia (fundo kibe)": {
        "current": ["#25281F"], "pick": "largest",
        "crops": [("kibe-e-empadao.jpg", .02, .72, .18, .97)],
    },
}


def load_rgb(path, max_side=480):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    im.thumbnail((max_side, max_side))
    return np.asarray(im, dtype=np.float64) / 255


def to_lab(px):
    return rgb2lab(px.reshape(-1, 1, 3)).reshape(-1, 3)


def lab_hex(lab):
    rgb = lab2rgb(np.asarray(lab, dtype=np.float64).reshape(1, 1, 3)).reshape(3)
    return "#%02X%02X%02X" % tuple(int(round(c * 255)) for c in np.clip(rgb, 0, 1))


def hex_lab(h):
    h = h.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64) / 255
    return to_lab(rgb.reshape(1, 3))[0]


def de(a, b):
    return float(deltaE_ciede2000(np.asarray(a), np.asarray(b)))


def kmeans(lab, k):
    k = max(1, min(k, len(lab)))
    km = KMeans(n_clusters=k, n_init=8, random_state=SEED).fit(lab)
    counts = np.bincount(km.labels_, minlength=k)
    order = np.argsort(-counts)
    return [(km.cluster_centers_[i], counts[i] / counts.sum()) for i in order]


def clusters_json(cl):
    return [{"hex": lab_hex(c), "share": round(float(s), 3),
             "L": round(float(c[0]), 1),
             "C": round(float(np.hypot(c[1], c[2])), 1)} for c, s in cl]


def sample(px, n, rng):
    return px[rng.choice(len(px), size=min(n, len(px)), replace=False)]


def global_passes(files):
    rng = np.random.default_rng(SEED)
    pool, per_image = [], {}
    for f in files:
        lab = to_lab(load_rgb(f).reshape(-1, 3))
        lab = sample(lab, 20000, rng)
        per_image[os.path.basename(f)] = clusters_json(kmeans(lab, 6))
        pool.append(sample(lab, 8000, rng))
    pool = np.vstack(pool)
    chroma = np.hypot(pool[:, 1], pool[:, 2])
    return (per_image, clusters_json(kmeans(pool, 14)),
            clusters_json(kmeans(pool[chroma > 28], 12)))


def role_pass():
    out, crop_tiles = {}, []
    for role, cfg in ROLES.items():
        picks = []
        for name, x0, y0, x1, y1 in cfg["crops"]:
            im = ImageOps.exif_transpose(Image.open(f"{RAW}/{name}")).convert("RGB")
            w, h = im.size
            crop = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
            crop_tiles.append((role, name, crop.copy()))
            crop.thumbnail((240, 240))
            lab = to_lab(np.asarray(crop, dtype=np.float64).reshape(-1, 3) / 255)
            cl = kmeans(lab, 3)
            if cfg["pick"] == "chroma":
                c, s = max(cl, key=lambda t: np.hypot(t[0][1], t[0][2]))
            elif cfg["pick"] == "lit":
                c, s = max((t for t in cl if t[1] >= .2), key=lambda t: t[0][0])
            else:
                c, s = cl[0]
            picks.append({"file": name, "lab": c, "hex": lab_hex(c),
                          "share": round(float(s), 2)})
        mean = np.mean([p["lab"] for p in picks], axis=0)
        # O hex final é uma cor que existe num recorte, não a média entre fotos:
        # escolhe a amostra mais próxima da média do grupo.
        best = min(picks, key=lambda p: de(p["lab"], mean))
        out[role] = {
            "extracted": best["hex"],
            "source": best["file"],
            "samples": [{k: v for k, v in p.items() if k != "lab"} for p in picks],
            "current": [{"hex": c, "deltaE": round(de(hex_lab(c), best["lab"]), 1)}
                        for c in cfg["current"]],
        }
    return out, crop_tiles


def brand_pass():
    """Cores exatas da marca: pixels opacos dos PNGs."""
    out = {}
    for name in ("cheiro-bom-ramo.png", "ramo-logo.png", "logo.png",
                 "apple-touch-icon.png"):
        rgba = np.asarray(Image.open(f"{BRAND}/{name}").convert("RGBA"),
                          dtype=np.float64) / 255
        px = rgba.reshape(-1, 4)
        px = px[px[:, 3] > .9][:, :3]
        out[name] = clusters_json(kmeans(to_lab(px), 3))
    return out


def paper_pass():
    """Papel do cardápio. Fica em assets/menu, fora de raw e brand."""
    out = {}
    for f in sorted(glob.glob(f"{MENU}/*.jpg")):
        im = load_rgb(f)
        h, w, _ = im.shape
        lab = to_lab(im[int(h * .45):int(h * .55), int(w * .3):int(w * .7)].reshape(-1, 3))
        out[os.path.basename(f)] = clusters_json(kmeans(lab, 2))[0]["hex"]
        # A moldura verde do cardápio é outra leitura direta da marca.
        band = im[int(h * .3):int(h * .7), :int(w * .08)].reshape(-1, 3)
        lab = to_lab(band)
        chroma = np.hypot(lab[:, 1], lab[:, 2])
        core = lab[chroma >= np.percentile(chroma, 99.7)]
        out[os.path.basename(f) + ":moldura"] = lab_hex(np.median(core, axis=0))
    return out


def swatches(roles, brand, path):
    rows = list(roles.items())
    H, W = 44, 1000
    im = Image.new("RGB", (W, H * len(rows) + 10), "#FFFFFF")
    d = ImageDraw.Draw(im)
    for i, (role, r) in enumerate(rows):
        y = i * H + 5
        d.text((8, y + 14), role, fill="#000")
        x = 250
        for c in r["current"]:
            d.rectangle((x, y, x + 90, y + H - 6), fill=c["hex"])
            d.text((x + 4, y + 2), c["hex"], fill="#FFF")
            x += 94
        x = 460
        d.rectangle((x, y, x + 150, y + H - 6), fill=r["extracted"])
        d.text((x + 4, y + 2), "novo " + r["extracted"], fill="#FFF")
        x = 620
        for s in r["samples"]:
            d.rectangle((x, y, x + 90, y + H - 6), fill=s["hex"])
            d.text((x + 4, y + 2), s["hex"], fill="#FFF")
            x += 94
    im.save(path)


def crop_sheet(tiles, path):
    T, cols = 220, 7
    rows = (len(tiles) + cols - 1) // cols
    im = Image.new("RGB", (cols * T, rows * (T + 30)), "#222")
    d = ImageDraw.Draw(im)
    for i, (role, name, crop) in enumerate(tiles):
        crop = crop.copy()
        crop.thumbnail((T - 6, T - 6))
        x, y = (i % cols) * T, (i // cols) * (T + 30)
        d.text((x + 3, y + 2), role[:34], fill="#FFF")
        d.text((x + 3, y + 15), name[:34], fill="#AAA")
        im.paste(crop, (x + 3, y + 30))
    im.save(path, quality=85)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    files = sorted(glob.glob(f"{RAW}/*.jpg"))
    per_image, pooled, chromatic = global_passes(files)
    roles, tiles = role_pass()
    brand = brand_pass()
    paper = paper_pass()
    with open(f"{out}/palette.json", "w", encoding="utf-8") as fh:
        json.dump({"brand": brand, "paper": paper, "roles": roles, "pooled": pooled,
                   "chromatic": chromatic, "per_image": per_image},
                  fh, indent=1, ensure_ascii=False)
    swatches(roles, brand, f"{out}/palette_swatches.png")
    crop_sheet(tiles, f"{out}/palette_crops.jpg")

    print("== MARCA (pixels opacos)")
    for k, v in brand.items():
        print(f"  {k}: " + ", ".join(f"{c['hex']} {c['share']:.0%}" for c in v))
    print("== PAPEL / MOLDURA (assets/menu)")
    for k, v in paper.items():
        print(f"  {k}: {v}")
    print("== GLOBAL (k=14)")
    print("  " + "  ".join(f"{c['hex']} {c['share']:.0%}" for c in pooled))
    print("== CROMÁTICO (k=12, C>28)")
    print("  " + "  ".join(f"{c['hex']} {c['share']:.0%}" for c in chromatic))
    print("== PAPÉIS (recortes por material)")
    for role, r in roles.items():
        cur = ", ".join(f"{c['hex']} dE{c['deltaE']}" for c in r["current"])
        smp = ", ".join(f"{s['hex']}({s['share']})" for s in r["samples"])
        print(f"  {role}: {r['extracted']} <- {r['source']} | atual {cur} | {smp}")


if __name__ == "__main__":
    main()
