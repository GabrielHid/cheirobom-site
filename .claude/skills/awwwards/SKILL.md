---
name: awwwards
description: Use ao criar, compor ou revisar qualquer seção, layout, tipografia ou animação do site, para buscar acabamento de nível Awwwards e evitar resultado com cara de template ou de IA. Também use antes de entregar uma seção, como checklist de crítica.
---

# Awwwards: padrão de acabamento

Este projeto mira site premiável, não "site bonitinho". O `design.md` na raiz traz os FIXOS (marca, conteúdo, cores extraídas) e o TERRITÓRIO LIVRE. No território livre você tem autonomia: proponha, decida e justifique. Não peça permissão para ousar.

## Como pensar uma seção

1. **Uma ideia por seção.** Antes de codar, escreva em uma frase o que a seção faz o visitante sentir ou fazer. Se não cabe em uma frase, a seção está confusa.
2. **Composição antes de componente.** Pense em escala, tensão e respiro: um elemento muito grande contra elementos pequenos, alinhamentos quebrados de propósito, sobreposição de imagem e texto. Evite a pilha "eyebrow + H2 + parágrafo + grid de cards".
3. **Ritmo entre seções.** Alterne densidade (cheio/vazio), direção (vertical/horizontal), escala (macro/micro). Duas seções seguidas com a mesma estrutura é defeito.
4. **Conteúdo real manda.** Foto, preço e frase reais do negócio são protagonistas. Ornamento nunca substitui conteúdo.

## Tipografia

- Display grande de verdade (clamp até 10 a 14vw em headlines-chave), com tracking e leading ajustados à mão.
- No máximo 2 famílias + 1 de apoio (números/mono). Hierarquia por escala e peso, não por cor.
- Quebras de linha intencionais em títulos (`text-wrap: balance` ou quebra manual), nunca viúvas.

## Animação

- Movimento tem motivo: revelar, guiar, dar peso ou dar feedback. Movimento só decorativo sai.
- Easing com personalidade (`power3`, `expo`, custom). Reveals entre 0.6s e 1.2s, feedback abaixo de 0.3s.
- Coreografe: stagger, ordem de entrada e saída. Nada de tudo surgindo com o mesmo fade-up.
- Mobile é decidido por efeito (tabela no `design.md`), nunca herdado do desktop por omissão.
- Sempre: `prefers-reduced-motion`, limpeza de ScrollTrigger/listeners, zero layout shift.
- Three.js/WebGL só onde entrega sensação que CSS não entrega. Carrega depois do LCP, DPR limitado, pausa fora da viewport. Para implementar, consulte as skills `threejs-*`.

## Anti-clichê (reprovado automaticamente)

- Hero com texto à esquerda e imagem à direita.
- Grid de 3 cards brancos com sombra e ícone em círculo colorido.
- Linhas/traços coloridos decorativos genéricos, blobs, gradientes roxo-azul.
- Todas as seções centralizadas e com a mesma largura.
- Copy com cara de IA: "experiência", "jornada", "transforma", "momentos especiais", travessões (—).
- Carrossel de depoimentos com setinhas.
- Paleta inventada (cores vêm das fotos ou da marca).

## Checklist antes de entregar uma seção

- [ ] A ideia da seção cabe em uma frase e o layout comunica isso sem o texto?
- [ ] Tem pelo menos uma decisão de composição que um template não teria?
- [ ] Funciona e é bonita em 375px (não só "não quebra")?
- [ ] Texto importante está no HTML (SEO, sem depender de JS)?
- [ ] Animação respeita reduced-motion e não causa CLS?
- [ ] Tirou screenshot desktop (1440) e mobile (375) com a skill `playwright-cli` e olhou de verdade?
- [ ] Passou na revisão da `web-design-guidelines` (acessibilidade, foco, contraste)?

Se algum item falhar, refaça antes de mostrar.
