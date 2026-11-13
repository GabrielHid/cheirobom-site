// Gera os desenhos de marca em src/assets/sketches/.
// Traço fino, sem preenchimento, cor herdada (currentColor), no espírito do ramo de alecrim do cardápio.
// Rodar: node scripts/make-sketches.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const out = new URL('../src/assets/sketches/', import.meta.url);
mkdirSync(out, { recursive: true });

const svg = (paths, viewBox = '0 0 64 64') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n${paths
    .map((d) => `  <path d="${d}"/>`)
    .join('\n')}\n</svg>\n`;

const knob = (x, y, r = 1.6) => `M${x + r} ${y}a${r} ${r} 0 1 1-${r * 2} 0 ${r} ${r} 0 0 1 ${r * 2} 0z`;
const steam = (x, y) => `M${x} ${y}c-1.4-2.3 1.4-4.2 0-6.5s1.4-4.2 0-6.5`;

const sketches = {
  // Frango assado inteiro na travessa, com raminho por cima
  frango: [
    'M4 47c0 3.6 12.5 6.5 28 6.5S60 50.6 60 47',
    'M4 47c1.6-1.6 5.4-2.7 9.4-3.1M60 47c-1.6-1.6-5.4-2.7-9.4-3.1',
    'M8 45c-1-9.5 6.5-17.5 17-18.5 4-.4 8 .3 11 1.8',
    'M53 37c1.6 2.4 2 5 1.6 8',
    'M8 45c7 1.6 15 2.4 23 2.4s16.4-.8 23.6-2.4',
    'M41 36.5c-1-6 3-12 9-14.5 2-.8 3.6.6 3 2.6-1.6 5.4-5.6 10-12 11.9z',
    'M52.4 21.6l1.6-2.4M53.6 18.6c.2-1.4 2.3-1.9 3-.6.8-.3 1.7.5 1.3 1.4-.4 1-1.8 1.1-2.5.4',
    'M35 34.5c-1.8-6 .5-12.5 6-16 1.8-1.1 3.6.1 3.2 2.1-1 5.6-4.2 10.6-9.2 13.9z',
    'M43.4 18.8l1.1-2.6M44.2 15.6c0-1.4 2-2.1 2.8-.9.8-.3 1.7.4 1.4 1.3-.3 1-1.6 1.2-2.4.6',
    'M13.5 37.5c3-3 7-4.6 11.5-5',
    'M12.5 42.5c4.5-2 10-3 16-2.8',
    'M17 30.5c2.6-2.6 5.6-4 8.8-4.4',
    'M20.4 28.4l-1.2-2.6M23.4 27l-.7-2.7M21.2 29.6l2.6.7M24.4 28l2.6.6',
  ],
  // Cumbuca de barro com vapor: acompanhamentos
  cumbuca: [
    'M12 33c0-2.2 9-4 20-4s20 1.8 20 4-9 4-20 4-20-1.8-20-4z',
    'M12 33.5c1 9.5 9 16.5 20 16.5s19-7 20-16.5',
    'M25 49.6l-1.2 3.9h16.4l-1.2-3.9',
    steam(25, 25),
    steam(32, 23),
    steam(39, 25),
  ],
  // Prato de massa com garfo enrolando
  massa: [
    'M6 41c0-4.4 11.6-8 26-8s26 3.6 26 8-11.6 8-26 8-26-3.6-26-8z',
    'M13 41.5c1.5 2.6 9.5 4.5 19 4.5s17.5-1.9 19-4.5',
    'M19 39c.4-5 5.6-8.4 13-8.4s12.6 3.4 13 8.4',
    'M23 38c1-3.6 4.6-5.4 9-5.4s8 1.8 9 5.4',
    'M27.5 37c.9-1.8 2.6-2.7 4.5-2.7s3.6.9 4.5 2.7',
    'M33 33L41.4 10.5',
    'M38.6 9.6l1.7-5.2M41.1 10.4l1.7-5.2M43.6 11.3l1.7-5.2',
    'M38.6 9.6c-.5 1.7.5 2.8 2.6 3.5s3.2 0 3.7-1.5',
  ],
  // Costela com marcas e ossos aparentes
  // Corte de carne com osso e capa de gordura: costela bovina
  costela: [
    'M10 31c0-9.5 9.5-16 22-16 13 0 22.5 6.5 22.5 15.5 0 6.2-4.2 10.4-10.5 12-4.2 1-6.4 4-10.4 6.2s-10.6 1.6-14.8-2.6C12.4 41.8 10 37.4 10 31z',
    'M15 31.5c.4-7 7.4-11.6 17-11.6 9.6 0 17 4.6 17.4 11',
    knob(42.5, 33.5, 3.6),
    'M20 39.5l5.5-6.5M26.5 42.5l6.5-7.6M33.5 43l4-4.6',
  ],
  // Pudim com calda escorrendo
  pudim: [
    'M8 50c0-2.8 10.7-5 24-5s24 2.2 24 5-10.7 5-24 5-24-2.2-24-5z',
    'M20 23c0-1.7 5.4-3 12-3s12 1.3 12 3-5.4 3-12 3-12-1.3-12-3z',
    'M29 23c0-.6 1.3-1 3-1s3 .4 3 1-1.3 1-3 1-3-.4-3-1z',
    'M20 23.5l-3.6 22.5M44 23.5l3.6 22.5',
    'M16.4 46c3 1.6 8.8 2.6 15.6 2.6s12.6-1 15.6-2.6',
    'M19.6 26.2c1.8 1.2 2.6 4.2 4.2 4.2s1.6-2.6 3.4-2.6 2 3.4 4.2 3.4 2.2-3.2 4-3.2 2 2.8 3.8 2.8 2.4-2.4 5-4.6',
  ],
  // Garrafa: bebidas
  garrafa: [
    'M28.5 4h7v3.5h-7z',
    'M29 7.5v6c0 3.6-6 6-6 12.5v27c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V26c0-6.5-6-8.9-6-12.5v-6',
    'M23 33h18M23 46h18',
    'M28 39.5c2.5-2 5.5-2.8 8.5-2.8',
    'M31 38.4l-1-2.2M33.6 37.4l-.6-2.3',
  ],
  // Pote com tampa, selo redondo e floco de neve: congelados
  congelado: [
    'M15.5 22h33a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-33A1.5 1.5 0 0 1 14 25.5v-2a1.5 1.5 0 0 1 1.5-1.5z',
    'M16.5 27l1.9 23.2c.1 1.4 1.3 2.4 2.6 2.4h22c1.3 0 2.5-1 2.6-2.4L47.5 27',
    'M38 39.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0z',
    'M29.5 40.5c1.5-1.6 3.2-2.4 5-2.6',
    'M32 4.5v13M26.4 7.8l11.2 6.4M37.6 7.8l-11.2 6.4',
    'M30.2 5.8l1.8 1.4 1.8-1.4M30.2 16.2l1.8-1.4 1.8 1.4',
  ],
  // Panela de barro com alças, grãos e vapor: feijoada
  feijoada: [
    'M10 27c0-2 9.8-3.6 22-3.6S54 25 54 27s-9.8 3.6-22 3.6S10 29 10 27z',
    'M11 28c0 13 8 22 21 22s21-9 21-22',
    'M10.8 31.5c-3-.2-5.2 1.8-4.3 4.3s3.6 2.1 5.4 1.4',
    'M53.2 31.5c3-.2 5.2 1.8 4.3 4.3s-3.6 2.1-5.4 1.4',
    'M21 27.4c0-.6.9-1 2-1s2 .4 2 1-.9 1-2 1-2-.4-2-1zM36.5 26.6c0-.6.9-1 2-1s2 .4 2 1-.9 1-2 1-2-.4-2-1z',
    'M30.5 27.2a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z',
    steam(26, 19),
    steam(38, 19),
  ],
  // Prato visto de cima com garfo e faca: almoço completo
  prato: [
    'M47 32a15 15 0 1 1-30 0 15 15 0 0 1 30 0z',
    'M41 32a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    'M9 13v8a2.5 2.5 0 0 0 5 0v-8M11.5 13v8M11.5 23.5v27',
    'M54 50.5v-37c-3.2 3-4.4 8.4-4.4 13.5H54',
    'M28.5 33.5c2-2.2 4.5-3.3 7-3.5M31.2 32l-1-2M33.6 30.9l-.6-2.1',
  ],
  // Cardápio impresso: passo "Escolha"
  cardapio: [
    'M18 8h28a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z',
    'M23 17.5c1.6-2.2 3.6 1.8 5.6 0s3.6 1.8 5.6 0 3.4 1 5 0',
    'M23 26h12M23 32.5h9M23 39h12M23 45.5h7',
    'M39.5 26h1.5M39.5 32.5h1.5M39.5 39h1.5M39.5 45.5h1.5',
  ],
  // Balão de mensagem: passo "Envie no WhatsApp"
  mensagem: [
    'M12 15h40a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H29l-9.5 8v-8H12a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3z',
    'M17 24h30M17 31h20',
    'M43 33.5c1.4-1.5 3-2.2 4.6-2.4',
  ],
  // Sacola de entrega com raminho: passo "Receba no domingo"
  sacola: [
    'M15 23h34l-1.8 29.2a2 2 0 0 1-2 1.8H18.8a2 2 0 0 1-2-1.8z',
    'M24 27v-6.5a8 8 0 0 1 16 0V27',
    'M27 43.5c3-3.2 6.4-4.8 10-5.2',
    'M30.2 41.4l-1.4-2.6M33.4 39.6l-.8-2.7M31.6 42.4l2.6.9M35 40.4l2.6.7',
  ],
};

// Ramo de alecrim: caule em curva e folhas finas alternadas, mais curtas na ponta.
function alecrim() {
  const P0 = [4, 25], C = [58, 24], P1 = [116, 7];
  const at = (t) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C[0] + t ** 2 * P1[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C[1] + t ** 2 * P1[1],
  ];
  const tan = (t) => {
    const x = 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]);
    const y = 2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1]);
    const n = Math.hypot(x, y);
    return [x / n, y / n];
  };
  const f = (n) => Math.round(n * 10) / 10;
  const paths = [`M${P0[0]} ${P0[1]}Q${C[0]} ${C[1]} ${P1[0]} ${P1[1]}`];
  let side = 1;
  for (let t = 0.2; t <= 0.97; t += 0.055) {
    const [x, y] = at(t);
    const [tx, ty] = tan(t);
    const ang = (side * 38 * Math.PI) / 180;
    const dx = tx * Math.cos(ang) - ty * Math.sin(ang);
    const dy = tx * Math.sin(ang) + ty * Math.cos(ang);
    const len = 11 - t * 5;
    const q = [x + dx * len, y + dy * len];
    const m = [(x + q[0]) / 2, (y + q[1]) / 2];
    const w = 1.5;
    const p = [-dy * w, dx * w];
    paths.push(`M${f(x)} ${f(y)}Q${f(m[0] + p[0])} ${f(m[1] + p[1])} ${f(q[0])} ${f(q[1])}Q${f(m[0] - p[0])} ${f(m[1] - p[1])} ${f(x)} ${f(y)}`);
    side = -side;
  }
  return svg(paths, '0 0 120 32');
}

for (const [name, paths] of Object.entries(sketches)) writeFileSync(new URL(`${name}.svg`, out), svg(paths));
writeFileSync(new URL('alecrim.svg', out), alecrim());
console.log(`${Object.keys(sketches).length + 1} desenhos em src/assets/sketches/`);
