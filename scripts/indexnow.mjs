// Avisa o IndexNow (Bing, Yandex, Seznam, Naver e outros) das URLs do sitemap. Rodar DEPOIS do deploy:
//   npm run indexnow             lê o sitemap publicado e envia
//   npm run indexnow -- --dry-run  mostra o que enviaria, sem enviar
//   npm run indexnow -- --local    usa o sitemap de dist/ (as URLs continuam sendo as do domínio)
// A chave vem do .env (INDEXNOW_KEY). O único lugar público com ela é public/<chave>.txt, que o IndexNow lê para
// confirmar que o site é nosso.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { SITE_URL } from '../site.config.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const local = args.has('--local');

if (existsSync('.env')) process.loadEnvFile('.env');
const key = process.env.INDEXNOW_KEY?.trim();
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error('INDEXNOW_KEY ausente ou inválida no .env (8 a 128 caracteres: letras, números e hífen).');
  process.exit(1);
}
const keyFile = `public/${key}.txt`;
if (!existsSync(keyFile) || readFileSync(keyFile, 'utf8').trim() !== key) {
  console.error(`${keyFile} não existe ou não contém a chave do .env.`);
  process.exit(1);
}

const site = new URL(SITE_URL);
const keyLocation = new URL(`/${key}.txt`, site).href;
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

async function get(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${url} respondeu ${res.status}`);
  return res.text();
}

let urls;
if (local) {
  if (!existsSync('dist')) throw new Error('dist/ não existe: rode npm run build antes.');
  urls = readdirSync('dist').filter((f) => /^sitemap-\d+\.xml$/.test(f)).flatMap((f) => locs(readFileSync(`dist/${f}`, 'utf8')));
} else {
  const index = await get(new URL('/sitemap-index.xml', site).href);
  urls = (await Promise.all(locs(index).map(async (s) => locs(await get(s))))).flat();
}
// Só URLs do próprio host (o IndexNow recusa o lote inteiro se uma for de outro domínio).
urls = [...new Set(urls)].filter((u) => new URL(u).host === site.host);
if (!urls.length) throw new Error('Nenhuma URL encontrada no sitemap.');

const payload = { host: site.host, key, keyLocation, urlList: urls };
console.log(`${urls.length} URLs:\n  ${urls.join('\n  ')}`);

if (dryRun) {
  console.log('\n--dry-run: nada foi enviado.');
  process.exit(0);
}

// O IndexNow valida a chave lendo o arquivo publicado: se ele ainda não estiver no ar, o envio falha com 403.
const published = await get(keyLocation).catch((e) => e.message);
if (published.trim() !== key) {
  console.error(`O arquivo da chave não está no ar com o valor certo (${keyLocation}): ${published.slice(0, 80)}`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
const meaning = {
  200: 'OK, URLs recebidas.',
  202: 'Aceito. A chave ainda está sendo validada; normal no primeiro envio.',
  400: 'Pedido inválido.',
  403: 'Chave não confirmada: o arquivo da chave não bate.',
  422: 'URLs não pertencem ao host ou a chave não confere.',
  429: 'Envios demais. Tente mais tarde.',
};
console.log(`\nIndexNow: ${res.status} ${meaning[res.status] ?? (await res.text())}`);
process.exit(res.ok ? 0 : 1);
