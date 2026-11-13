// Gera a imagem de compartilhamento e copia os ícones a partir dos originais.
import sharp from 'sharp';
import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('public/og', { recursive: true });
await sharp('assets/raw/frango-assado.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og/cheiro-bom-frango-assado.jpg');

for (const f of ['favicon.ico', 'apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png']) {
  await copyFile(`assets/brand/${f}`, `public/${f}`);
}
