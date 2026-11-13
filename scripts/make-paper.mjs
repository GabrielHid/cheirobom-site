// Texturas do site: o papel do cardápio (manchas, grão e fibras) e o feltro dos fundos verdes. Blocos que repetem sem emenda.
// Gera public/textures/papel.webp e public/textures/verde.webp. Rodar: node scripts/make-paper.mjs
// O bloco é só sombra marrom com transparência: a cor de fundo continua vindo de --papel no CSS.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SIZE = 512;
const INK = [77, 52, 34]; // marrom do papel envelhecido, mais claro que --crosta

// Gerador com semente: a textura sai igual em todo build.
let seed = 20261109;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// Ruído de valor periódico: a grade dá a volta, então a borda direita casa com a esquerda.
function periodicNoise(cells) {
  const grid = Array.from({ length: cells * cells }, rand);
  const at = (x, y) => grid[((y + cells) % cells) * cells + ((x + cells) % cells)];
  const smooth = (t) => t * t * (3 - 2 * t);
  return (u, v) => {
    const x = u * cells, y = v * cells;
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = smooth(x - xi), fy = smooth(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

const octaves = [periodicNoise(3), periodicNoise(6), periodicNoise(12), periodicNoise(24)];
const mottle = (u, v) => (octaves[0](u, v) * 0.5 + octaves[1](u, v) * 0.27 + octaves[2](u, v) * 0.15 + octaves[3](u, v) * 0.08);

const alpha = new Float32Array(SIZE * SIZE);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const m = mottle(x / SIZE, y / SIZE); // 0..1, média ~0.5
    const cloud = Math.max(0, m - 0.36) * 0.15; // manchas: até ~9%
    const grain = (rand() - 0.5) * 0.035; // grão fino
    alpha[y * SIZE + x] = cloud + grain + 0.012;
  }
}

// Fibras: traços curtos e finos, levemente curvos, que dão a volta na borda.
const plot = (x, y, a) => {
  const xi = ((Math.round(x) % SIZE) + SIZE) % SIZE, yi = ((Math.round(y) % SIZE) + SIZE) % SIZE;
  alpha[yi * SIZE + xi] += a;
};
for (let i = 0; i < 150; i++) {
  let x = rand() * SIZE, y = rand() * SIZE, ang = rand() * Math.PI * 2;
  const len = 4 + rand() * 14, a = 0.015 + rand() * 0.03, bend = (rand() - 0.5) * 0.12;
  for (let s = 0; s < len; s += 0.5) {
    plot(x, y, a);
    x += Math.cos(ang) * 0.5; y += Math.sin(ang) * 0.5; ang += bend * 0.5;
  }
}
// Pintas: pontinhos de fibra mais escura, raros.
for (let i = 0; i < 140; i++) {
  const x = rand() * SIZE, y = rand() * SIZE, a = 0.06 + rand() * 0.1;
  plot(x, y, a); if (rand() > 0.5) plot(x + 1, y, a * 0.6);
}

const px = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  px[i * 4] = INK[0]; px[i * 4 + 1] = INK[1]; px[i * 4 + 2] = INK[2];
  px[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, alpha[i])) * 255);
}

mkdirSync('public/textures', { recursive: true });
const out = await sharp(px, { raw: { width: SIZE, height: SIZE, channels: 4 } })
  .webp({ quality: 75, alphaQuality: 80, effort: 6 })
  .toFile('public/textures/papel.webp');
console.log('public/textures/papel.webp', `${out.width}x${out.height}`, `${(out.size / 1024).toFixed(1)} KB`);

// Feltro dos fundos verdes: grão fino e uma respiração de luz, em luz (papel) e sombra (verde quase preto).
// Gera public/textures/verde.webp, aplicado por --verde-fundo sobre a cor --verde.
{
  const S = 256;
  const breath = periodicNoise(4);
  const LIGHT = [249, 248, 245], DARK = [1, 18, 0];
  const felt = Buffer.alloc(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const v = (rand() - 0.5) * 0.09 + (breath(x / S, y / S) - 0.5) * 0.08; // negativo escurece, positivo clareia
      const c = v >= 0 ? LIGHT : DARK, i = (y * S + x) * 4;
      felt[i] = c[0]; felt[i + 1] = c[1]; felt[i + 2] = c[2]; felt[i + 3] = Math.round(Math.min(1, Math.abs(v)) * 255);
    }
  }
  const res = await sharp(felt, { raw: { width: S, height: S, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 85, effort: 6 })
    .toFile('public/textures/verde.webp');
  console.log('public/textures/verde.webp', `${res.width}x${res.height}`, `${(res.size / 1024).toFixed(1)} KB`);
}
