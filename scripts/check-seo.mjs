// Auditoria do HTML gerado em dist/. Sai com erro se algo crítico falhar.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const NAP = ['Cheiro Bom Rotisseria', 'Rua Nove de Julho, 3925', '(16) 99765-6146'];
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});
const errors = [];
const seen = { titles: new Map(), descriptions: new Map() };
const text = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
const decode = (s) => s.replace(/&#34;|&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const sitemapFiles = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const sitemap = sitemapFiles.map((f) => readFileSync(join(DIST, f), 'utf8')).join('');

const rows = [];
for (const file of walk(DIST)) {
  const route = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  // Redirecionamentos do astro.config (antigas páginas de produto): não são páginas, ficam fora da checagem.
  if (/<meta http-equiv="refresh"/.test(html)) continue;
  const fail = (m) => errors.push(`${route}: ${m}`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = robots.includes('noindex');

  if (!/<html lang="pt-BR"/.test(html)) fail('lang ausente');
  // Title: até ~65 caracteres (o Google corta por largura, perto de 600px). Description: 140 a 160.
  if (!title || [...title].length > 65) fail(`title com ${[...title].length} caracteres`);
  if (!noindex && (!desc || [...desc].length < 140 || [...desc].length > 160)) fail(`description com ${[...desc].length} caracteres (140 a 160)`);
  if (!canonical) fail('sem canonical');
  else if (!route.includes('404') && !canonical.endsWith(route)) fail(`canonical diverge: ${canonical}`);
  const og = html.match(/property="og:image" content="([^"]*)"/)?.[1];
  if (!og) fail('sem og:image');
  else if (!existsSync(join(DIST, new URL(og).pathname))) fail(`og:image não existe: ${og}`);
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:type', 'og:locale', 'og:site_name', 'og:image:width', 'og:image:height', 'og:image:alt'])
    if (!html.includes(`property="${tag}"`)) fail(`sem ${tag}`);
  for (const tag of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'])
    if (!html.includes(`name="${tag}"`)) fail(`sem ${tag}`);
  if (!html.includes('name="theme-color" content="#0B3D12"')) fail('theme-color diferente de #0B3D12');
  if (canonical && (/[?#]/.test(canonical) || /[^:]\/\//.test(canonical))) fail(`canonical com parâmetro ou barra dupla: ${canonical}`);

  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) fail(`${h1} h1`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) fail(`heading pula de h${levels[i - 1]} para h${l}`); });

  // Preload de imagem (PreloadImage.astro) só vale se apontar para os mesmos arquivos do srcset da página.
  const [head, body = ''] = html.split('</head>');
  for (const l of head.match(/<link rel="preload" as="image"[^>]*>/g) ?? []) {
    const urls = [...(l.match(/imagesrcset="([^"]*)"/)?.[1] ?? '').matchAll(/(\/_astro\/\S+)/g)].map((m) => m[1]);
    if (!urls.length || urls.some((u) => !body.includes(u))) fail(`preload de imagem não bate com o srcset da página: ${l.slice(0, 90)}`);
  }

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    // alt vazio é válido em imagem decorativa; o atributo só não pode faltar.
    if (!/\salt(=|\s|>)/.test(img)) fail(`img sem alt: ${img.slice(0, 80)}`);
    if (!/\swidth=/.test(img) || !/\sheight=/.test(img)) fail(`img sem dimensões: ${img.slice(0, 80)}`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail('sem JSON-LD');
  const types = [];
  const parsed = [];
  for (const b of blocks) {
    try { const j = JSON.parse(b[1]); parsed.push(j); types.push(j['@type']); } catch { fail('JSON-LD inválido'); }
  }
  // Avaliação autodeclarada é vetada (diretrizes do Google para LocalBusiness).
  if (/"aggregateRating"|"@type":"(Review|AggregateRating)"/.test(blocks.map((b) => b[1]).join(''))) fail('schema vetado presente: avaliação');

  const visible = text(html);
  const squash = (t) => decode(t).replace(/\s+/g, ' ');
  // FAQPage só com pergunta e resposta que estão visíveis na mesma página, com o mesmo texto.
  for (const faq of parsed.filter((j) => j['@type'] === 'FAQPage')) {
    for (const q of faq.mainEntity) {
      if (!squash(visible).includes(q.name)) fail(`FAQ fora da página: ${q.name}`);
      if (!squash(visible).includes(q.acceptedAnswer.text)) fail(`resposta da FAQ fora da página: ${q.name}`);
    }
  }
  // Preço de cada MenuItem precisa aparecer na página.
  for (const menu of parsed.filter((j) => j['@type'] === 'Menu')) {
    for (const item of menu.hasMenuSection.flatMap((s) => s.hasMenuItem)) {
      if (!squash(visible).includes(`R$ ${Number(item.offers.price)}`)) fail(`preço do schema fora da página: ${item.name}`);
    }
  }
  if (visible.includes('—')) fail('travessão em texto visível');
  for (const n of NAP) if (!visible.includes(n)) fail(`NAP ausente: ${n}`);

  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const p = m[1];
    if (p.startsWith('/_astro') || /\.[a-z0-9]+$/i.test(p)) { if (!existsSync(join(DIST, p))) fail(`arquivo quebrado: ${p}`); continue; }
    if (!p.endsWith('/')) fail(`link sem barra final: ${p}`);
    if (!existsSync(join(DIST, p, 'index.html'))) fail(`link quebrado: ${p}`);
  }

  const inSitemap = canonical ? sitemap.includes(`<loc>${canonical}</loc>`) : false;
  if (noindex && inSitemap) fail('noindex dentro do sitemap');
  if (!noindex && !inSitemap) fail('indexável fora do sitemap');
  if (!noindex) {
    for (const [map, v] of [[seen.titles, title], [seen.descriptions, desc]]) {
      if (map.has(v)) fail(`duplicado com ${map.get(v)}: ${v}`);
      map.set(v, route);
    }
  }
  rows.push({ rota: route, title: title.length, desc: desc.length, palavras: visible.trim().split(/\s+/).length, kb: Math.round(html.length / 1024), robots: noindex ? 'noindex' : 'index', schema: types.join('+') });
}

console.table(rows);
if (errors.length) {
  console.error(`\n${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('\nOK: nenhum problema encontrado.');
