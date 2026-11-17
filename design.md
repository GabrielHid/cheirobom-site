# design.md · Cheiro Bom Rotisseria

> Direção de design da landing page da Cheiro Bom (o que aparece no Google e no Google Meu Negócio).
> O sistema de pedidos/login é outro projeto e **não** entra aqui.
> Ponto de partida: **do zero**. O site atual não é referência de nada. A fonte da verdade visual é a marca como ela aparece no Instagram, na loja e nas embalagens.
> Este arquivo separa **FIXOS** (marca, fatos, conteúdo real) de **TERRITÓRIO LIVRE** (layout, composição, animação). No território livre, a regra é ousar e justificar, não pedir permissão.

---

## 1. A alma do negócio

**O que é:** rotisseria artesanal de família em Araraquara/SP. Frango assado é o carro-chefe; costela bovina e costelinha suína sous vide, feijoada, acompanhamentos, massas, tortas, salgados e marmitas congeladas.

**Como a marca se vê (pelo feed):** não é "rotisseria de bairro" nem restaurante chique. É **a cozinha de uma casa bonita num domingo**: mesa de madeira, cumbuca de barro, prato azul listrado, vaso terracota, folhagem atrás, ramo de alecrim. Elegante sem ser fria, caseira sem ser simples.

**O nome é o conceito:** "Cheiro Bom". O cheiro do frango assando é a memória que a marca vende. O site precisa fazer o visitante *quase sentir o cheiro*: calor, vapor, pele dourada, alecrim.

**O dia:** domingo é o dia dela ("Domingo é dia de feijoada", almoço de domingo, 9h30 às 14h). O domingo é protagonista, não rodapé.

**Público:** famílias de Araraquara, 30 a 65 anos, que decidem o almoço no sábado à noite ou domingo de manhã, no celular. Chegam pelo Google, Google Meu Negócio e Instagram.

**Tom de voz:** caseiro, carinhoso, direto. O próprio feed já fala assim: "É só aquecer e saborear", "Mãe merece descanso... e almoço especial também!", "Deixe a cozinha com a Cheiro Bom". Nada de "experiência gastronômica", "jornada", "momentos especiais".

**Objetivo de conversão (único):** pedido no WhatsApp. Tudo serve a isso.

---

## 2. FIXOS: identidade da marca (extraída do Instagram)

