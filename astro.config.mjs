import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, DRAFT_PATHS, LASTMOD } from './site.config.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // As antigas páginas de produto foram removidas: o endereço leva ao cardápio, na seção certa.
  redirects: {
    '/frango-assado/': '/cardapio/#carnes',
    '/costela-sous-vide/': '/cardapio/#carnes',
    '/almoco-completo/': '/cardapio/#almoco-completo',
    '/congelados/': '/cardapio/#salgados-congelados',
    '/feijoada/': '/cardapio/#feijoada',
  },
  integrations: [
    sitemap({
      // Fora do sitemap: rascunhos, 404 e qualquer página de teste (/teste..., /rascunho...).
      filter: (page) => {
        const path = new URL(page).pathname;
        return !DRAFT_PATHS.includes(path) && !/^\/(404|teste|test|rascunho|draft)/.test(path);
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (!LASTMOD[path]) throw new Error(`Sitemap: falta a data de ${path} em LASTMOD (site.config.mjs)`);
        return { ...item, lastmod: LASTMOD[path] };
      },
    }),
  ],
});
