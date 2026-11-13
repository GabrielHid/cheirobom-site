// Prepara os assets do Natal a partir de assets/natal/raw (PNGs com fundo transparente). Rodar: node scripts/make-natal-assets.mjs
// - Folhas com vários desenhos (ramos, ícones) são separadas por componente conexo do alpha, da esquerda para a direita.
// - Cada elemento é recortado pelo bounding box do alpha, com 16px de margem.
// - Aquarelas saem em WebP com alpha (q82). Ícones de traço e romã são vetorizados (potrace), com fill="currentColor" e svgo.
// - Das etiquetas também sai etiquetas.json: centro, tamanho e inclinação de cada etiqueta, para o texto HTML acompanhar a arte.
// A pasta raw nunca é apagada.
import sharp from 'sharp';
import potrace from 'potrace';
import { optimize } from 'svgo';
import { mkdir, writeFile } from 'node:fs/promises';

const RAW = 'assets/natal/raw';
const OUT = 'assets/natal';
const MARGIN = 16;
const ALPHA_MIN = 16; // abaixo disso é halo: não conta para o recorte.

await mkdir(OUT, { recursive: true });

async function load(file) {
  const { data, info } = await sharp(`${RAW}/${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

// Rótulos por componente conexo, numa grade reduzida (cell px) e dilatada, para os traços de um mesmo desenho ficarem juntos.
// Pedaços pequenos (sementes, pontinhos da farofa) entram no desenho grande mais próximo.
function components(img, { cell = 4, grow = 2, expected }) {
  const { data, w, h } = img;
  const gw = Math.ceil(w / cell);
  const gh = Math.ceil(h / cell);
  const on = new Uint8Array(gw * gh);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 32) on[((y / cell) | 0) * gw + ((x / cell) | 0)] = 1;
  const dil = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) {
      if (!on[y * gw + x]) continue;
      for (let dy = -grow; dy <= grow; dy++)
        for (let dx = -grow; dx <= grow; dx++) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy >= 0 && yy < gh && xx >= 0 && xx < gw) dil[yy * gw + xx] = 1;
        }
    }
  const label = new Int32Array(gw * gh).fill(-1);
  const comps = [];
  for (let i = 0; i < gw * gh; i++) {
    if (!dil[i] || label[i] >= 0) continue;
    const id = comps.length;
    const stack = [i];
    label[i] = id;
    let n = 0;
    let sx = 0;
    let sy = 0;
    while (stack.length) {
      const j = stack.pop();
      const x = j % gw;
      const y = (j / gw) | 0;
      n++;
      sx += x;
      sy += y;
      for (const k of [j - 1, j + 1, j - gw, j + gw]) {
        if (k < 0 || k >= gw * gh || label[k] >= 0 || !dil[k]) continue;
        if ((k === j - 1 && x === 0) || (k === j + 1 && x === gw - 1)) continue;
        label[k] = id;
        stack.push(k);
      }
    }
    comps.push({ id, n, cx: sx / n, cy: sy / n });
  }
  const big = [...comps].sort((a, b) => b.n - a.n).slice(0, expected);
  const target = new Map();
  for (const c of comps) {
    if (big.includes(c)) target.set(c.id, c.id);
    else target.set(c.id, big.reduce((best, b) => (Math.hypot(b.cx - c.cx, b.cy - c.cy) < Math.hypot(best.cx - c.cx, best.cy - c.cy) ? b : best)).id);
  }
  const order = [...big].sort((a, b) => a.cx - b.cx).map((c) => c.id);
  return order.map((id) => (x, y) => target.get(label[((y / cell) | 0) * gw + ((x / cell) | 0)]) === id);
}

// Recorta um elemento: zera o alpha do que não é dele e corta no bbox + margem (padrão MARGIN).
async function crop(img, belongs = () => true, margin = MARGIN) {
  const { data, w, h } = img;
  const out = Buffer.from(data);
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!belongs(x, y)) {
        out[i + 3] = 0;
        continue;
      }
      if (out[i + 3] > ALPHA_MIN) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  const left = Math.max(0, x0 - margin);
  const top = Math.max(0, y0 - margin);
  const width = Math.min(w, x1 + margin + 1) - left;
  const height = Math.min(h, y1 + margin + 1) - top;
  const buf = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).extract({ left, top, width, height }).png().toBuffer();
  return { buf, left, top, width, height };
}

async function webp(buf, name, maxWidth) {
  const info = await sharp(buf).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/${name}.webp`);
  console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  return info;
}

