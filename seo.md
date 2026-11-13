# seo.md · Cheiro Bom Rotisseria

> Plano de SEO local e checklist do que falta. Pesquisa feita em novembro de 2026.
> Legenda: ✅ feito no site · ⬜ a fazer · 🔒 depende do cliente ou de um acesso.

---

## 1. Como o Google decide

Google resume o ranking local em três fatores: **relevância, distância e destaque**. Também afirma que não há como pedir ou pagar por uma posição melhor.

**Ninguém pode garantir o primeiro lugar.** A posição muda conforme quem busca e de onde busca: alguém ao lado de um concorrente tende a vê-lo primeiro. A meta realista é liderar as buscas relevantes na área em volta da loja e aparecer no pacote de mapas no resto da cidade.

O site sozinho não ganha o mapa. A pesquisa da Whitespark de 2026, feita com especialistas (é opinião de mercado, não dado do Google), separa assim:

| Onde | Fatores mais fortes | Quem resolve |
|---|---|---|
| **Mapas (pacote local)** | Categoria principal, proximidade, palavra no nome do Perfil, endereço na cidade, **aberto na hora da busca**, nota alta, quantidade de avaliações com texto, pino correto | Perfil da Empresa e avaliações |
| **Orgânico local** | **Página dedicada por serviço**, relevância geográfica, links de qualidade, palavras no title e nos títulos da página ligada ao Perfil, links internos, foco em nicho | Site e links |
| **Respostas de IA** | Presença em listas de "melhores", página por serviço, menções em sites relevantes, avaliações em sites de autoridade, nota alta | Menções, avaliações e site |

---

## 2. Bloqueios: resolver antes de publicar

### Domínio: `rotisseriacheirobom.com.br`
Domínio do cliente, com site Angular no ar na Vercel e DNS no Registro.br. Como o domínio não muda, **não há Change of Address**: é uma troca de site no mesmo endereço.

| Domínio | O que há hoje | Ação |
|---|---|---|
| `rotisseriacheirobom.com.br` | Site atual. `www` já redireciona para o principal | Substituir pelo site novo |
| `cheirobomrotisseria.com.br` | Sistema de gestão (Lovable), rastreável, com `title` "Cheiro Bom" e toda URL respondendo 200 | ⬜ Colocar `noindex` para não competir com o site |
| `cheirobom.com.br` | **Outra empresa** (marketing olfativo) | Nada a fazer |

**Problemas do site atual que a troca resolve:** `aggregateRating` e `FAQPage` no schema, sitemap com URLs de âncora (`/#cardapio`), toda URL inexistente respondendo 200, `title` longo demais, uma página só, **preços defasados** (o cardápio mudou na semana passada, e o site ainda mostra Frango a R$50, por exemplo) e travessões no texto. Enquanto a troca não sai, vale corrigir os preços no site atual.

- ✅ Âncoras antigas (`#sobre`, `#cardapio`, `#galeria`, `#avaliacoes`, `#faq`, `#contato`) mantidas na nova home.
- ⬜ Antes de trocar: exportar do Search Console as URLs indexadas e as consultas atuais, como linha de base.
- ⬜ Se o Search Console mostrar outra URL com tráfego, criar 301 para a página equivalente.
- ✅ Hospedagem decidida: Vercel, onde o domínio já aponta. Sem mudança de DNS (`vercel.json` no projeto).
- ⬜ Enviar o novo sitemap (`/sitemap-index.xml`) depois de publicar.

### Marca
"Cheiro Bom" sozinho colide com a empresa de aromas. Usar sempre **Cheiro Bom Rotisseria** nos títulos, no schema, no Perfil e nas redes.

### Divergências de horário: corrigir já
| Dado | Cliente | Perfil no Google | Site atual |
|---|---|---|---|
| Abertura | **9h** | **9h30, errado** | 9h |
| Delivery | 11h às 14h | 11h às 14h | **9h às 14h, errado** |

- ⬜ Corrigir no Perfil a abertura para 9h.
- ✅ O novo site usa 9h para retirada e 11h às 14h para delivery.

### Só domingo: o limite estrutural
"Aberto na hora da busca" é o 5º fator de mapas na pesquisa da Whitespark. Como a loja abre um dia por semana, ela aparece fechada nos outros seis, inclusive no sábado à noite, quando o público decide. O horário real é este e **não deve ser maquiado no Perfil**: isso viola as diretrizes e frustra o cliente.

