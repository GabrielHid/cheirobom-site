// Transcrito de assets/menu. Mesma fonte para as páginas e para o schema Menu.
// unit 'kg': preço por quilo; no pedido o cliente escolhe de meio em meio quilo.
// about / itemAbout: descrição só para o schema (MenuItem.description) quando o item não tem detalhe visível.
// Precisa repetir o que a página já mostra, nunca informação nova.
export type Item = { name: string; detail?: string; size?: string; price: number; unit?: 'kg'; about?: string };
export type Section = { id: string; title: string; note?: string; itemAbout?: string; items: Item[] };

export const carnes: Section = {
  id: 'carnes',
  title: 'Carnes',
  items: [
    { name: 'Frango Assado', detail: 'Farofa de brinde', price: 55 },
    { name: 'Kit Frango Assado Completo', detail: 'Frango assado + 500g de maionese, farofa de brinde', price: 83 },
    { name: 'Kit Coxa e Sobrecoxa', detail: '500g de coxa e sobrecoxa + 250g de maionese, farofa de brinde', price: 52 },
    { name: 'Costelinha Suína', detail: 'Sous vide', size: '500g', price: 65 },
    { name: 'Costela Bovina', detail: 'Sous vide', size: '500g', price: 65 },
    { name: 'Coxa e Sobrecoxa', size: 'unidade', price: 15 },
  ],
};

export const acompanhamentos: Section = {
  id: 'acompanhamentos',
  title: 'Acompanhamentos',
  items: [
    { name: 'Arroz Branco', size: '500g', price: 20 },
    { name: 'Farofa', size: '500g', price: 24 },
    { name: 'Maionese', size: '500g', price: 31 },
    { name: 'Salada Marroquina', size: '500g', price: 31 },
    { name: 'Berinjela de Forno', size: '500g', price: 31 },
    { name: 'Feijão Gordo', size: '500g', price: 44 },
    { name: 'Feijão', size: '500g', price: 33 },
    { name: 'Farinha Temperada', size: '200g', price: 9 },
  ],
};

export const massas: Section = {
  id: 'massas',
  title: 'Massas',
  note: 'Molhos: sugo e bolonhesa',
  items: [
    { name: 'Nhoque de Batata', size: '500g', price: 33 },
    { name: 'Macarrão', size: '500g', price: 27 },
  ],
};

const comArroz = '750g de arroz + 500g de feijão + 500g de maionese + 200g de farofa';
const comMacarrao = '1kg de macarrão + 500g de maionese + 200g de farofa';

export const almoco: Section = {
  id: 'almoco-completo',
  title: 'Almoço completo',
  items: [
    { name: 'Coxa e Sobrecoxa 1', detail: '500g de arroz + 200g de feijão + 250g de maionese + 125g de farofa', size: 'até 3 pessoas', price: 83 },
    { name: 'Coxa e Sobrecoxa 2', detail: '600g de macarrão + 250g de maionese + 125g de farofa', size: 'até 3 pessoas', price: 83 },
    { name: 'Frango Assado 1', detail: comArroz, size: 'até 5 pessoas', price: 145 },
    { name: 'Frango Assado 2', detail: comMacarrao, size: 'até 5 pessoas', price: 135 },
    { name: 'Costela Bovina 1', detail: comArroz, size: 'até 5 pessoas', price: 165 },
    { name: 'Costela Bovina 2', detail: comMacarrao, size: 'até 5 pessoas', price: 155 },
  ],
};

export const bebidas: Section = {
  id: 'bebidas',
  title: 'Bebidas',
  items: [
    { name: 'Coca-Cola', size: '2L', price: 14 },
    { name: 'Coca-Cola Zero', size: '2L', price: 14 },
    { name: 'Fanta Laranja', size: '2L', price: 10 },
    { name: 'Sprite', size: '2L', price: 10 },
    { name: 'Guaraná Antarctica', size: '1,5L', price: 9 },
    { name: 'Roller', size: '2L', price: 9 },
    { name: 'Poty Guaraná', size: '2L', price: 9 },
    { name: 'Bioleve (limão)', size: '1,5L', price: 9 },
    { name: 'Guaraná Antarctica', size: '1L', price: 7 },
    { name: 'Suco de Laranja (Life)', size: '1,5L', price: 23 },
  ],
};

export const sobremesas: Section = {
  id: 'sobremesas',
  title: 'Sobremesas',
  note: 'Consultar disponibilidade',
  items: [
    { name: 'Pudim de Leite Condensado (fatia)', price: 9 },
    { name: 'Pudim de Leite Condensado', price: 6 },
    { name: 'Pudim Inteiro', price: 35 },
    { name: 'Bolo de Pote', price: 11 },
    { name: 'Torta de Limão', price: 22 },
  ],
};

export const congelados: Section = {
  id: 'salgados-congelados',
  title: 'Salgados congelados',
  items: [
    { name: 'Empadão (palmito ou frango)', size: '600g', price: 33 },
    { name: 'Kibe de Forno', size: '600g', price: 33 },
    { name: 'Esfiha de Carne', size: '600g', price: 33 },
    { name: 'Empada (palmito ou frango)', size: '200g', price: 13 },
  ],
};

export const menu: Section[] = [carnes, almoco, acompanhamentos, massas, bebidas, sobremesas, congelados];
