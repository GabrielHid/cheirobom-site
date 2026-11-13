// Natal e Réveillon: contador nas etiquetas, data do pedido, arroz da ceia e quatro movimentos
// (a guirlanda gira 2 graus com a rolagem, as etiquetas balançam de leve ao entrar, os ícones dos passos sobem
// em sequência, fogos no fechamento).
// Tudo o que informa já está no HTML. Sem JS, a página mostra as datas fixas e o botão do WhatsApp.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DAY = 86_400_000;

// Fim do dia do prazo, no relógio do cliente.
const deadline = (iso: string) => new Date(`${iso}T23:59:59`).getTime();
const daysLeft = (end: number, now: number) => Math.floor((end - now) / DAY);
const left = (n: number) => (n <= 0 ? 'último dia' : n === 1 ? 'falta 1 dia' : `faltam ${n} dias`);

// Cada etiqueta conta os dias do próprio prazo. Data vencida: a etiqueta avisa e o pedido não deixa escolher.
function countdown() {
  const now = Date.now();
  const closed: Record<string, boolean> = {};
  for (const tag of document.querySelectorAll<HTMLElement>('[data-date][data-deadline]')) {
    const end = deadline(tag.dataset.deadline!);
    const isClosed = now > end;
    closed[tag.dataset.date!] = isClosed;
    tag.classList.toggle('is-closed', isClosed);
    tag.querySelector<HTMLElement>('.fx-closed')!.hidden = !isClosed;
    const label = tag.querySelector<HTMLElement>('[data-left]')!;
    label.hidden = isClosed;
    label.textContent = isClosed ? '' : left(daysLeft(end, now));
  }
  const radios = [...document.querySelectorAll<HTMLInputElement>('[data-order] input[name="forma"]')];
  radios.forEach((r, i) => {
    const isClosed = i === 0 ? closed.natal : closed.reveillon;
    r.disabled = isClosed;
    if (isClosed) r.checked = false;
  });
  const firstOpen = radios.find((r) => !r.disabled);
  if (firstOpen && !radios.some((r) => r.checked)) firstOpen.checked = true;
  firstOpen?.dispatchEvent(new Event('input', { bubbles: true }));
}

// Tocar numa etiqueta já deixa a data marcada no pedido, além de rolar até a encomenda.
function pick() {
  const radios = [...document.querySelectorAll<HTMLInputElement>('[data-order] input[name="forma"]')];
  for (const tag of document.querySelectorAll<HTMLElement>('[data-pick]')) {
    tag.addEventListener('click', () => {
      const r = radios[Number(tag.dataset.pick)];
      if (!r || r.disabled) return;
      r.checked = true;
      r.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
}

// O arroz da ceia entra no nome do item, para a mensagem do WhatsApp sair completa.
function rice() {
  const card = document.querySelector<HTMLElement>('.fx-comanda[data-item]');
  const set = card?.querySelector<HTMLFieldSetElement>('[data-rice]');
  if (!card || !set) return;
  set.hidden = false;
  const base = card.dataset.name!.replace(/ \(.*\)$/, '');
  set.addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value;
    card.dataset.name = `${base} (${value})`;
    dispatchEvent(new Event('order:refresh'));
  });
}

// Só transform: nada muda de tamanho nem empurra o layout.
function motion() {
  gsap.registerPlugin(ScrollTrigger);
  const wreath = document.querySelector('[data-wreath]');
  if (wreath) {
    gsap.to(wreath, { rotate: 2, ease: 'none', scrollTrigger: { trigger: '[data-fx-hero]', start: 'top top', end: 'bottom top', scrub: true } });
  }
  // Número e ícone de cada passo: fade com 8px de subida, um passo depois do outro, quando entram na tela.
  const icons = document.querySelectorAll('.fx-step-head');
  if (icons.length) {
    gsap.from(icons, { autoAlpha: 0, y: 8, duration: 0.7, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: '.fx-steps', start: 'top 85%', once: true } });
  }
  const tags = document.querySelector('[data-tags]');
  if (tags) {
    // Pendurada no barbante: o pivô é o meio do fio, no alto da arte.
    gsap.fromTo(
      tags,
      { rotate: -2.5 },
      { rotate: 0, duration: 2.4, ease: 'elastic.out(1, 0.3)', transformOrigin: '50% 4%', scrollTrigger: { trigger: tags, start: 'top 85%', once: true } },
    );
  }
}

// Fogos em linha fina: dourado e farofa da paleta, rastro curto, como traço de caneta no papel escuro.
// Só roda com a seção na tela, com DPR limitado, e para sozinho fora dela.
function fireworks() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-fogos]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors = ['#cc8f2e', '#cdb047', '#f9f8f5'];
  type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; trail: number[] };
  type Rocket = { x: number; y: number; ty: number; vy: number };
  let sparks: Spark[] = [];
  let rockets: Rocket[] = [];
  let w = 0;
  let h = 0;
  let raf = 0;
  let next = 0;
  let running = false;

  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const box = canvas.getBoundingClientRect();
    w = box.width;
    h = box.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const burst = (x: number, y: number) => {
    const n = w < 600 ? 34 : 56;
    const c = colors[Math.floor(Math.random() * 2)];
    const speed = (w < 600 ? 2.6 : 4.2) * (0.8 + Math.random() * 0.4);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.05;
      const s = speed * (0.75 + Math.random() * 0.25);
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 75 + Math.random() * 35, c: Math.random() < 0.15 ? colors[2] : c, trail: [] });
    }
  };

  const frame = (t: number) => {
    if (!running) return;
    // Os foguetes sobem pelas laterais, para estourar em volta dos votos e não em cima do texto.
    if (t > next) {
      const side = Math.random() < 0.5 ? 0.06 + Math.random() * 0.2 : 0.74 + Math.random() * 0.2;
      rockets.push({ x: w * side, y: h, ty: h * (0.08 + Math.random() * 0.3), vy: -(h / 70) });
      next = t + 700 + Math.random() * 800;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    rockets = rockets.filter((r) => {
      const y0 = r.y;
      r.y += r.vy;
      ctx.strokeStyle = 'rgba(205,176,71,0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(r.x, y0 + 26);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
      if (r.y <= r.ty) {
        burst(r.x, r.y);
        return false;
      }
      return true;
    });

    sparks = sparks.filter((s) => {
      s.trail.push(s.x, s.y);
      if (s.trail.length > 16) s.trail.splice(0, 2);
      s.vx *= 0.962;
      s.vy = s.vy * 0.962 + 0.04;
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      const k = 1 - s.life / s.max;
      ctx.globalAlpha = Math.max(k, 0) ** 0.7;
      ctx.strokeStyle = s.c;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s.trail[0], s.trail[1]);
      for (let i = 2; i < s.trail.length; i += 2) ctx.lineTo(s.trail[i], s.trail[i + 1]);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      return s.life < s.max;
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    size();
    next = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 }).observe(canvas);
  addEventListener('resize', () => running && size());
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : canvas.getBoundingClientRect().top < innerHeight && start()));
}

export function startFestas() {
  countdown();
  pick();
  rice();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  motion();
  fireworks();
}