Como compensar:
- ✅ Site com páginas próprias, para disputar o orgânico mesmo com a loja fechada.
- ✅ Encomenda antecipada visível no site e chip de horário indicando quando abre.
- ⬜ Postagem no Perfil toda sexta ou sábado com o cardápio do domingo e o link do WhatsApp.
- ⬜ Cadastrar horários especiais de Natal, Ano-Novo e Sexta-feira Santa.
- ⬜ Reforçar nome e marca: quem já conhece busca "Cheiro Bom Rotisseria", e essa busca não depende do horário.
- Decisão de negócio futura: abrir mais um dia, mesmo só para retirada, seria o maior ganho isolado de visibilidade no mapa.

---

## 3. Estrutura do site e palavras-chave

Cada página mira uma intenção, para uma não competir com a outra. Os volumes de busca **não foram medidos**: confirmar no Planejador de Palavras-chave e depois com dados do Search Console.

| URL | Busca principal | Também cobre | Status |
|---|---|---|---|
| `/` | rotisseria em Araraquara | rotisserie Araraquara, almoço de domingo, Cheiro Bom Rotisseria | ✅ |
| `/cardapio/` | cardápio Cheiro Bom Rotisseria | preços, marca | ✅ |
| `/frango-assado/` | frango assado em Araraquara | frango assado delivery, frango assado domingo | ✅ |
| `/almoco-completo/` | almoço de domingo em Araraquara | almoço para família, marmita de domingo | ✅ |
| `/costela-sous-vide/` | costela sous vide Araraquara | costela bovina, costelinha suína | ✅ |
| `/congelados/` | salgados congelados Araraquara | empadão, kibe de forno, esfiha | ✅ conteúdo curto, ampliar |
| `/feijoada/` | feijoada Araraquara | | ✅ sob consulta, sem preço, com foto. Conteúdo curto, ampliar quando o preço for confirmado |

**Link do Perfil da Empresa:** apontar para a home, com UTM (`?utm_source=google&utm_medium=organic&utm_campaign=perfil`).

**Não criar:** páginas por bairro ou por cidade vizinha que só troquem o nome. O Google trata isso como doorway abuse. Uma página nova só entra com conteúdo real e próprio.

**Próximas páginas, se houver material real:** `/massas/` ou `/nhoque-de-batata/`, porque clientes elogiam espontaneamente o nhoque ("um nhoque de verdade"), `/marmitas-congeladas/` (se a linha existir), encomendas de Natal e Ano-Novo, e uma página "Sobre" com a história da família, que dá confiança e matéria para a imprensa local.

---

## 4. Técnico

### Feito
- ✅ HTML estático com Astro, com texto, preços e NAP no HTML, sem depender de JS.
- ✅ `title` e `description` únicos por página, dentro do limite. Um `h1` por página, sem pular níveis.
- ✅ Canonical, `lang="pt-BR"`, Open Graph (1200x630), `robots.txt`, sitemap e página 404 real.
- ✅ Schema `Restaurant` com `@id`, `Menu`/`MenuItem` com preços, `BreadcrumbList` e `WebSite`.
- ✅ Campos sem dado confirmado ficam fora do schema, nunca com palpite.
- ✅ Imagens em AVIF/WebP responsivas, com `alt`, dimensões e prioridade no LCP. Fontes próprias com `swap`, sem chamada externa.
- ✅ Links internos com texto descritivo, breadcrumbs e FAQ visível.
- ✅ Auditoria automática: `npm run check:seo` (title até 65, description de 140 a 160, OG/Twitter completos, FAQ e preços do schema visíveis na página, preload de imagem igual ao srcset).
- ✅ Metas num componente só: `src/components/SEO.astro`. og:image própria do Natal (`npm run og:natal`).
- ✅ `FAQPage` na home, só com as perguntas visíveis. Não gera resultado no Google, mas Bing e assistentes de IA leem.
- ✅ `specialOpeningHoursSpecification` de 24/12 e 31/12 (18h às 20h) enquanto `divulgarFestas` estiver ligado.
- ✅ Sitemap com `lastmod` real, mantido à mão em `LASTMOD` (`site.config.mjs`).
- ✅ robots.txt com um bloco por robô de busca e de IA; `llms.txt` curto (baixa prioridade).
- ✅ IndexNow: `npm run indexnow` depois de cada deploy (chave no `.env`, arquivo público em `public/<chave>.txt`).
- ✅ `/natal`, `/reveillon` e `/natal-e-reveillon-AAAA` redirecionam (301) para `/natal-e-reveillon/` (`vercel.json`).

