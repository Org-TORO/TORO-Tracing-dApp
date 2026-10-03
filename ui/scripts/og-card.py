#!/usr/bin/env python3
"""Generate the TORO social unfurl card (1200x630, X/Discord/FB friendly).

Layout echoes the landing hero: dark deep-ocean background, editorial
serif headline, mono kicker, can art on the right.

Usage:
    /tmp/toro-og/bin/python ui/scripts/og-card.py
Output:
    ui/public/og-card.png
Requires: pillow (pip install pillow)
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent  # ui/
W, H = 1200, 630

DEEP = (10, 22, 40)
WHITE = (255, 255, 255)
DIM = (255, 255, 255, 140)
OCEAN = (62, 150, 204)
GOLD = (255, 195, 84)

SERIF = "/System/Library/Fonts/NewYork.ttf"
MONO = "/System/Library/Fonts/Monaco.ttf"


def tracked(draw: ImageDraw.ImageDraw, xy, text, font, fill, tracking=0):
    """Draw text with manual letter-spacing (PIL has no tracking)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += int(draw.textlength(ch, font=font) + tracking)
    return x


def main() -> None:
    # --- background: hero art, filled + darkened on the text side ---
    bg = Image.open(ROOT / "public" / "Dark_bg.png").convert("RGB")
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((int(bg.width * scale) + 1, int(bg.height * scale) + 1), Image.LANCZOS)
    left = (bg.width - W) // 2
    top = (bg.height - H) // 2
    card = bg.crop((left, top, left + W, top + H)).convert("RGBA")

    shade = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(shade)
    for x in range(W):  # 150 -> 40 alpha, left to right
        sd.line([(x, 0), (x, H)], fill=int(150 - 110 * x / W))
    card.paste(Image.new("RGBA", (W, H), (4, 10, 22, 255)), (0, 0), shade)

    # --- ocean glow behind the can ---
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([760, 130, 1160, 530], fill=(62, 150, 204, 70))
    card = Image.alpha_composite(card, glow.filter(ImageFilter.GaussianBlur(60)))

    # --- can art, right side ---
    can = Image.open(ROOT / "public" / "tuna_on_can.png").convert("RGBA")
    can_w = 460
    can = can.resize((can_w, int(can.height * can_w / can.width)), Image.LANCZOS)
    card.paste(can, (700, (H - can.height) // 2), can)

    d = ImageDraw.Draw(card)
    f_kicker = ImageFont.truetype(MONO, 25)
    f_head = ImageFont.truetype(SERIF, 68)
    f_sub = ImageFont.truetype(MONO, 26)

    x = 80
    tracked(d, (x, 150), "TORO  ·  TRACEABLE OCEAN ORIGIN", f_kicker, OCEAN + (255,), tracking=3)
    d.line([(x, 200), (x + 64, 200)], fill=GOLD + (255,), width=3)

    d.text((x, 225), "Every tuna can", font=f_head, fill=WHITE + (255,))
    d.text((x, 300), "remembers the ocean.", font=f_head, fill=WHITE + (255,))

    tracked(d, (x, 460), "CATCH TO CAN, SIGNED ON SOLANA", f_sub, DIM, tracking=2)

    out = ROOT / "public" / "og-card.png"
    card.convert("RGB").save(out, "PNG")
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