// Traço preto sobre transparente -> SVG de um path só, com a cor vindo do CSS.
// `trace` sobrescreve opções do potrace; `precision` é a casa decimal do svgo (mais alta preserva curvas de traço fino).
// Com NATAL_DEBUG=<pasta>, o recorte em PNG que foi vetorizado também é salvo lá (para conferir a espessura do traço).
async function vector(buf, name, { trace = {}, precision = 1 } = {}) {
  if (process.env.NATAL_DEBUG) await writeFile(`${process.env.NATAL_DEBUG}/${name}.png`, buf);
  // Tinta = pixel opaco e escuro. Vira preto sobre branco para o potrace, em 2x para curvas mais limpas.
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const g = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < g.length; i++) {
    const a = data[i * 4 + 3] / 255;
    const lum = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
    g[i] = Math.round(255 * (1 - a * (1 - lum)));
  }
  const png = await sharp(g, { raw: { width: info.width, height: info.height, channels: 1 } }).resize(info.width * 2).png().toBuffer();
  const raw = await new Promise((ok, fail) =>
    potrace.trace(png, { threshold: 140, turdSize: 8, optTolerance: 0.3, ...trace, color: '#000000', background: 'transparent' }, (err, svg) => (err ? fail(err) : ok(svg))),
  );
  const svg = raw.replace(/fill="(#000000|#000|black)"/gi, 'fill="currentColor"').replace(/<rect[^>]*\/>/g, '');
  const { data: min } = optimize(svg, {
    multipass: true,
    floatPrecision: precision,
    plugins: [{ name: 'preset-default' }, 'removeDimensions', { name: 'removeAttrs', params: { attrs: ['stroke'] } }],
  });
  if (!/currentColor/.test(min)) throw new Error(`${name}: currentColor sumiu na otimização`);
  await writeFile(`${OUT}/${name}.svg`, min);
  console.log(`${name}.svg  ${(min.length / 1024).toFixed(1)} KB  viewBox ${min.match(/viewBox="([^"]+)"/)?.[1]}`);
}

// Centro, tamanho e inclinação de cada etiqueta (pixels de papel kraft), por PCA. Em % da imagem final.
function tagGeometry(img, box) {
  const { data, w } = img;
  const tags = [];
  // Grade de 2px. O barbante (fio fino) sai com uma erosão de ERODE células, e fica o maior pedaço de cada metade.
  const STEP = 2;
  const ERODE = 5;
  const gw = Math.floor(w / STEP);
  const gh = Math.floor(img.h / STEP);
  const kraft = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) {
      const i = (y * STEP * w + x * STEP) * 4;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      kraft[y * gw + x] = a > 240 && r > 140 && r - g < 60 && r - b > 40 ? 1 : 0;
    }
  const core = new Uint8Array(gw * gh);
  for (let y = ERODE; y < gh - ERODE; y++)
    for (let x = ERODE; x < gw - ERODE; x++) {
      let all = 1;
      for (let dy = -ERODE; dy <= ERODE && all; dy++) for (let dx = -ERODE; dx <= ERODE; dx++) if (!kraft[(y + dy) * gw + x + dx]) { all = 0; break; }
      core[y * gw + x] = all;
    }
  for (const [xa, xb] of [[0, gw / 2], [gw / 2, gw]]) {
    // Maior componente conexo do núcleo nesta metade.
    const seen = new Uint8Array(gw * gh);
    let best = [];
    for (let y = 0; y < gh; y++)
      for (let x = Math.ceil(xa); x < xb; x++) {
        const s = y * gw + x;
        if (!core[s] || seen[s]) continue;
        const comp = [];
        const stack = [s];
        seen[s] = 1;
        while (stack.length) {
          const j = stack.pop();
          comp.push(j);
          const jx = j % gw;
          for (const k of [j - 1, j + 1, j - gw, j + gw]) {
            const kx = k % gw;
            if (k < 0 || k >= gw * gh || seen[k] || !core[k] || kx < xa || kx >= xb || Math.abs(kx - jx) > 1) continue;
            seen[k] = 1;
            stack.push(k);
          }
        }
        if (comp.length > best.length) best = comp;
      }
    let n = 0;
    let mx = 0;
    let my = 0;
    const pts = [];
    for (const j of best) {
      const x = (j % gw) * STEP;
      const y = ((j / gw) | 0) * STEP;
      pts.push(x, y);
      n++;
      mx += x;
      my += y;
    }
    mx /= n;
    my /= n;
    // Retângulo de área mínima: testa inclinações de -25° a 25° e fica com a que justa as bordas longas.
    // (PCA puxa para o lado dos cantos chanfrados; a área mínima não.)
    const extents = (deg) => {
      const t = (deg * Math.PI) / 180;
      const ux = Math.sin(t) * -1;
      const uy = Math.cos(t);
      const vx = uy;
      const vy = -ux;
      let a0 = Infinity;
      let a1 = -Infinity;
      let b0 = Infinity;
      let b1 = -Infinity;
      for (let i = 0; i < pts.length; i += 2) {
        const dx = pts[i] - mx;
        const dy = pts[i + 1] - my;
        const along = dx * ux + dy * uy;
        const across = dx * vx + dy * vy;
        if (along < a0) a0 = along;
        if (along > a1) a1 = along;
        if (across < b0) b0 = across;
        if (across > b1) b1 = across;
      }
      return { ux, uy, vx, vy, a0, a1, b0, b1, area: (a1 - a0) * (b1 - b0) };
    };
    let rotate = 0;
    let fit = extents(0);
    for (let deg = -25; deg <= 25; deg += 0.1) {
      const e = extents(deg);
      if (e.area < fit.area) [fit, rotate] = [e, deg];
    }
    const { ux, uy, vx, vy, a0, a1, b0, b1 } = fit;
    const cxr = mx + ux * ((a0 + a1) / 2) + vx * ((b0 + b1) / 2);
    const cyr = my + uy * ((a0 + a1) / 2) + vy * ((b0 + b1) / 2);
    const pct = (v, total) => +((v / total) * 100).toFixed(2);
    tags.push({
      cx: pct(cxr - box.left, box.width),
      cy: pct(cyr - box.top, box.height),
      w: pct(b1 - b0 + 2 * ERODE * STEP, box.width),
      h: pct(a1 - a0 + 2 * ERODE * STEP, box.height),
      rotate: +rotate.toFixed(2),
    });
  }
  return tags;
}

