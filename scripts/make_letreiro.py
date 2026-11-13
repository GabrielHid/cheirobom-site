# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Tira a margem transparente de assets/brand/letreiro-rotisseria-tratado.png.

Uso: uv run scripts/make_letreiro.py
Saída: assets/generated/letreiro.png, com o círculo encostado nas bordas.
"""
from PIL import Image

SRC = "assets/brand/letreiro-rotisseria-tratado.png"
OUT = "assets/generated/letreiro.png"

img = Image.open(SRC)
print(img.mode, img.size)
assert img.mode == "RGBA", "o tratado precisa ter fundo transparente"
box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
img = img.crop(box)
img.save(OUT, optimize=True)
print(OUT, box, img.size, "canto alfa", img.getpixel((0, 0))[3])
