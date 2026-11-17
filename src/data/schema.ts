import { business, mapsUrl } from './business';
import { divulgarFestas, temporada } from './festas';
import { menu, type Item, type Section } from './menu';

const url = (path: string) => new URL(path, business.url).href;
export const RESTAURANT_ID = `${business.url}/#restaurante`;

// Regras do schema deste site:
// - Todo dado precisa bater com o texto visível e com o Perfil da Empresa no Google (mesmo nome, endereço e telefone).
// - aggregateRating e review ficam fora de propósito: em LocalBusiness controlado pelo próprio negócio a nota é
//   autodeclarada, e o Google proíbe repetir avaliações tiradas de outros sites.
// - Campo sem dado confirmado fica fora (nunca palpite nem placeholder).
export function restaurant() {
  const { postalCode, latitude, longitude, googleProfile } = business;
  // Fim de ano: retirada das encomendas na véspera, das 18h às 20h (mesmas datas da página de Natal).
  const [abre, fecha] = ['18:00:00', '20:00:00'];
  const especiais = divulgarFestas
    ? [temporada.natal.retirada, temporada.reveillon.retirada].map((dia) => ({
        '@type': 'OpeningHoursSpecification',
        validFrom: dia,
        validThrough: dia,
        opens: abre,
        closes: fecha,
      }))
    : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': RESTAURANT_ID,
    name: business.name,
    url: `${business.url}/`,
    telephone: business.phoneSchema,
    image: [url('/og/cheiro-bom-frango-assado.jpg')],
    logo: url('/apple-touch-icon.png'),
    priceRange: business.priceRange,
    servesCuisine: ['Brasileira', 'Rotisseria'],
    acceptsReservations: false,
    hasMenu: url('/cardapio/'),
    hasMap: googleProfile ?? mapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${business.street} - ${business.neighborhood}`,
      addressLocality: business.city,
      addressRegion: business.region,
      ...(postalCode ? { postalCode } : {}),
      addressCountry: 'BR',
    },
    ...(latitude && longitude ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } } : {}),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/Sunday', opens: '09:30:00', closes: '14:00:00' },
    ],
    ...(especiais.length ? { specialOpeningHoursSpecification: especiais } : {}),
    sameAs: [business.instagram, business.facebook, ...(googleProfile ? [googleProfile] : [])],
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${business.url}/#site`,
    url: `${business.url}/`,
    name: business.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': RESTAURANT_ID },
  };
}

// Descrição do MenuItem: o detalhe visível; senão, o texto do item ou da seção (sempre já mostrado na página);
// senão, o tamanho da porção.
function describe(item: Item, section: Section) {
  if (item.detail) return item.detail;
  if (item.about) return item.about;
  if (section.itemAbout) return section.itemAbout;
  if (item.size) return /\d/.test(item.size) ? `Porção de ${item.size}` : `Vendido por ${item.size}`;
  return undefined;
}

export function menuSchema(opts: { sections?: Section[]; path?: string; name?: string } = {}) {
  const { sections = menu, path = '/cardapio/', name = `Cardápio da ${business.name}` } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': url(`${path}#cardapio`),
    name,
    url: url(path),
    inLanguage: 'pt-BR',
    provider: { '@id': RESTAURANT_ID },
    hasMenuSection: sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.title,
      hasMenuItem: section.items.map((item) => {
        const description = describe(item, section);
        return {
          '@type': 'MenuItem',
          name: item.size ? `${item.name} ${item.size}` : item.name,
          ...(description ? { description } : {}),
          offers: {
            '@type': 'Offer', price: item.price.toFixed(2), priceCurrency: 'BRL',
            ...(item.unit ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: item.price.toFixed(2), priceCurrency: 'BRL', unitCode: 'KGM' } } : {}),
          },
        };
      }),
    })),
  };
}

// Só com perguntas e respostas que estão visíveis na mesma página (mesmo texto).
export function faqPage(items: { q: string; a: string }[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url(`${path}#faq`),
    inLanguage: 'pt-BR',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}
