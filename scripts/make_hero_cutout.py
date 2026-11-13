# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["rembg[cpu]", "pillow", "numpy", "scipy"]
# ///
"""Recorta o frango de assets/raw/frango-assado.jpg para o hero.

Uso: uv run scripts/make_hero_cutout.py
Saída: assets/generated/frango-recorte.png, com o mesmo enquadramento da foto,
para as duas camadas alinharem pixel a pixel.
"""
import os

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

SRC = "assets/raw/frango-assado.jpg"
OUT = "assets/generated/frango-recorte.png"

img = Image.open(SRC).convert("RGB")
matte = remove(img, session=new_session("isnet-general-use"), only_mask=True)
alpha = np.asarray(matte.convert("L"), dtype=np.float32) / 255

# Fica só com a maior ilha, que é o frango; descarta tigela e folhas soltas.
labels, n = ndimage.label(alpha > 0.5)
if n > 1:
    sizes = ndimage.sum(np.ones_like(labels), labels, range(1, n + 1))
    keep = labels == (int(np.argmax(sizes)) + 1)
    alpha *= ndimage.binary_dilation(keep, iterations=6)

# Endurece a borda: o matte deixa partes semitransparentes na ponta das coxas.
alpha = np.clip((alpha - 0.3) / 0.35, 0, 1)
alpha = alpha * alpha * (3 - 2 * alpha)

# Só o peito passa à frente de "Domingo". As coxas sobem até o topo e, recortadas,
# cobririam "min": ficam atrás da palavra, para ela continuar legível.
h, w = alpha.shape
yy, xx = np.mgrid[0:h, 0:w]
ny, nx = yy / h, xx / w
keep_front = (ny > 0.20) | ((nx > 0.60) & (nx < 0.76) & (ny > 0.16))
alpha *= ndimage.gaussian_filter(keep_front.astype(np.float32), 2)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
rgba = np.dstack([np.asarray(img), (alpha * 255).astype(np.uint8)])
Image.fromarray(rgba, "RGBA").save(OUT, optimize=True)

ys, xs = np.where(alpha > 0.5)
h, w = alpha.shape
print(f"bbox x {xs.min()/w:.3f}-{xs.max()/w:.3f} y {ys.min()/h:.3f}-{ys.max()/h:.3f} area {(alpha>0.5).mean():.3f}")

# Prévia sobre magenta para conferir a borda.
bg = Image.new("RGBA", img.size, "#ff00aa")
bg.alpha_composite(Image.open(OUT))
bg.convert("RGB").resize((768, 768)).save(os.environ.get("CUTOUT_PREVIEW", "assets/generated/preview.jpg"), quality=85)
