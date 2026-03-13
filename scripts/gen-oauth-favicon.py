#!/usr/bin/env python3
"""Generate a 120x120 PNG version of the favicon for the Google OAuth consent screen."""
import struct
import zlib
import math
import os

WIDTH = 120
HEIGHT = 120
S = WIDTH / 32  # scale factor: 3.75

# Brand colours
BG_R, BG_G, BG_B = 249, 115, 22    # #f97316  orange
PEACH_R, PEACH_G, PEACH_B = 254, 215, 170  # #fed7aa
TRANS_ALPHA = 0.30  # white overlay for dim blocks


def in_rounded_rect(px, py, rx, ry, rw, rh, cr):
    """Return True if point (px, py) is inside the rounded rectangle."""
    if px < rx or px > rx + rw or py < ry or py > ry + rh:
        return False
    # corner checks
    if px < rx + cr and py < ry + cr:
        return (px - rx - cr) ** 2 + (py - ry - cr) ** 2 <= cr * cr
    if px > rx + rw - cr and py < ry + cr:
        return (px - rx - rw + cr) ** 2 + (py - ry - cr) ** 2 <= cr * cr
    if px < rx + cr and py > ry + rh - cr:
        return (px - rx - cr) ** 2 + (py - ry - rh + cr) ** 2 <= cr * cr
    if px > rx + rw - cr and py > ry + rh - cr:
        return (px - rx - rw + cr) ** 2 + (py - ry - rh + cr) ** 2 <= cr * cr
    return True


def blend(base, over, alpha):
    return round(base * (1 - alpha) + over * alpha)


def render():
    cols_x = [3 * S, 10 * S, 17 * S, 23.5 * S]
    rows_y = [3 * S, 12 * S, 21 * S]
    bw = 5.5 * S
    bh = 7.5 * S
    br = 1.25 * S

    # Pre-compute highlighted block peach regions (all in original 32-unit coords × S)
    highlight_ci, highlight_ri = 2, 1  # x=17, y=12 block
    hx = cols_x[highlight_ci]
    hy = rows_y[highlight_ri]

    # Header rounded rect (top strip of highlighted block)
    header_rect = (hx, hy, bw, 2 * S, br)
    # Plain rect that fills the bottom part of the header's rounded corners
    header_fill = (hx, hy + 1 * S, bw, 1 * S)

    # Tiny date lines
    date_lines = [
        (18.2 * S, 15 * S, 3.1 * S, 0.9 * S, 0.45 * S),
        (18.2 * S, 16.4 * S, 2.4 * S, 0.9 * S, 0.45 * S),
        (18.2 * S, 17.8 * S, 2.8 * S, 0.9 * S, 0.45 * S),
    ]

    rows_data = []
    for py in range(HEIGHT):
        row = []
        for px in range(WIDTH):
            cx = px + 0.5
            cy = py + 0.5

            # Outside the background rounded square → transparent
            if not in_rounded_rect(cx, cy, 0, 0, WIDTH, HEIGHT, 7 * S):
                row.append((255, 255, 255, 0))
                continue

            r, g, b = BG_R, BG_G, BG_B

            # Walk every month block
            for ri, ry_b in enumerate(rows_y):
                for ci, rx_b in enumerate(cols_x):
                    if not in_rounded_rect(cx, cy, rx_b, ry_b, bw, bh, br):
                        continue

                    if ci == highlight_ci and ri == highlight_ri:
                        # White base for highlighted block
                        r, g, b = 255, 255, 255

                        # Header strip (rounded rect + square fill)
                        in_header = in_rounded_rect(cx, cy, *header_rect)
                        lx2, ly2, lw2, lh2 = header_fill
                        in_header_fill = (lx2 <= cx <= lx2 + lw2 and
                                          ly2 <= cy <= ly2 + lh2)
                        if in_header or in_header_fill:
                            r, g, b = PEACH_R, PEACH_G, PEACH_B
                            break

                        # Date lines
                        for lx, ly, lw, lh, lr in date_lines:
                            if in_rounded_rect(cx, cy, lx, ly, lw, lh, lr):
                                r, g, b = PEACH_R, PEACH_G, PEACH_B
                                break
                    else:
                        # Semi-transparent white overlay
                        r = blend(r, 255, TRANS_ALPHA)
                        g = blend(g, 255, TRANS_ALPHA)
                        b = blend(b, 255, TRANS_ALPHA)

                    break  # only one block can own a pixel

            row.append((r, g, b, 255))
        rows_data.append(row)
    return rows_data


def build_png(pixels):
    def make_chunk(tag, data):
        payload = tag + data
        return (struct.pack('>I', len(data)) +
                payload +
                struct.pack('>I', zlib.crc32(payload) & 0xFFFFFFFF))

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr = make_chunk(
        b'IHDR',
        struct.pack('>IIBBBBB', WIDTH, HEIGHT, 8, 6, 0, 0, 0)
    )

    raw = bytearray()
    for row in pixels:
        raw.append(0)  # filter byte: None
        for r, g, b, a in row:
            raw += bytes([r, g, b, a])

    idat = make_chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    iend = make_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend


if __name__ == '__main__':
    out_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'oauth-icon.png')
    out_path = os.path.normpath(out_path)
    pixels = render()
    png_bytes = build_png(pixels)
    with open(out_path, 'wb') as f:
        f.write(png_bytes)
    print(f"Written {len(png_bytes)} bytes → {out_path}")
