// Gera a imagem de compartilhamento da página de Natal (1200x630): o pernil no meio da guirlanda, como no topo da
// página, sobre o verde da noite com o mesmo céu de estrelas da vitrine, e o selo da loja à direita.
// Rodar: node scripts/make-og-natal.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { ceuFundo } from '../src/data/ceu.ts';

const W = 1200;
const H = 630;
const OUT = 'public/og/cheiro-bom-natal-e-reveillon.jpg';

// Fundo: verde da vitrine (#10301a), estrelas (tile 1440x820 recortado) e vinheta.
const stars = decodeURIComponent(ceuFundo().slice('url("data:image/svg+xml,'.length, -2));
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="#10301a"/>
  <g opacity=".9">${stars.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`);

// Guirlanda: mesma geometria do CSS (.fx-wreath-photo): foto em 58% da largura, a 20,42% / 20,78% da arte,
// com object-position 42% 66% e zoom de 1,45 a partir desse ponto.
const wreathH = 560;
const wreathW = Math.round((wreathH * 900) / 907);
const wx = 110;
const wy = Math.round((H - wreathH) / 2);
const d = Math.round(wreathW * 0.58);
const px = wx + Math.round(wreathW * 0.2042);
const py = wy + Math.round(wreathH * 0.2078);

const src = sharp('assets/menu-natal-e-reveillon/foto-pernil.jpg');
const { width: sw, height: sh } = await src.metadata();
const side = Math.min(sw, sh);
const zoom = 1.45;
const view = Math.round(side / zoom);
const left = Math.round((sw - side) * 0.42 + 0.42 * side * (1 - 1 / zoom));
const top = Math.round((sh - side) * 0.66 + 0.66 * side * (1 - 1 / zoom));
const circle = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}"/></svg>`);
const photo = await sharp('assets/menu-natal-e-reveillon/foto-pernil.jpg')
  .extract({ left, top, width: view, height: view })
  .resize(d, d)
  .composite([{ input: circle, blend: 'dest-in' }])
  .png()
  .toBuffer();

const wreath = await sharp('assets/natal/guirlanda.webp').resize(wreathW, wreathH).png().toBuffer();

// Selo (traço branco sobre transparente) à direita, centrado na altura da guirlanda.
const logoSize = 330;
const logo = await sharp('assets/brand/logo.png').resize(logoSize, logoSize).png().toBuffer();
const lx = W - 120 - logoSize;
const ly = Math.round((H - logoSize) / 2);

await mkdir('public/og', { recursive: true });
await sharp(bg)
  .composite([
    { input: photo, left: px, top: py },
    { input: wreath, left: wx, top: wy },
    { input: logo, left: lx, top: ly },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(OUT);

console.log(`${OUT} (${W}x${H})`);