### Medição local (Lighthouse, celular, servidor local, 06/11/2026)
Com shader, GSAP, Lenis, ícones, menu Letreiro e seções do tamanho da tela: home 97 em performance, 100 em acessibilidade, boas práticas e SEO. LCP 2,5s na foto do hero, CLS 0, TBT 100ms e 386 KiB. O LCP de 0,8s medido antes era do texto do hero, não da foto. Medir de novo em produção.

Isso é ambiente de laboratório. O número que vale é o de usuários reais em produção. Metas do Google, no percentil 75: **LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1**. Em blogs circula que o LCP mudou para 2,0s em 2026, mas não achei confirmação em fonte do Google.

### A fazer
- ✅ CEP e bairro preenchidos em `src/data/business.ts`.
- ⬜ Conferir latitude e longitude com o pino do Perfil. Os valores atuais vêm do site antigo.
- ⬜ Preencher a URL do Perfil em `googleProfile`.
- ⬜ Validar o schema no Teste de Pesquisa Aprimorada, que exige URL pública.
- ✅ Shader do hero carrega depois do LCP, em 8 KB, e o H1 segue como texto real no HTML.

### O que não fazer
| Prática | Por quê |
|---|---|
| `aggregateRating` da Cheiro Bom no próprio site | Página de negócio que controla as próprias avaliações não é elegível a estrelas, e Google proíbe agregar notas de outros sites |
| `FAQPage` com pergunta que não está na página | Viola as diretrizes. Na home ele existe só com as perguntas visíveis (o `check:seo` confere) |
| Contar com o `llms.txt` para ranquear | Google diz que não usa. Existe um curto no site, sem custo, mas não substitui conteúdo nem menções |
| Palavras extras no nome do Perfil | Viola as diretrizes e pode suspender o Perfil |
| Trocar avaliação por desconto ou brinde | Viola a política de engajamento falso, com risco de restrição |

---

## 5. Perfil da Empresa no Google: a maior alavanca

**Estado em novembro de 2026, pelo que o cliente enviou:** Cheiro Bom Rotisseria, nota 5,0 com 34 avaliações, faixa R$ 20 a 80, categoria exibida "Frango", atributos "Opções vegetarianas" e "A presença de cães é permitida", entrega das 11h às 14h aos domingos. Ainda não vi o painel de gestão.

- ⬜ Confirmar que o Perfil está verificado e que o cliente tem acesso de proprietário.
- ✅ Nome correto, com "Rotisseria" real, sem acréscimos.
- ⬜ Conferir a categoria principal no painel. Comparar com a dos 4 concorrentes e avaliar se existe opção mais específica que "Frango".
- ⬜ Poucas categorias secundárias, só as que descrevem o negócio.
- ✅ Endereço visível e completo. ⬜ Conferir se o **pino** está no local exato.
- ⬜ Conferir se o telefone é (16) 99765-6146.
- ⬜ Corrigir a abertura de 9h30 para 9h e adicionar horários especiais em feriados.
- ⬜ Revisar os atributos: confirmar se "opções vegetarianas" e "cães permitidos" são verdadeiros.
- ⬜ Conferir se o botão Site aponta para `https://rotisseriacheirobom.com.br/`.
- ⬜ Site, cardápio e link de pedido próprios (WhatsApp ou página do cardápio), para evitar que terceiros fiquem como opção principal.
- ⬜ Cardápio cadastrado com itens, preços e foto.
- ⬜ Atributos: retirada, delivery e o que mais se aplicar.
- ⬜ Descrição em linguagem natural: frango assado, rotisseria, almoço de domingo, Araraquara.
- ⬜ Fotos reais toda semana: comida, fachada, letreiro, interior e equipe.
- ⬜ Postagem semanal, de preferência na sexta ou no sábado, com o prato do domingo.

---

## 6. Avaliações

Sinal direto: Google diz que mais avaliações positivas podem melhorar o ranking local. A nota 5,0 é excelente, mas **34 avaliações é pouco para disputar o topo**: quantidade e ritmo são a meta aqui. O número exato a alcançar depende de quanto os 4 concorrentes têm (ver seção 9).

O site antigo cita 35 avaliações e o Perfil, 34. Manter esse número atualizado.

