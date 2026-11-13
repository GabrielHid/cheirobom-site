// Céu de estrelas das seções escuras de Natal (fechamento da página e vitrine da home).
// Pontos fixos (semente constante, sai igual em todo build), mais densos no alto. Tile de 1440x820 usado como
// background-image; quem usa repete na horizontal (1440px auto, repeat-x) e apaga a parte de baixo com máscara.
export function ceuFundo() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let dots = '';
  for (let i = 0; i < 170; i++) {
    const x = rnd() * 1440;
    const y = Math.pow(rnd(), 1.9) * 820;
    const r = 0.6 + rnd() * 0.9;
    const o = 0.3 + rnd() * 0.5;
    const c = rnd() < 0.6 ? '#efe0ac' : '#f9f8f5';
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${c}" opacity="${o.toFixed(2)}"/>`;
  }
  // Algumas mais brilhantes, com halo.
  for (let i = 0; i < 12; i++) {
    const x = rnd() * 1440;
    const y = Math.pow(rnd(), 1.5) * 600;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#e9cf7a" opacity=".08"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#f6e7b8" opacity=".85"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="820">${dots}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
