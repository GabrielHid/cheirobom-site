// Links do cardápio: mesma lista para o menu do celular ("No cardápio") e o rodapé.
// Não há páginas por produto: tudo leva ao cardápio (/cardapio/), direto na seção da categoria.
import { menu } from './menu';

export const pages = [
  { name: 'Cardápio completo', path: '/cardapio/' },
  // Sazonal: tirar daqui em janeiro, junto com a página (ou trocar por noindex).
  { name: 'Natal e Réveillon', path: '/natal-e-reveillon/' },
  ...menu.map((s) => ({ name: s.title, path: `/cardapio/#${s.id}` })),
];

// Seções da home: a navegação principal segue as perguntas do cliente, não as categorias do cardápio.
export const sections = [
  { name: 'Cardápio', path: '/cardapio/' },
  { name: 'Como pedir', path: '/#como-pedir' },
  { name: 'Sobre', path: '/#sobre' },
  { name: 'Onde fica', path: '/#contato' },
];
