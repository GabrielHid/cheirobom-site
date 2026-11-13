// Montar pedido: melhora o cardápio estático. Sem JS, a página continua completa e o CTA do WhatsApp segue valendo.
// Itens por quilo andam de 250 em 250 g (data-step="0.25", data-unit="kg"). Abaixo de 1 kg aparecem em gramas.
type Line = { id: string; name: string; price: number; qty: number; unit?: string };

const PHONE = '5516997656146';
const money = (n: number) => `R$ ${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;
const amount = (qty: number, unit?: string) => {
  if (!unit) return `${qty}x`;
  if (unit === 'kg' && qty > 0 && qty < 1) return `${Math.round(qty * 1000)} g`;
  return `${String(qty).replace('.', ',')} ${unit}`;
};

function load(key: string): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  } catch {
    return {};
  }
}

function save(key: string, cart: Record<string, number>) {
  try {
    localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    // Sem armazenamento, o pedido vale só nesta visita.
  }
}

export function buildMessage(lines: Line[], mode: string, address: string, notes: string, intro = 'Olá! Quero fazer este pedido na Cheiro Bom:', modeLabel = 'Forma') {
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const rows = lines.map((l) => `${amount(l.qty, l.unit)} ${l.name}: ${money(l.price * l.qty)}`);
  return [
    intro,
    '',
    ...rows,
    '',
    `Total dos itens: ${money(total)}`,
    `${modeLabel}: ${mode}`,
    ...(mode === 'Delivery' && address ? [`Endereço: ${address}`] : []),
    ...(notes ? [`Observações: ${notes}`] : []),
  ].join('\n');
}

export function startOrder() {
  const panel = document.querySelector<HTMLElement>('[data-order]');
  const rows = [...document.querySelectorAll<HTMLElement>('[data-item]')];
  if (!panel || !rows.length) return;

  const q = <T extends HTMLElement>(s: string) => panel.querySelector<T>(s)!;
  const list = q<HTMLUListElement>('[data-lines]');
  const totals = [...document.querySelectorAll<HTMLElement>('[data-total]')];
  const counts = [...document.querySelectorAll<HTMLElement>('[data-count]')];
  const send = q<HTMLAnchorElement>('[data-send]');
  const address = panel.querySelector<HTMLTextAreaElement>('[data-address]');
  const addressWrap = panel.querySelector<HTMLElement>('[data-address-wrap]');
  const key = panel.dataset.key ?? 'cheirobom-pedido';
  const intro = panel.dataset.intro;
  const modeLabel = panel.dataset.modeLabel;
  const notes = q<HTMLTextAreaElement>('[data-notes]');
  const bar = document.querySelector<HTMLElement>('[data-order-bar]')!;
  const toggle = document.querySelector<HTMLButtonElement>('[data-order-toggle]')!;
  const close = q<HTMLButtonElement>('[data-order-close]');

  const known = new Map(rows.map((r) => [r.dataset.item!, r]));
  const cart = load(key);
  for (const id of Object.keys(cart)) if (!known.has(id)) delete cart[id];

  const lines = (): Line[] =>
    Object.entries(cart).map(([id, qty]) => {
      const r = known.get(id)!;
      return { id, name: r.dataset.name!, price: Number(r.dataset.price), qty, unit: r.dataset.unit };
    });

  const mode = () => panel.querySelector<HTMLInputElement>('input[name="forma"]:checked')?.value ?? '';

  function render() {
    const current = lines();
    const total = current.reduce((s, l) => s + l.price * l.qty, 0);
    const units = current.reduce((s, l) => s + l.qty, 0);

    list.replaceChildren(
      ...current.map((l) => {
        const li = document.createElement('li');
        li.textContent = `${amount(l.qty, l.unit)} ${l.name}`;
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = money(l.price * l.qty);
        li.append(price);
        return li;
      }),
    );
    for (const el of totals) {
      el.textContent = money(total);
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
    // Item por quilo conta como um só, seja meio quilo ou três.
    const items = current.reduce((s, l) => s + (l.unit ? 1 : l.qty), 0);
    for (const el of counts) el.textContent = items === 1 ? '1 item' : `${items} itens`;
    for (const [id, row] of known) {
      const qty = cart[id] ?? 0;
      row.querySelector<HTMLElement>('[data-qty]')!.textContent = row.dataset.unit ? amount(qty, row.dataset.unit) : String(qty);
      row.querySelector<HTMLButtonElement>('[data-minus]')!.disabled = qty === 0;
      row.classList.toggle('in-order', qty > 0);
    }

    const empty = units === 0;
    panel.classList.toggle('is-empty', empty);
    document.body.classList.toggle('has-order', !empty);
    if (empty) setOpen(false);
    if (addressWrap) addressWrap.hidden = mode() !== 'Delivery';
    const text = buildMessage(current, mode(), address?.value.trim() ?? '', notes.value.trim(), intro, modeLabel);
    send.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
    send.setAttribute('aria-disabled', String(empty || !mode()));
    save(key, cart);
  }

  // O item voa do + até o total, para o cliente ver onde ele foi parar.
  function fly(from: HTMLElement) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = totals.find((el) => el.offsetParent !== null);
    if (!target) return;
    const a = from.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'order-fly';
    dot.style.left = `${a.left + a.width / 2}px`;
    dot.style.top = `${a.top + a.height / 2}px`;
    document.body.append(dot);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    dot
      .animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.35 - 40}px)) scale(1.15)`, opacity: 1, offset: 0.55 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0.4 },
        ],
        { duration: 520, easing: 'cubic-bezier(.5,0,.2,1)' },
      )
      .finished.finally(() => dot.remove());
  }

  function setOpen(open: boolean) {
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  for (const [id, row] of known) {
    const stepper = row.querySelector<HTMLElement>('[data-stepper]')!;
    stepper.hidden = false;
    stepper.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest('button');
      if (!button) return;
      const adding = button.hasAttribute('data-plus');
      const step = Number(row.dataset.step ?? 1);
      const next = Math.round(((cart[id] ?? 0) + (adding ? step : -step)) * 100) / 100;
      if (next > 0) cart[id] = next;
      else delete cart[id];
      render();
      if (adding) fly(button);
    });
  }

  send.addEventListener('click', (e) => {
    if (send.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
  panel.addEventListener('input', render);
  // Páginas que mudam o nome de um item (ex.: o arroz da ceia) pedem um novo desenho do pedido.
  addEventListener('order:refresh', render);
  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
  close.addEventListener('click', () => {
    setOpen(false);
    toggle.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false);
  });

  panel.hidden = false;
  bar.hidden = false;
  render();
}
