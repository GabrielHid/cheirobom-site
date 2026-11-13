// Rolagem até âncoras (#cardapio, /cardapio/#carnes, #encomenda...): a seção de destino encosta no topo da tela,
// sem mostrar o fim da seção anterior. O desconto depende do que vai estar sobre a tela quando a rolagem terminar:
// - o cabeçalho some ao rolar para baixo (motion.ts, headerState) e volta ao rolar para cima;
// - no cardápio, a barra de categorias (.menu-chips) fica presa no topo e cobre o início da seção.
// Vale para cliques na mesma página e para quem chega de outra página com # na URL.

type Smooth = { scrollTo: (y: number, opts?: { immediate?: boolean; duration?: number }) => void };
const lenis = () => (window as unknown as { __lenis?: Smooth }).__lenis;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// from: posição de onde a rolagem parte (no hashchange o navegador já pulou; vale a posição de antes do pulo).
function targetY(el: HTMLElement, from = scrollY): [number, boolean] {
  const top = el.getBoundingClientRect().top + scrollY;
  const down = top > from;
  // O cabeçalho só se esconde quando a animação está ligada e a rolagem é para baixo, passando de meia tela.
  const headerHides = document.documentElement.classList.contains('motion-on') && down && top > innerHeight * 0.5;
  const bar = document.querySelector<HTMLElement>('[data-header] .b-bar');
  let offset = headerHides || !bar ? 0 : bar.offsetHeight;
  // Barra de categorias do cardápio: presa no topo (top 0) ou logo abaixo do cabeçalho (top 4.5rem, global.css).
  // A posição original vem do bloco que vem depois dela, porque a dela muda enquanto está presa.
  const chips = document.querySelector<HTMLElement>('.menu-chips');
  const after = chips?.nextElementSibling as HTMLElement | null;
  if (chips && after && top >= after.getBoundingClientRect().top + scrollY - 1) {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    offset = (offset ? 4.5 * rem : 0) + chips.offsetHeight;
  }
  return [Math.max(0, Math.round(top - offset)), headerHides];
}

function go(el: HTMLElement, instant = false, from = scrollY) {
  const [y, headerHides] = targetY(el, from);
  // Num salto imediato a direção da rolagem não é confiável: o estado do cabeçalho é definido aqui.
  if (instant) for (const h of document.querySelectorAll('[data-header]')) h.classList.toggle('is-away', headerHides);
  const smooth = lenis();
  if (smooth) smooth.scrollTo(y, { immediate: instant || reduced(), duration: 1.1 });
  else window.scrollTo({ top: y, behavior: instant || reduced() ? 'auto' : 'smooth' });
  // Leitor de tela e teclado continuam a partir do destino.
  if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a || a.target === '_blank') return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!el) return;
  e.preventDefault();
  if (location.hash !== url.hash) history.pushState(null, '', url.hash);
  go(el);
});

// Chegando de outra página com # na URL: o navegador já pulou para a âncora, mas fotos, fontes e animações de
// entrada ainda mudam a altura da página. Reposiciona algumas vezes até assentar e para se o visitante rolar.
const initial = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (initial) {
  let user = false;
  const stop = () => (user = true);
  for (const t of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(t, stop, { once: true, passive: true });
  const fix = () => !user && go(initial, true);
  document.fonts.ready.then(() => requestAnimationFrame(fix));
  addEventListener('load', () => [60, 350, 900, 1600].forEach((ms) => setTimeout(fix, ms)), { once: true });
}

// Troca de # sem recarregar (botão voltar/avançar, link digitado): o navegador pula sem o desconto certo.
// A posição de antes do pulo vem do último scroll registrado (o evento do pulo chega depois do hashchange).
let lastY = scrollY;
addEventListener('scroll', () => requestAnimationFrame(() => (lastY = scrollY)), { passive: true });
addEventListener('hashchange', () => {
  const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el) go(el, true, lastY);
});