### Logo e símbolo
- **Logotipo:** "Cheiro Bom" em script caligráfico + "ROTISSERIA" em serifa caixa-alta com tracking largo + **ramo de alecrim**. Versão selo: tudo dentro de um círculo de linha fina.
- Usar o arquivo original (SVG/PNG em `/assets/brand/`). **Nunca recriar o logo com fonte.**
- O **alecrim** é o ícone da marca. Pode virar motivo gráfico (traço desenhado, divisor, cursor, marca d'água), sempre em linha fina como no cardápio.

### Sistema tipográfico da marca (o que o feed mostra)
O DNA tem três vozes, e o site deve respeitar as três:

| Voz | Onde aparece no feed | Uso no site |
|---|---|---|
| **Serifa elegante caixa-alta espaçada** | Itens do cardápio ("FRANGO ASSADO", "ARROZ BRANCO"), "ROTISSERIA" | Nomes de pratos, labels, navegação, preços |
| **Script caligráfico** | Logo, categorias do cardápio ("Carnes", "Acompanhamentos", "Massas"), "com barbecue", "mães" | Só como acento: categorias, uma palavra por título. Nunca parágrafo |
| **Serifa display pesada** | "Costelinha", "FEIJOADA", "DOMINGO É DIA DE" | Headlines grandes |

Os posts também usam uma **sans black genérica** ("Marmitas", "MACIA, SUCULENTA", "O que é Sous Vide?"). Isso é ruído de template de Canva e **fica fora do site**.

Candidatas para testar (o objetivo é casar com a marca, não com as fontes exatas do Canva):
- **Serifa display:** Gloock, Young Serif, DM Serif Display, Playfair Display (Black, só se for a que mais casa com "Costelinha" e "FEIJOADA").
- **Serifa caixa-alta espaçada:** Cormorant Garamond (600, caps, tracking 0.2 a 0.3em), Bodoni Moda, Libre Caslon Display.
- **Script:** Pinyon Script, Mrs Saint Delafield, Monsieur La Doulaise (mais próximas das categorias do cardápio).
- **Texto corrido:** Instrument Sans, Figtree ou Onest (legibilidade no celular).
- Pendente: perguntar a quem faz os posts quais fontes usa. Se forem do Google Fonts, usar as mesmas.

### Paleta (k-means em CIELAB sobre os arquivos de `assets/raw`, `assets/brand` e `assets/menu`; reproduzir com `uv run scripts/extract_palette.py <pasta>`)

| Papel | De onde veio | Hex | Antes (ΔE2000) |
|---|---|---|---|
| **Verde Cheiro Bom** (marca) | `apple-touch-icon.png`, 93% dos pixels; ramo verde confirma | `#073701` | `#023702` a `#063700` (0,7 / 0,2) |
| Verde selo | Moldura do cardápio impresso | `#186B0E` | novo |
| Verde folha | Folhas em `frango-assado` e `maionese` | `#265B12` / sombra `#18340B` | `#244319` (9,1 / 4,7) |
| Verde adesivo | Adesivo redondo da embalagem (`torta-limao`) | `#3E5C47` | novo |
| Papel cardápio | Fundo do cardápio (`assets/menu`) | `#F9F8F5` | `#F9F8F6` (0,5) |
| Barro | Cumbucas: cluster do passe cromático / sombra (`coxa-sobrecoxa`) | `#7F2911` / sombra `#5A1714` | Terracota `#9D502C` (11,7 / 20,5) |
| Vaso terracota | Vaso claro (`costela`) / vaso vermelho (`pudim`) | `#D4734E` / `#962D20` | Terracota `#9D502C` (16,0 / 10,5) |
| Madeira tora | Tora e tábua (`imagem-background`, `berinjela`) | `#956B44` | novo; `#C27921` não descreve a tora (12,8) |
| Madeira mel | Mesa envernizada (`pudim`) | `#D08043` | `#C27921` (6,6) |
| Dourado frango | Pele do frango inteiro (`frango-assado`) | `#CC8F2E` | `#B88A35` / `#BE832A` (4,7 / 4,1) |
| Tostado | Pele da coxa assada (`coxa-sobrecoxa`) | `#B95D3F` | `#925038` (9,3) |
| Farofa | `farofa`, `costela` | `#CDB047` | `#D3B35B` (2,9) |
| Crosta | Crosta da costela (`costela`) | `#301B16` | novo |
| Azul prato | Prato fosco (`costela`) | `#545A7B` | `#395894` / `#5B6C8C` (9,0 / 7,4) |
| Azul toalha | Xadrez azul e branco (`macarrao`); cluster `#2E427A` confirma | `#253C79` | `#2C68B1` (16,0) |
| Parede azul-petróleo | `torta-limao` na sombra / `pudim` com luz | `#202D35` / luz `#7794A0` | `#25281F` / `#4F6D6D` (11,2 / 16,8) |
| Ardósia | Fundo escuro (`kibe-e-empadao`) | `#4D5259` | novo |

**Sem fonte nos assets (hex vindos dos prints, não validados):**

| Papel | Hex mantido | O que falta |
|---|---|---|
| **Corten** | `#89553B` / claro `#A17761` | Foto do letreiro de dia: a de noite é contraluz e não mostra a cor do metal |
| Marrom feijoada | `#4D2013` (próximo do barro real `#571C0E`, ΔE 3,4) | Mantido como cor de texto. A foto da feijoada, com flash, dá `#593426` a `#774C34`, claro demais para esse papel |
| Maracujá | `#EDC409` (nenhuma foto chega perto; não usar até ter foto) | Foto da torta de maracujá |

**Notas da extração:**
- A parede das fotos é **azul-petróleo**, não verde-petróleo. Em várias fotos ela é clara (cinza ou branca).
- O "prato azul listrado" não está em `assets/raw`. O que existe é o prato fosco ardósia (`costela`) e a toalha xadrez azul (`macarrao`).
- A capa do cardápio em `pudim.jpg` mede `#3F494C`, grafite, não verde.
- Contraste sobre papel: `#073701` 12,7 · `#301B16` 15,3 · `#253C79` 9,9 · `#7F2911` 8,9 · `#186B0E` 6,3 · `#545A7B` 6,3 passam para texto. `#956B44` 4,4 e `#B95D3F` 4,2 só em texto grande. `#D4734E` 3,1 e `#CC8F2E` 2,6 nunca em texto sobre papel.
- Contraste sobre verde marca: papel 12,7 · farofa 6,4 · dourado 4,8.

**Leitura:** verde de marca + papel claro como base; corten, terracota e madeira como calor; dourado da comida como protagonista; o **azul do prato** é o contraponto inesperado que separa a Cheiro Bom de qualquer outro site de comida (usar com parcimônia, ex.: um detalhe, um selo, um hover).

O site alterna **seções claras (papel)** e **seções verde-escuro (marca)**, como o próprio feed alterna. Não é site todo escuro (isso era o Keukenhof) nem todo branco.

### Fotografia (o estilo que já existe e deve ser seguido)
- Close de comida em **mesa de madeira** ou **tora rústica**, **cumbuca de barro**, **prato azul listrado**, **folhagens tropicais e vaso terracota** ao fundo, parede escura.
- Embalagens com marca: pote transparente com adesivo redondo, saco a vácuo da farofa com logo, cardápio em capa verde.
- **Letreiro de corten** com o logo vazado na fachada: o asset mais forte e único da marca.
- Fotos reais vão em `/assets/raw/`. Nunca banco de imagem. Se faltar qualidade, tratar (denoise/upscale), não substituir.

---

## 3. FIXOS: dados e cardápio

### Dados
- Site: `https://rotisseriacheirobom.com.br` (domínio do cliente; hoje com site Angular na Vercel, com preços defasados, a ser substituído)
- Endereço: Rua Nove de Julho, 3925, Jardim Dom Pedro I, Araraquara/SP, 14802-257
- WhatsApp: (16) 99765-6146 · `https://wa.me/5516997656146`
- Instagram @cheirobom.rotisseria · Facebook /cheirobom.rotisseria
- Horário: domingos, 9h30 às 14h, apenas aos domingos por enquanto (confirmado pelo cliente). Datas especiais têm cardápio e horário próprios (Natal, Ano-Novo, Sexta-feira Santa).
- Delivery: domingos, 11h às 14h (confirmado pelo cliente; os entregadores chegam às 10h30)
- Modalidades: retirada, delivery, encomenda antecipada
- Google: 5,0 com 34 avaliações em novembro de 2026; categoria exibida "Frango". **Atualizar** no build.
- Tempo de casa: "há mais de 6 anos" (fonte: site antigo)

### Cardápio (transcrito de `assets/menu`, 3 imagens; preços confirmados pelo cliente em novembro de 2026)

**Carnes**

| Item | Detalhe | Porção | Preço |
|---|---|---|---|
| Frango Assado | Farofa de brinde | | R$55 |
| Kit Frango Assado Completo | Frango assado + 500g maionese, farofa de brinde | kit | R$83 |
| Kit Coxa e Sobrecoxa | 500g coxa e sobrecoxa + 250g maionese, farofa de brinde | kit | R$52 |
| Costelinha Suína | Sous vide | 500g | R$65 |
| Costela Bovina | Sous vide | 500g | R$65 |
| Coxa e Sobrecoxa | | un. | R$15 |

**Acompanhamentos**

| Item | Porção | Preço |
|---|---|---|
| Arroz Branco | 500g | R$20 |
| Farofa | 500g | R$24 |
| Maionese | 500g | R$31 |
| Salada Marroquina | 500g | R$31 |
| Berinjela de Forno | 500g | R$31 |
| Feijão Gordo | 500g | R$44 |
| Feijão | 500g | R$33 |
| Farinha Temperada | 200g | R$9 |

**Massas** (molhos: sugo e bolonhesa)

| Item | Porção | Preço |
|---|---|---|
| Nhoque de Batata | 500g | R$33 |
| Macarrão | 500g | R$27 |

**Almoço completo** (kits)

| Kit | Acompanhamentos | Serve | Preço |
|---|---|---|---|
| Coxa e Sobrecoxa 1 | 500g arroz + 200g feijão + 250g maionese + 125g farofa | até 3 | R$83 |
| Coxa e Sobrecoxa 2 | 600g macarrão + 250g maionese + 125g farofa | até 3 | R$83 |
| Frango Assado 1 | 750g arroz + 500g feijão + 500g maionese + 200g farofa | até 5 | R$145 |
| Frango Assado 2 | 1kg macarrão + 500g maionese + 200g farofa | até 5 | R$135 |
| Costela Bovina 1 | 750g arroz + 500g feijão + 500g maionese + 200g farofa | até 5 | R$165 |
| Costela Bovina 2 | 1kg macarrão + 500g maionese + 200g farofa | até 5 | R$155 |

**Bebidas**

| Item | Volume | Preço |
|---|---|---|
| Coca-Cola | 2L | R$14 |
| Coca-Cola Zero | 2L | R$14 |
| Fanta Laranja | 2L | R$10 |
| Sprite | 2L | R$10 |
| Guaraná Antarctica | 1,5L | R$9 |
| Roller | 2L | R$9 |
| Poty Guaraná | 2L | R$9 |
| Bioleve (limão) | 1,5L | R$9 |
| Guaraná Antarctica | 1L | R$7 |
| Suco de Laranja (Life) | 1,5L | R$23 |

**Sobremesas** (consultar disponibilidade)

| Item | Preço |
|---|---|
| Pudim de Leite Condensado (fatia) | R$9 |
| Pudim de Leite Condensado | R$6 |
| Pudim Inteiro | R$35 |
| Bolo de Pote | R$11 |
| Torta de Limão | R$22 |

**Salgados congelados**

| Item | Peso | Preço |
|---|---|---|
| Empadão (palmito ou frango) | 600g | R$33 |
| Kibe de Forno | 600g | R$33 |
| Esfiha de Carne | 600g | R$33 |
| Empada (palmito ou frango) | 200g | R$13 |

**Fora das 3 imagens (mantido da versão anterior, confirmar):**
- **Feijoada:** consultar disponibilidade (confirmado pelo cliente). O site não mostra preço até confirmar estes valores antigos: Combo completo R$90 (700g feijoada, 700g arroz, 100g farinha temperada, 130g vinagrete, serve 2) · avulsos: 700g feijoada R$63, demais itens confirmar.
- **Só no feed, sem preço:** Costelinha com barbecue · Marmitas congeladas · Torta de maracujá · Salgados assados.

**Confirmar com a dona:**
- Pudim de Leite Condensado R$6 custa menos que a fatia (R$9) e não diz o tamanho. Pudim Inteiro R$35 aparece igual no site antigo.
- Torta de Limão R$22: o site antigo chama de "Pequena" (R$20). Confirmar o tamanho.
- Kits Coxa e Sobrecoxa 1 e 2: o cardápio mostra um só preço (R$83, até 3 pessoas) entre os dois. Lido como valendo para ambos.
- Kits do Almoço completo não dizem a quantidade de carne (costela e coxa).
- Grafias corrigidas na transcrição: "Cola Cola Zero" virou Coca-Cola Zero, "Antartica" virou Antarctica.

---

## 4. Referências e grounding

**Vocabulário de busca** (em inglês, segmentos vizinhos, nunca "restaurant website"):
`rotisserie`, `sunday roast`, `deli`, `boucherie`, `botanical`, `herb`, `home kitchen`, `ceramics studio`, `terracotta`, `corten`, `plant shop`, `family recipes`, `farm to table`
Galerias: Awwwards, Godly, Land-book, Lapa Ninja, Site Inspire.

Pistas de segmento vizinho: **estúdio de cerâmica** (barro, terracota, textura), **floricultura/plant shop** (folhagem, linha botânica), **ateliê de metal/corten** (ferrugem, recorte vazado). A comida entra como protagonista sobre esse cenário.

---

## 5. Arquitetura da informação (em vigor desde novembro de 2026)

A home anterior tinha 12 blocos, cinco deles pedaços do cardápio espalhados, e a informação prática dividida em três lugares. Foi refeita pelas perguntas do cliente, na ordem em que ele faz (pirâmide invertida, NN/g; "4 Ps" da BrightLocal: produto, preço, lugar e telefone):

| # | Seção (âncora) | Pergunta que responde |
|---|---|---|
| 0 | Hero + faixa de fatos | O que é, quando abre, como peço? |
| 1 | Cardápio (`#cardapio`) | O que tem e quanto custa? 3 destaques (frango maior) + índice de todas as categorias com faixa de preço |
| 2 | Como pedir (`#como-pedir`) | Como funciona? 3 passos + retirada e delivery |
| 3 | Sobre (`#sobre`, `#avaliacoes`, `#galeria`) | Posso confiar? Família, nota, fotos |
| 4 | Dúvidas (`#faq`) | O que mais preciso saber? |
| 5 | Onde fica (`#contato`) | Como chego? |

**Hierarquia fixa** (todas as seções e páginas, componente `SectionHead`): rótulo em versalete > título em serifa display > resumo > conteúdo > ação. Quem só lê os títulos entende a página (padrão layer-cake, NN/g).

**Navegação:** o topo segue as seções (Cardápio, Como pedir, Sobre, Onde fica + Pedir). As páginas de produto aparecem no índice do cardápio, no menu do celular como lista secundária, no rodapé e no "Veja também" (`src/data/pages.ts` é a fonte das duas listas).

**Páginas internas:** mesmo esqueleto em todas: título > fatos (`Facts`: preço, retirada, delivery, onde) > preços > como pedir > dúvidas > veja também.

**Desenhos de marca:** 13 desenhos próprios em linha fina (`src/assets/sketches/`, gerados por `scripts/make-sketches.mjs`), usados pelo componente `Sketch`. O mapa categoria → desenho fica em `src/data/sketches.ts`. Aparecem no índice do cardápio, nos títulos das categorias, nos passos de "Como pedir" e, o ramo de alecrim, acima dos rótulos de Cardápio e Sobre e no rodapé. Traçam-se ao entrar na tela (GSAP DrawSVG). Os ícones da Lucide continuam só para informação prática (horário, endereço, delivery). Costela em traço mínimo virava "inseto" ou "coroa": o desenho usa o corte com osso.

## 5b. Arquitetura original (histórico)

> **Atualização (novembro de 2026):** o hero "O calor" (palavra gigante sobre o frango) foi trocado pelo **"Cardápio aberto"**: fundo papel com textura (`public/textures/papel.webp`, gerada por `scripts/make-paper.mjs`), título à esquerda, frango num arco ao centro com o calor só dentro dele, e os preços das carnes à direita, lidos de `src/data/menu.ts`. A mesma textura cobre todas as superfícies claras pelo token `--papel-fundo` (no `body`, na `.rest` e no painel de pedido); as seções `.papel` ficam transparentes para a textura correr sem emenda. Os fundos verdes grandes (seções `.verde`, rodapé, menu, selo, painel do celular e barras fixas) usam o feltro `--verde-fundo` (`public/textures/verde.webp`, mesmo script); botões e chips verdes ficam lisos. Para SEO local, a landing única virou um site enxuto com home + páginas dedicadas (`/cardapio/`, `/frango-assado/`, `/costela-sous-vide/`, `/almoco-completo/`, `/congelados/` e `/feijoada/` em rascunho). A lista abaixo descreve a home. Estrutura, palavras-chave e pendências estão em [seo.md](seo.md).

1. **Hero "Domingo"**
   Comida em tela cheia (frango ou vídeo dele girando) com **calor/vapor subindo** via shader. Headline em serifa display com uma palavra em script. Chip de status ao vivo: *"Aberto agora, até 14h"* / *"Abre domingo às 9h30 · faltam 2 dias"*. CTA WhatsApp.
   Alternativa a testar: o **letreiro de corten** como elemento de entrada (luz atravessando o logo vazado e revelando a comida).
   Proibido: texto à esquerda + imagem à direita.

2. **Manifesto curto** (fundo verde marca)
   3 ou 4 frases reais reveladas no scroll, com o alecrim se desenhando em linha.

3. **Cardápio** (fundo papel, inspirado no cardápio impresso deles)
   Categorias em script, itens em caixa-alta espaçada, preços tabulares, linhas botânicas finas como marca d'água (igual ao cardápio físico, mas vivo).
   **Montar pedido:** o cliente marca itens e quantidades, vê o total, escolhe retirada/delivery e o botão gera a mensagem pronta no WhatsApp. Sem backend. Maior ganho de conversão da página.

4. **Domingo é dia de feijoada** (destaque sazonal)
   Bloco editorial grande para o combo, no estilo do post: serifa pesada marrom, foto da cumbuca. Estrutura pensada para trocar de destaque (Dia das Mães, Natal, Costelinha barbecue) sem refazer layout.

5. **O ritual de domingo** (linha do tempo)
   Encomenda antecipada (semana) → abre 9h30 → retirada/delivery → 14h acabou.

6. **Sous vide, explicado** (opcional)
   O feed já educa sobre sous vide. Uma seção curta e visual dá diferencial e conteúdo para SEO ("costela sous vide araraquara").

7. **Marmitas congeladas**
   "É só aquecer e saborear." Venda para o resto da semana.

8. **Galeria** com a estética do feed (madeira, barro, prato azul, plantas). Scroll horizontal no desktop.

9. **Quem prova:** avaliações reais do Google, nota visível no HTML.

10. **Onde fica:** letreiro de corten + endereço + horário + mapa + FAQ.

11. **CTA final** + no mobile, **CTA WhatsApp fixo inferior** em toda a página.

---

> **Navegação escolhida pelo cliente:** menu "Letreiro" (`src/components/SiteNav.astro`), faixa reta com selo pendurado no centro e painel em camadas no celular. Botões, abas e categorias usam cantos retos. Pílula e vidro foram rejeitados por destoarem da marca.

## 6. Animação (mapa por efeito, mobile decidido um a um)

| Efeito | Desktop | Mobile | Ferramenta |
|---|---|---|---|
| Calor/vapor no hero | Shader: o ar sobe do frango e entorta "Domingo", que passa atrás do peito | Mesmo shader em DPR 1; desliga sozinho em aparelho lento | WebGL puro (`src/scripts/hero-heat.ts`, 8 KB) |
| Corten com luz (se escolhido) | Plano com textura de corten, logo vazado, luz varrendo com o mouse | Luz automática em loop lento | Three.js (materials, lighting, textures) |
| Alecrim se desenhando | SVG stroke draw no scroll | Mantém, mais curto | GSAP DrawSVG |
| Manifesto | Palavra por palavra no scroll (scrub) | Por frase | GSAP SplitText |
| Linhas botânicas do cardápio | Parallax leve | Estático | GSAP |
| Montar pedido | Item voa pro resumo, total anima | Barra de resumo fixa embaixo com micro feedback | GSAP / CSS |
| Galeria | Pin + scroll horizontal | Swipe nativo (scroll-snap) | GSAP / CSS |
| Scroll | Smooth | Nativo | Lenis só desktop |

Regras:
- `prefers-reduced-motion`: desliga shaders e scrubs, mostra imagem estática.
- Three.js no máximo em 1 ou 2 momentos. Se não fizer sentir o cheiro ou a marca, corta.
- LCP < 2,5s em 4G no celular. Canvas carrega depois da imagem do hero (a imagem é o LCP).

---

## 7. Stack (decidido)

**Astro + WebGL puro no hero + GSAP (ScrollTrigger, SplitText) + Lenis**, deploy na **Vercel**, onde o domínio já aponta. A coreografia fica em `src/scripts/motion.ts` e a interface que funciona sem animação em `src/scripts/ui.ts`. Site estático, separado do sistema.
Three.js saiu do hero: é um único plano com shader, e a biblioteca pesaria mais de 100 KB no celular sem ganho visível.
Motivo: SEO local forte (HTML puro, zero JS onde não precisa), ilhas de interatividade só no hero, no montar pedido e na galeria.

## 8. SEO local

O plano completo e o checklist estão em [seo.md](seo.md). Regras fixas:

- Schema `Restaurant` com `openingHoursSpecification`, `Menu`/`MenuItem` com preços e `sameAs` (Instagram, Facebook, Perfil da Empresa).
- **Sem `aggregateRating` e sem `FAQPage`.** O primeiro não gera estrelas para o próprio negócio e não pode agregar notas de outros sites. O segundo foi descontinuado pelo Google em maio de 2026. O FAQ continua visível no HTML.
- Uma página dedicada por serviço, cada uma com palavra-chave própria. Nada de páginas por bairro que só troquem o nome.
- Todo texto importante no HTML (nada que só exista via JS).
- NAP vem só de `src/data/business.ts` e deve ser idêntico ao Perfil da Empresa no Google.
- Rodar `npm run build` e `npm run check:seo` antes de todo deploy.

---

## 9. Território livre (onde o Claude Code deve ousar)

- Composição de cada seção, grid, quebras de alinhamento, escala tipográfica.
- Escolha final de fontes entre as candidatas (ou melhores, se justificar pela marca).
- Coreografia das animações dentro do mapa acima.
- Microinterações do montar pedido.
- Pode contestar este documento. Contestação vem com o porquê e uma alternativa.

## 10. Proibido

- Hero texto-esquerda/imagem-direita.
- Sans black genérica de Canva nos títulos.
- Ícones em círculo colorido, grid de 3 cards brancos com sombra, linhas coloridas decorativas genéricas.
- Layout branco, simples, encaixotado.
- Qualquer coisa com cara de IA ou template de restaurante.
- Travessão (—) em qualquer texto do site.
- Cor fora da paleta extraída.
- Recriar o logo com fonte.

---

## 11. Em aberto (antes do build)

- [ ] Arquivos originais do logo (SVG de preferência) e nomes das fontes usadas nos posts.
- [ ] Fotos originais em alta (não print do feed), principalmente frango e costela. Feijoada, fachada e letreiro tratado já estão no site.
- [ ] Vídeo curto do frango girando ou saindo do forno.
- [x] Horário: só domingo por enquanto.
- [x] Preços finais confirmados. Falta separar itens fixos e sazonais.
- [ ] Texto do manifesto com história real (10 min de conversa com a dona).
