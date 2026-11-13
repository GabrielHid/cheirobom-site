// URL canônica do site. Trocar aqui se a decisão de domínio mudar (ver seo.md, seção 2).
export const SITE_URL = 'https://rotisseriacheirobom.com.br';

// Páginas ainda sem dados confirmados: ficam com noindex e fora do sitemap.
export const DRAFT_PATHS = [];

// Data real da última mudança de conteúdo de cada página (vai para o <lastmod> do sitemap).
// Atualizar à mão quando o texto, os preços ou as datas da página mudarem: data de build não conta como mudança,
// e o Google ignora lastmod que muda sem a página mudar.
export const LASTMOD = {
  '/': '2026-11-12',
  '/cardapio/': '2026-11-12',
  '/natal-e-reveillon/': '2026-11-12',
};
