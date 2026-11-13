// Calor do hero: o ar quente sobe do frango dentro do arco, com um vapor discreto.
// WebGL puro em vez de Three.js: é um único plano com shader, e isso poupa a biblioteca inteira no celular.
// A imagem e o H1 continuam no HTML. O canvas só entra depois do LCP e é opcional.

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() { v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D uPhoto, uCut;
uniform vec4 uCover; // escala xy, deslocamento zw: tela para imagem
uniform float uTime, uAspect;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
vec2 img(vec2 s) { return vec2(s.x, 1. - s.y) * uCover.xy + uCover.zw; }
float bird(vec2 s) { return texture2D(uCut, img(s)).a; }

void main() {
  // Quanto de frango existe logo abaixo deste ponto: o calor nasce nele e sobe.
  float heat = 0.;
  for (int i = 1; i <= 5; i++) {
    float d = float(i) * .07;
    heat += bird(v - vec2(0., d)) * (1.2 - d * 2.);
  }
  heat = clamp(heat * .42, 0., 1.);

  vec2 q = vec2(v.x * uAspect, v.y);
  float t = uTime;
  vec2 flow = vec2(
    noise(q * vec2(9., 5.) + vec2(0., -t * 1.1)) - .5,
    noise(q * vec2(7., 4.) + vec2(4., -t * .8)) - .5
  );
  flow += .5 * vec2(noise(q * 19. + vec2(0., -t * 1.9)) - .5, 0.);
  vec2 s = v + flow * heat * vec2(.022, .012);

  vec3 c = texture2D(uPhoto, img(s)).rgb;

  // O frango em si treme bem menos que o ar acima dele.
  vec2 sb = v + flow * heat * vec2(.002, .001);
  vec4 cut = texture2D(uCut, img(sb));
  c = mix(c, texture2D(uPhoto, img(sb)).rgb, cut.a);

  // Vapor discreto, só onde há calor.
  float wisp = noise(q * vec2(4., 2.5) + vec2(sin(t * .3), -t * .55));
  wisp = smoothstep(.55, .95, wisp) * heat * (1. - cut.a);
  c += vec3(.16, .13, .1) * wisp;

  gl_FragColor = vec4(c, 1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

function texture(gl: WebGLRenderingContext, unit: number, source: TexImageSource) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  for (const [k, val] of [
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
    [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
  ]) gl.texParameteri(gl.TEXTURE_2D, k, val);
}

function cover(img: HTMLImageElement, w: number, h: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const k = Math.max(w / iw, h / ih);
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((p) => parseFloat(p) / 100);
  const sx = w / (iw * k);
  const sy = h / (ih * k);
  return [sx, sy, (1 - sx) * px, (1 - sy) * py] as const;
}

const ready = (img: HTMLImageElement) =>
  img.decode().catch(() => undefined);

export async function startHeat() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const arch = hero?.querySelector<HTMLElement>('.hero-arch');
  const photo = arch?.querySelector<HTMLImageElement>('.hero-photo');
  const cut = arch?.querySelector<HTMLImageElement>('.hero-cut');
  if (!hero || !arch || !photo || !cut) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  await Promise.all([ready(photo), ready(cut), document.fonts.ready]);

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;

  const mobile = matchMedia('(max-width: 47.99rem)').matches;
  const scale = mobile ? 1 : Math.min(devicePixelRatio, 1.5);

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  texture(gl, 0, photo);
  texture(gl, 1, cut);
  gl.uniform1i(gl.getUniformLocation(program, 'uPhoto'), 0);
  gl.uniform1i(gl.getUniformLocation(program, 'uCut'), 1);
  const uCover = gl.getUniformLocation(program, 'uCover');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uAspect = gl.getUniformLocation(program, 'uAspect');

  const layout = () => {
    const { width, height } = arch.getBoundingClientRect();
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform4f(uCover, ...cover(photo, width, height));
    gl.uniform1f(uAspect, width / height);
  };
  layout();
  arch.insertBefore(canvas, arch.querySelector('.status'));

  let frame = 0;
  let running = false;
  let visible = true;
  let last = 0;
  let slow = 0;
  let frames = 0;

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };
  const tick = (now: number) => {
    if (!running) return;
    const delta = now - last;
    last = now;
    // Em aparelho fraco, desliga e volta para a imagem parada.
    if (++frames > 30 && delta > 34) slow++;
    if (slow > 45) {
      stop();
      canvas.remove();
      hero.classList.remove('is-heating');
      return;
    }
    gl.uniform1f(uTime, now / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(arch);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 150);
  }).observe(arch);

  start();
  requestAnimationFrame(() => hero.classList.add('is-heating'));
}