// ---------- aquarelas ----------
const guirlanda = await load('guirlanda.png');
await webp((await crop(guirlanda)).buf, 'guirlanda', 900);

const laco = await load('laco.png');
await webp((await crop(laco)).buf, 'laco', 1200);

const etiquetas = await load('etiquetas.png');
const etBox = await crop(etiquetas);
const etInfo = await webp(etBox.buf, 'etiquetas', 1200);
const geometry = { width: etInfo.width, height: etInfo.height, tags: tagGeometry(etiquetas, etBox) };
await writeFile(`${OUT}/etiquetas.json`, JSON.stringify(geometry, null, 2) + '\n');
console.log('etiquetas.json', JSON.stringify(geometry.tags));

const ramos = await load('ramos.png');
const ramoParts = components(ramos, { expected: 4 });
for (const [i, belongs] of ramoParts.entries()) await webp((await crop(ramos, belongs)).buf, `ramo-${i + 1}`, 500);

// ---------- traço ----------
const icones = [
  ['icones-1.png', ['icone-frango', 'icone-farofa', 'icone-torta']],
  ['icones-2.png', ['icone-costela', 'icone-pudim']],
];
for (const [file, names] of icones) {
  const img = await load(file);
  const parts = components(img, { expected: names.length, grow: 4 });
  for (const [i, belongs] of parts.entries()) await vector((await crop(img, belongs)).buf, names[i]);
}
const roma = await load('roma.png');
await vector((await crop(roma)).buf, 'roma');
// Ícones dos passos do fechamento (Encomende / Pague / Retire): margem de 12px.
// turdSize 2 guarda os detalhes pequenos; alphaMax 1 mantém as curvas suaves. Limiar 132: o 140 padrão engrossa traço
// fino; em 132 o SVG fica com a mesma espessura do PNG (+2% de tinta), sem trecho perdido.
const passos = await load('icones-passos.png');
const passoParts = components(passos, { expected: 3, grow: 4 });
for (const [i, belongs] of passoParts.entries()) {
  const name = ['icone-encomende', 'icone-pague', 'icone-retire'][i];
  await vector((await crop(passos, belongs, 12)).buf, name, { trace: { threshold: 132, turdSize: 2, alphaMax: 1.0 }, precision: 2 });
}
