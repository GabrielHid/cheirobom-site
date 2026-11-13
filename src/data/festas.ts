// Cardápio de Natal e Réveillon 2026, transcrito de assets/menu-natal-e-reveillon.
// Mesma fonte para a página, o pedido e o schema Menu. Trocar o ano e as datas aqui a cada temporada.
import type { Section } from './menu';

// Divulgação no site: link "Natal" na navbar, destaque no menu do celular, etiqueta no hero e vitrine na home.
// Desligar (false) em janeiro, junto com a entrada da página em src/data/pages.ts.
export const divulgarFestas = true;

export const temporada = {
  ano: 2026,
  // Datas em ISO local (sem fuso): o script do contador compara com o relógio do cliente.
  natal: { encomendaAte: '2026-12-22', retirada: '2026-12-24', label: 'Natal' },
  reveillon: { encomendaAte: '2026-12-29', retirada: '2026-12-31', label: 'Réveillon' },
  horarioRetirada: 'das 18h às 20h',
  pagamento: 'Pix, dinheiro, débito e crédito',
  quandoPagar: 'na encomenda ou na retirada',
  // A chave Pix é o mesmo número do WhatsApp (arte "Informações importantes").
  pix: '(16) 99765-6146',
};

// A ceia é o destaque: fica fora das listas e ganha o próprio cartão na página.
export const ceia = {
  id: 'festas-ceia',
  name: 'Ceia Pernil Suíno',
  price: 440,
  serve: 'de 5 a 7 pessoas',
  items: [
    { qty: '', name: 'Pernil suíno' },
    { qty: '600g', name: 'Farofa da casa' },
    { qty: '1kg', name: 'Salada marroquina' },
    { qty: '1kg', name: 'Maionese' },
    { qty: '1,5kg', name: 'Arroz branco ou à grega' },
  ],
  arroz: ['Arroz branco', 'Arroz à grega'],
};

export const festasCarnes: Section = {
  id: 'festas-carnes',
  title: 'Carnes e kits',
  items: [
    { name: 'Kit Frango Assado', detail: 'Frango assado + 500g de maionese + 200g de farofa', price: 100 },
    { name: 'Costela Bovina Sous Vide', size: 'aprox. 500g', price: 80 },
    { name: 'Costelinha Suína Barbecue Sous Vide', size: 'aprox. 500g', price: 80 },
    { name: 'Kit Salada Marroquina', detail: '1kg de salada marroquina + 40 cestinhas', price: 110 },
  ],
};

export const festasAvulsos: Section = {
  id: 'festas-avulsos',
  title: 'Avulsos',
  note: 'Preço por quilo, a partir de 250g. Maionese, salada marroquina, salpicão e farofa levam ingredientes de origem animal: se preferir sem, avise no pedido.',
  itemAbout: 'Preço por quilo, a partir de 250g',
  items: [
    { name: 'Maionese', price: 68, unit: 'kg' },
    { name: 'Salada Marroquina', price: 68, unit: 'kg' },
    { name: 'Salpicão', price: 68, unit: 'kg' },
    { name: 'Berinjela de Forno', price: 68, unit: 'kg' },
    { name: 'Farofa', price: 53, unit: 'kg' },
    { name: 'Arroz à Grega', price: 50, unit: 'kg' },
    { name: 'Arroz Branco', price: 45, unit: 'kg' },
  ],
};

export const festasSobremesas: Section = {
  id: 'festas-sobremesas',
  title: 'Sobremesas',
  note: 'Tortas tamanho família, com cerca de 12 fatias.',
  items: [
    { name: 'Torta de Limão', price: 50, about: 'Torta tamanho família, com cerca de 12 fatias' },
    { name: 'Torta de Maracujá', price: 50, about: 'Torta tamanho família, com cerca de 12 fatias' },
    { name: 'Pudim de Leite Condensado', price: 45, about: 'Pudim de leite condensado, sobremesa do cardápio de Natal e Réveillon' },
  ],
};

// Seções do schema Menu da página. "Avulsos" sai como "Acompanhamentos por quilo", o nome que a página mostra
// (aba "Acompanhamentos" e o texto "acompanhamentos por quilo").
export const festasMenu: Section[] = [
  { id: 'festas-ceia', title: 'Ceia', items: [{ name: ceia.name, detail: `Serve ${ceia.serve}: ${ceia.items.map((i) => `${i.qty} ${i.name}`.trim()).join(', ')}`, price: ceia.price }] },
  festasCarnes,
  { ...festasAvulsos, title: 'Acompanhamentos por quilo' },
  festasSobremesas,
];