**Diagnóstico das avaliações enviadas (35 listadas):** 19 são de "3 anos atrás", só 6 são dos últimos 12 meses, e as mais recentes aparecem sem resposta. A nota está ótima, mas o ritmo caiu: recência é o ponto fraco.

- ⬜ **Responder às avaliações pendentes**, começando pelas recentes. As respostas do proprietário param há cerca de 3 anos.
- ⬜ Responder à nete bezerra, que elogiou e fez uma crítica: farofa com muito sal. Agradecer e levar à cozinha.
- ⬜ Avaliações de família ou de quem trabalha no negócio são conflito de interesses nas [políticas do Google](https://support.google.com/contributionpolicy/answer/7400114?hl=pt-BR). Não usar nenhuma assim no site e não pedir novas a essas pessoas.
- ⬜ Pedir a todo cliente, de forma neutra, sem brinde. Sempre em pedidos: link curto no WhatsApp depois da entrega e QR Code no adesivo da embalagem.
- ⬜ Manter ritmo constante, toda semana, em vez de campanhas pontuais: recência e frequência vêm ganhando peso.
- ⬜ Responder a todas, boas e ruins, com poucos dias de intervalo.
- ⬜ Não direcionar o conteúdo da avaliação nem pedir nota 5.
- ✅ Nota e número de avaliações visíveis na home, com data, como texto e sem schema.
- ⬜ Incluir o logo oficial do Google junto da nota, como pede o [guia de marca](https://partnermarketinghub.withgoogle.com/brands/google/use-cases/customer-reviews/). Sem estrelas junto do nome Google.
- ⬜ **Consentimento:** o mesmo guia diz que a avaliação pertence a quem escreveu e que usá-la no marketing exige autorização. Dá para pedir respondendo à própria avaliação. Os 6 trechos já estão em `src/data/reviews.ts` com `consent: false`; basta trocar para `true` em cada um autorizado.
- ⬜ O site atual mostra 3 depoimentos com nome completo: confirmar se houve autorização.

**Vocabulário real dos clientes**, útil para textos e postagens: "melhor frango assado de Araraquara", "suculento", "bem temperado", "desmancha na boca", "nhoque de verdade", "empadão de frango", "ceia de Natal", "embalada com muito cuidado", "entrega antes do prazo".

---

## 7. Citações, links e menções

- ⬜ Mesmo NAP em Facebook, Instagram, Tripadvisor, Apple Business Connect, Bing Places, iFood (se usar) e guias locais.
- ⬜ Corrigir cadastros antigos com dado divergente.
- ⬜ Buscar **listas de "melhores"** e imprensa local: portais de Araraquara, Guia da Semana regional, perfis de gastronomia e influenciadores da cidade. É o 1º fator de IA na pesquisa da Whitespark.
- ⬜ Links reais: fornecedores, associação comercial, eventos e parcerias na cidade. Não comprar links.
- ⬜ Pauta para a imprensa: a história da família, o sous vide numa rotisseria, o letreiro de corten.

---

## 8. Respostas de IA (AI Overviews, AI Mode, ChatGPT)

Google afirma que não há requisito especial: basta a página estar indexada e apta a aparecer com snippet. Nos estudos de mercado, Perfil, avaliações e menções de terceiros pesam mais que o site. Os números variam muito entre esses estudos e nem todos têm método público, então uso apenas a direção.

- ✅ Respostas diretas no HTML: preço, horário, endereço, modalidades, quantas pessoas serve.
- ✅ `robots.txt` aberto, sem bloquear rastreadores.
- ⬜ Itens das seções 5, 6 e 7.

---

## 9. Concorrência

Os 4 concorrentes indicados pelo cliente. Levantamento na web em novembro de 2026. **Não consegui ver notas do Google nem a busca real em Araraquara**: a ferramenta de busca é dos EUA e o iFood bloqueou a leitura.

| Concorrente | O que encontrei | Leitura |
|---|---|---|
| **Frango Truck** | Rua Castro Alves, 1586. **Site próprio com pedido online**, title "O Melhor Frango Assado da Região", iFood, telefone (16) 3214-5052, 3.566 curtidas no Facebook. Horários divergem entre site, iFood e Facebook | **Concorrente digital mais forte.** Tem marca, canal próprio e iFood. O ponto fraco aparente são os horários inconsistentes |
| **Botâ Rotisseria** | Provável "Bota Rotisseria" (Doca Alimentos Ltda), Av. Dom Carlos Carmelo, 542, Jardim Botânico. Sem site, cardápio ou Instagram encontrados | Pouca presença achável. Confirmar se é a mesma empresa |
| **Frango Rico** | Rua Gonçalves Dias, 1879. Facebook, guias e cardápio no Menufyy. Guias listam terça a domingo, com entrega | Mais dias aberto, logo mais tempo "aberto na busca" |
| **Rotisserie Nabrasa** | Rua Voluntários da Pátria, 2451, telefone (16) 3336-4499. Instagram e Facebook. Tripadvisor sem avaliações | Guias também citam "Na Brasa Rotisseria": conferir se é a mesma |

**Onde a Cheiro Bom pode ganhar:** cardápio com preços no HTML, página por produto, sous vide e almoço completo, que parecem pouco explorados pelos quatro. Confirmar na busca real.

**Onde ela perde hoje:** dias abertos, e possivelmente volume de avaliações e presença no iFood.

Preencher em aba anônima, no celular, a partir de pontos diferentes da cidade:

| Empresa | Nota | Avaliações | Categoria principal | Posição: "rotisseria Araraquara" | Posição: "frango assado Araraquara" |
|---|---|---|---|---|---|
| Cheiro Bom | 5,0 | 34 | Frango | | |
| Frango Truck | | | | | |
| Botâ | | | | | |
| Frango Rico | | | | | |
| Nabrasa | | | | | |

- ⬜ Preencher essa tabela e definir a meta de avaliações.
- ⬜ Decidir se vale entrar no iFood. Além do canal de venda, é uma menção em site de autoridade, mas tem custo de comissão.

---

## 10. Medição

- ⬜ Google Search Console: verificar domínio e enviar sitemap.
- ⬜ Google Analytics 4 ou alternativa, com consentimento conforme a LGPD. Medir o clique em "Pedir no WhatsApp" como conversão.
- ⬜ Mensagem automática do WhatsApp por página (já há uma para cada) para saber a origem do pedido.
- ⬜ Mensalmente: chamadas, rotas e cliques do Perfil, novas avaliações e consultas no Search Console.
- ⬜ Mapa de posição em grade (Local Falcon ou similar) para ver o ranking pela cidade, antes e depois.

---

## 11. Antes de publicar

- ⬜ Linha de base do Search Console exportada.
- ⬜ `noindex` no sistema em `cheirobomrotisseria.com.br`.
- ⬜ NAP confirmado igual ao Perfil.
- ⬜ Divergências de horário corrigidas (abertura e delivery).
- ✅ Preços confirmados pelo cliente.
- ⬜ Dúvidas pontuais do cardápio: pudim de R$6, tamanho da torta e carne dos kits (ver `design.md`, seção 3).
- ✅ Feijoada: foto na página.
- ✅ Feijoada sob consulta, indexável e fora de `DRAFT_PATHS`.
- ⬜ Feijoada: confirmar preço e acompanhamentos.
- ⬜ Coordenadas conferidas e URL do Perfil preenchida.
- ⬜ `npm run build` e `npm run check:seo` sem erros.
- ⬜ Schema validado na URL pública.

---

## Fontes

**Google:** [ranking local](https://support.google.com/business/answer/7091?hl=pt-BR) · [diretrizes do Perfil](https://support.google.com/business/answer/3038177?hl=pt-BR) · [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) · [avaliações](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) · [FAQ descontinuado](https://developers.google.com/search/docs/appearance/structured-data/faqpage) · [recursos suportados](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) · [recursos de IA](https://developers.google.com/search/docs/appearance/ai-features) · [políticas de spam](https://developers.google.com/search/docs/essentials/spam-policies) · [mudança de site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) · [Core Web Vitals](https://web.dev/articles/vitals)

**Mercado:** [Whitespark 2026](https://whitespark.ca/local-search-ranking-factors/) · [BrightLocal, IA local](https://www.brightlocal.com/research/local-ai-visibility-study/) · [Search Engine Journal, IA local](https://www.searchenginejournal.com/ai-overviews-now-answer-most-local-searches-how-to-get-your-business-cited/580757/) · [Search Engine Roundtable, llms.txt](https://www.seroundtable.com/google-ai-llms-txt-39607.html) · [PPC Land, avaliações incentivadas](https://ppc.land/google-bans-undisclosed-incentivized-reviews-sites-face-manual-action/)
