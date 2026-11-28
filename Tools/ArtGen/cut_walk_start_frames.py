#!/usr/bin/env python3
"""Cut a soldier's S, E and N figures out of his idle sheet as image-to-video start frames.

Input:  Assets/Art/_ArtDirection/squad_raw/<soldier>_idle.png (three figures: S, E, N)
Output: Tools/ArtGen/source/squad_video/<soldier>_walk_<s|e|n>_start.png
        1920x1080 flat magenta, the figure's ORIGINAL pixels (no keyed pink fringe), boots centred
        at x = 960, and a fresh soft shadow oval centred under his body (below the middle of the
        helmet), whatever the shield or cape do.
All three use one scale, set so the S figure is 600 px tall.

These are only the starting point: fix the grip and pose with an image edit first
(Docs/Art/Specs/squad-sprite-prompts.md, "Walk from a video").

Usage (repo root): python Tools/ArtGen/cut_walk_start_frames.py warden
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_squads_from_poses as poses  # noqa: E402

W, H = 1920, 1080
S_HEIGHT = 600          # px height of the S figure
BOOTS_Y = 850           # bottom of the boots
SHADOW = (150, 0, 150)  # darker magenta, keyed away like the background
SHADOW_SIZE = (330, 60)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "source", "squad_video")


def figures_with_masks(rgb):
    """The three figures, left to right, as (original RGB crop, bool mask, keyed crop).

    Same blob split as build_squads_from_poses.split_three (the three largest blobs; smaller
    pieces over 2% join the nearest one), but keeping where each figure sits in the sheet."""
    keyed = poses.magenta_key(rgb)
    f = 4
    al = keyed[..., 3]
    Hs, Ws = al.shape
    h, w = Hs // f, Ws // f
    small = al[:h * f, :w * f].reshape(h, f, w, f).max(axis=(1, 3)) > 0.3
    labels, sizes = poses.components(small)
    order = np.argsort(sizes[1:])[::-1] + 1
    xmean = {n: np.nonzero(labels == n)[1].mean() for n in order[:12]}
    mains = sorted(order[:3], key=lambda n: xmean[n])
    owner = {n: i for i, n in enumerate(mains)}
    for n in order[3:12]:
        if sizes[n] >= sizes[order[0]] * 0.02:
            owner[n] = int(np.argmin([abs(xmean[m] - xmean[n]) for m in mains]))
    out = []
    for i in range(3):
        sel = np.isin(labels, [n for n, o in owner.items() if o == i])
        g = sel.copy()
        g[1:] |= sel[:-1]; g[:-1] |= sel[1:]; g[:, 1:] |= sel[:, :-1]; g[:, :-1] |= sel[:, 1:]
        full = np.zeros((Hs, Ws), bool)
        full[:h * f, :w * f] = np.repeat(np.repeat(g, f, 0), f, 1)
        full &= al > 0.02
        ys, xs = np.nonzero(full)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        fig = keyed[y0:y1, x0:x1].copy()
        fig[..., 3] = np.where(full[y0:y1, x0:x1], fig[..., 3], 0)
        out.append((rgb[y0:y1, x0:x1], full[y0:y1, x0:x1], fig))
    return out


def main(soldier):
    rgb = np.asarray(Image.open(os.path.join(poses.RAW, f"{soldier}_idle.png")).convert("RGB"))
    figs = figures_with_masks(rgb)
    scale = S_HEIGHT / figs[0][0].shape[0]
    for (crop, mask, keyed), d in zip(figs, "sen"):
        canvas = Image.new("RGB", (W, H), (255, 0, 255))
        shadow = Image.new("L", (W, H), 0)
        # centred under his body, not under the shield or the cape tails: the middle of the helmet
        # (top 20% of the figure) is straight above the middle of his stance in every view
        top = mask[:int(mask.shape[0] * 0.2)].any(axis=0)
        hx = np.nonzero(top)[0]
        fx = poses.feet_x(keyed) * scale
        left = round(W / 2 - fx)
        cx = left + (hx.min() + hx.max() + 1) / 2 * scale
        sw = SHADOW_SIZE[0]
        sh = SHADOW_SIZE[1]
        # at the soles of his boots, not at the lowest pixel (a shield or cape tail in front of him
        # reaches lower on screen): the lowest figure row in a band under the helmet
        hc = (hx.min() + hx.max() + 1) / 2
        half = 0.15 * mask.shape[1]
        band = mask[:, int(hc - half):int(hc + half) + 1]
        rows = np.nonzero(band.any(axis=1))[0]
        cy = BOOTS_Y - (mask.shape[0] - 1 - rows.max()) * scale - 4
        ImageDraw.Draw(shadow).ellipse((cx - sw / 2, cy - sh / 2, cx + sw / 2, cy + sh / 2), 255)
        canvas.paste(Image.new("RGB", (W, H), SHADOW), (0, 0), shadow.filter(ImageFilter.GaussianBlur(6)))

        h, w = crop.shape[:2]
        size = (round(w * scale), round(h * scale))
        fig = Image.fromarray(crop).resize(size, Image.LANCZOS)
        m = Image.fromarray((mask * 255).astype(np.uint8)).resize(size, Image.LANCZOS)
        canvas.paste(fig, (left, BOOTS_Y - size[1]), m)
        path = os.path.join(OUT, f"{soldier}_walk_{d}_start.png")
        canvas.save(path)
        print(f"{os.path.basename(path)}: figure {size[0]}x{size[1]}, scale {scale:.3f}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "warden")
