import { SITE_URL } from '../../site.config.mjs';

// Fonte única de NAP: HTML, schema e rodapé leem daqui.
// O texto deve ser idêntico ao do Perfil da Empresa no Google.
// null = dado que ainda falta. O schema omite o campo; nunca preencher com palpite.
export const business = {
  name: 'Cheiro Bom Rotisseria',
  shortName: 'Cheiro Bom',
  url: SITE_URL,
  street: 'Rua Nove de Julho, 3925',
  neighborhood: 'Jardim Dom Pedro I',
  city: 'Araraquara',
  region: 'SP',
  postalCode: '14802-257' as string | null,
  // Vindas do schema do site antigo. Conferir com o pino do Perfil da Empresa.
  latitude: -21.7855413 as number | null,
  longitude: -48.1766651 as number | null,
  phoneDisplay: '(16) 99765-6146',
  phoneE164: '+5516997656146',
  phoneSchema: '+55-16-99765-6146',
  whatsapp: 'https://wa.me/5516997656146',
  instagram: 'https://www.instagram.com/cheirobom.rotisseria/',
  facebook: 'https://www.facebook.com/cheirobom.rotisseria/',
  // TODO: colar o link curto do Perfil da Empresa no Google (botão "Compartilhar" do Perfil), por exemplo
  // 'https://maps.app.goo.gl/XXXXXXXXXXXXXXXXX'. Enquanto for null, o schema não leva o link (sem placeholder no ar)
  // e o botão "Ler as avaliações" usa a busca do Maps.
  googleProfile: null as string | null,
  hoursText: 'Domingos, das 9h às 14h',
  deliveryText: 'Domingos, das 11h às 14h',
  priceRange: 'R$7-R$165',
  // Atualizar junto com o Perfil. Texto visível apenas: não vai para o schema.
  rating: { value: '5,0', count: 34, asOf: 'novembro de 2026' },
};

export const fullAddress = `${business.street}, ${business.neighborhood}, ${business.city}/${business.region}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.name}, ${business.street}, ${business.city}, ${business.region}`,
)}`;

export const whatsappLink = (message: string) =>
  `${business.whatsapp}?text=${encodeURIComponent(message)}`;
