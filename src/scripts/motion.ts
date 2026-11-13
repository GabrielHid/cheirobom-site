// Coreografia do site. Todo o conteúdo já está no HTML: isto só anima.
// Com movimento reduzido nada aqui roda, e o CSS mantém tudo visível.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';

const root = document.documentElement;
const EASE = 'expo.out';

const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

function smoothScroll() {
  if (!finePointer) return null;
  // Âncoras ficam com scripts/anchors.ts, que desconta o cabeçalho só quando ele vai estar na tela.
  const lenis = new Lenis({ lerp: 0.11 });
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function headerState() {
  const headers = $('[data-header]');
  if (!headers.length) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      for (const header of headers) {
        if (header.classList.contains('is-open')) continue;
        header.classList.toggle('is-away', self.direction === 1 && self.scroll() > innerHeight * 0.5);
        header.classList.toggle('is-scrolled', self.scroll() > 40);
      }
    },
  });
  gsap.from(headers, { yPercent: -110, duration: 1.1, ease: EASE, delay: 0.35, clearProps: 'transform' });
}

function hero() {
  const section = document.querySelector<HTMLElement>('.hero');
  if (!section) return;
  const script = section.querySelector<HTMLElement>('.hero-script')!;
  const head = section.querySelector<HTMLElement>('.hero-head')!;
  const ready = () => {
    section.dataset.ready = 'true';
    dispatchEvent(new Event('hero:ready'));
  };

  // O arco sobe do pé da página e a foto assenta dentro dele. A foto nunca some: ela é o LCP.
  // Depois o título se escreve, e os preços entram linha a linha, como quem lê o cardápio.
  const chars = SplitText.create(script, { type: 'chars' });
  const words = SplitText.create(head, { type: 'words', mask: 'words' });
  const tl = gsap.timeline({
    defaults: { ease: EASE },
    onComplete: () => { chars.revert(); words.revert(); ready(); },
  });
  gsap.set([script, head], { autoAlpha: 1 });
  tl.from('.hero-arch', { yPercent: 8, duration: 1.6, ease: 'power3.out' }, 0)
    .from('.hero-photo', { scale: 1.18, duration: 2.2, ease: 'power3.out' }, 0)
    .from(chars.chars, { autoAlpha: 0, x: -12, duration: 0.9, stagger: 0.06, ease: 'power2.out' }, 0.25)
    .from(words.words, { yPercent: 105, duration: 1.1, stagger: 0.07 }, 0.45)
    .from('.hero-line', { y: 24, autoAlpha: 0, duration: 1 }, 0.75)
    .fromTo('.hero-actions > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09 }, 0.95)
    .fromTo('.hero-cat', { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, 0.7)
    .fromTo('.hero-prices li', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 0.85)
    .from('.hero-dots', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.1, ease: 'power2.inOut' }, 1.05)
    .fromTo('.hero-arch .status', { y: '100%', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.2);

  // No desktop a home sobe por cima do hero, que recua como uma cena que fica para trás.
  gsap.matchMedia().add('(min-width: 48rem)', () => {
    ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false, anticipatePin: 1 });
    gsap.to(section, {
      scale: 0.92,
      borderRadius: 28,
      filter: 'brightness(0.55)',
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

function headings() {
  for (const el of $('.display:not(.hero-head):not([data-words])')) {
    const inHead = !!el.closest('.page-head');
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      aria: 'none',
      linesClass: 'ln',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.15,
          ease: EASE,
          stagger: 0.09,
          delay: inHead ? 0.25 : 0,
          scrollTrigger: inHead ? undefined : { trigger: el, start: 'top 88%', once: true },
        }),
    });
    gsap.set(el, { autoAlpha: 1 });
  }
}

function reveals() {
  for (const el of $('.page-head .lead, .page-head .crumbs-fade')) {
    gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: EASE, delay: 0.5 });
  }
  for (const el of $('[data-rise], main .lead:not(.hero *):not(.page-head *), main .after, .steps li, .modes > div, .highlights > li, .menu-index li, .stats > div, .faq details, .place dt, .place dd, .related li, .footer-grid > *')) {
    gsap.from(el, { y: 26, autoAlpha: 0, duration: 0.9, ease: EASE, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  }

  // Foto abre de dentro para fora. A primeira foto da página não entra aqui, para não atrasar o LCP.
  for (const img of $<HTMLImageElement>('main picture img:not(.hero-photo):not(.hero-cut)')) {
    if (img.closest('.page-head')) {
      gsap.from(img, { scale: 1.08, duration: 1.6, ease: 'power3.out' });
      continue;
    }
    if (img.closest('.gallery, .hl-photo')) continue;
    if (img.classList.contains('place-sign') || img.closest('.map')) continue;
    gsap.fromTo(
      img,
      { clipPath: 'inset(14% 8% 14% 8%)', scale: 1.14 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: EASE, scrollTrigger: { trigger: img, start: 'top 86%', once: true } },
    );
  }

  ScrollTrigger.batch($('.menu-row'), {
    start: 'top 94%',
    once: true,
    onEnter: (rows) => gsap.fromTo(rows, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE, stagger: 0.04, overwrite: true }),
  });

  for (const el of $('.menu-title')) {
    gsap.from(el.querySelector('.icon'), { scale: 0, rotate: -40, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  }
}



// Os desenhos de marca se traçam ao entrar na tela, como caneta no cardápio.
function sketches() {
  for (const svg of $<SVGSVGElement>('svg[data-draw]')) {
    const paths = $<SVGPathElement>('path', svg);
    const long = svg.classList.contains('sketch-alecrim');
    gsap.from(paths, {
      drawSVG: 0,
      duration: long ? 1.6 : 1.1,
      ease: 'power2.inOut',
      stagger: long ? 0.05 : 0.08,
      scrollTrigger: { trigger: svg, start: 'top 90%', once: true },
    });
  }
}

function counters() {
  for (const el of $('[data-countup]')) {
    const end = Number(el.dataset.countup);
    const decimals = Number(el.dataset.decimals ?? 0);
    const state = { n: 0 };
    const paint = () => { el.textContent = state.n.toFixed(decimals).replace('.', ','); };
    gsap.to(state, {
      n: end, duration: 1.8, ease: 'power3.out', onUpdate: paint,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true, onEnter: paint },
    });
    paint();
  }
}






function sign() {
  const el = document.querySelector('.place-sign');
  if (!el) return;
  // O letreiro acende ao entrar na tela.
  gsap.fromTo(el, { filter: 'brightness(0.2) saturate(0.4)', scale: 0.86, rotate: -9 }, {
    filter: 'brightness(1) saturate(1)', scale: 1, rotate: 0, duration: 1.8, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
}

function footer() {
  const call = document.querySelector('.footer-logo');
  if (call) gsap.from(call, { rotate: -50, scale: 0.7, autoAlpha: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: call, start: 'top 92%', once: true } });
}

if (root.classList.contains('motion')) {
  root.classList.add('motion-on');
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  const lenis = smoothScroll();
  addEventListener('nav:toggle', (e) => ((e as CustomEvent<boolean>).detail ? lenis?.stop() : lenis?.start()));
  document.fonts.ready.then(() => {
    headerState();
    hero();
    headings();
    reveals();
    sketches();
    counters();
    sign();
    footer();
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
}
