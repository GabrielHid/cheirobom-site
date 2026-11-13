// Avaliações reais do Google, citadas sem alteração.
// O Google pede consentimento de quem escreveu para usar a avaliação no marketing do negócio.
// Só vão para o site quando consent = true. Publicar com nome abreviado.
export type Review = { text: string; author: string; topic: string; consent: boolean };

export const reviews: Review[] = [
  { text: 'Faz jus ao nome. O melhor perfume para os almoços de domingo.', author: 'Eduardo W.', topic: 'home', consent: false },
  { text: 'Melhor frango assado de Araraquara', author: 'Jéssica S.', topic: 'frango', consent: false },
  { text: 'Finalmente encontrei um nhoque de verdade para comprar aqui em Araraquara.', author: 'Juliana R.', topic: 'home', consent: false },
  { text: 'Que delícia de almoço de domingo!', author: 'Anna C.', topic: 'almoco', consent: false },
  { text: 'Tanto o frango quanto a costelinha suína desmancham na boca.', author: 'Eduardo W.', topic: 'costela', consent: false },
  { text: 'Comida excelente, o empadão de frango é maravilhoso!', author: 'Isabela M.', topic: 'congelados', consent: false },
];

export const reviewsFor = (topic: string) => reviews.filter((r) => r.consent && r.topic === topic);
