// Interface que funciona com ou sem animação: menu, categorias, mapa e botão flutuante.
import './anchors';

const headers = [...document.querySelectorAll<HTMLElement>('[data-header]')];

function setNav(header: HTMLElement, open: boolean) {
  const toggle = header.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  header.classList.toggle('is-open', open);
  document.documentElement.classList.toggle('nav-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  dispatchEvent(new CustomEvent('nav:toggle', { detail: open }));
}
for (const header of headers) {
  header.querySelector('[data-nav-toggle]')?.addEventListener('click', () => setNav(header, !header.classList.contains('is-open')));
}
// Links de âncora na mesma página não recarregam: o painel precisa fechar sozinho.
for (const header of headers) {
  for (const link of header.querySelectorAll('[data-nav-close]')) {
    link.addEventListener('click', () => header.classList.contains('is-open') && setNav(header, false));
  }
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  for (const header of headers) {
    if (!header.classList.contains('is-open')) continue;
    setNav(header, false);
    header.querySelector<HTMLElement>('[data-nav-toggle]')?.focus();
  }
});

// Categoria atual em destaque na barra do cardápio.
const chips = document.querySelector<HTMLElement>('[data-chips]');
if (chips) {
  const links = [...chips.querySelectorAll<HTMLAnchorElement>('a')];
  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          const on = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-on', on);
          if (on) chips.firstElementChild?.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' });
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  for (const link of links) {
    const target = document.querySelector(link.hash);
    if (target) seen.observe(target);
  }
}

// O mapa do Google só carrega quando o visitante chega perto dele.
const map = document.querySelector<HTMLElement>('[data-map]');
if (map) {
  const near = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      const frame = document.createElement('iframe');
      frame.src = map.dataset.map!;
      frame.title = 'Mapa da Cheiro Bom Rotisseria em Araraquara';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      map.append(frame);
    },
    { rootMargin: '600px' },
  );
  near.observe(map);
}

// O botão flutuante só aparece depois da primeira dobra.
const float = document.querySelector<HTMLElement>('[data-wa-float]');
if (float) {
  const onScroll = () => float.classList.toggle('is-on', scrollY > innerHeight * 0.7);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Galeria: setas e linha de progresso acompanham a rolagem lateral.
const calm = matchMedia('(prefers-reduced-motion: reduce)');
for (const wrap of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
  const track = wrap.querySelector<HTMLElement>('.gallery')!;
  const prev = wrap.querySelector<HTMLButtonElement>('[data-gallery-prev]')!;
  const next = wrap.querySelector<HTMLButtonElement>('[data-gallery-next]')!;
  const bar = wrap.querySelector<HTMLElement>('[data-gallery-bar]')!;
  const items = [...track.children] as HTMLElement[];
  const step = () => (items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? Math.min(1, track.scrollLeft / max) : 0;
    bar.style.setProperty('--w', String(track.clientWidth / track.scrollWidth));
    bar.style.setProperty('--p', String(p));
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft > max - 4;
    wrap.classList.toggle('is-static', max <= 4);
  };
  // Avança o que cabe na tela menos um, para a última foto vista continuar à esquerda.
  const page = (dir: number) => {
    const n = Math.max(1, Math.floor(track.clientWidth / step()) - 1);
    track.scrollBy({ left: dir * n * step(), behavior: calm.matches ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
