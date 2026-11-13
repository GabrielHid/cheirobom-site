// Qual desenho de marca acompanha cada categoria do cardápio (ids de src/data/menu.ts).
// As páginas de produto recortam seções com ids próprios; os kits (almoco-*, ate-*) caem no prato.
const byId: Record<string, string> = {
  carnes: 'frango',
  'almoco-completo': 'prato',
  acompanhamentos: 'cumbuca',
  massas: 'massa',
  bebidas: 'garrafa',
  sobremesas: 'pudim',
  'salgados-congelados': 'congelado',
  feijoada: 'feijoada',
  'opcoes-frango': 'frango',
  'opcoes-costela': 'costela',
  'festas-carnes': 'costela',
  'festas-avulsos': 'cumbuca',
  'festas-sobremesas': 'pudim',
};

export const sketchFor = (id: string) => byId[id] ?? 'prato';
