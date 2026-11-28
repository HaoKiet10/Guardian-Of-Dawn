#!/usr/bin/env python3
"""Build the in-game squad (binh lính) pose sprites from the Flow pose sheets.

Input: Assets/Art/_ArtDirection/squad_raw/<soldier>_<pose>.png, one image per
pose, generated in Google Flow from Docs/Art/Specs/squad-sprite-prompts.md:
the same soldier drawn three times in one row on flat magenta (#FF00FF),
left to right S (toward camera), E (facing right), N (facing away).

Output (contract of Assets/Editor/UnitSpriteImporter.cs):
    Assets/Art/Squads/<Soldier>/squad_<soldier>_<pose>.png
    128 x 384: one 128 px column, rows S, E, N; feet on the pivot (0.5, 0.125);
    soft contact shadow drawn in. W = E with flipX in the engine.

Each soldier is scaled ONCE, from the height of its idle S pose, and that scale
is used for every pose, so a lunge or a crouch keeps the same body size. A pose
that would not fit the cell is shrunk on its own and reported.

The magenta background and the purple shadow Flow draws on it are both keyed
out; small specks away from the figures (the Flow watermark) are dropped.

Usage (repo root):
    python Tools/ArtGen/build_squads_from_poses.py
    python Tools/ArtGen/build_squads_from_poses.py --only warden --preview <dir>
    python Tools/ArtGen/build_squads_from_poses.py --dry --preview <dir>   # do not touch Assets
Needs Python 3 with Pillow and numpy.
"""
import argparse
import os
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
RAW = os.path.join(ROOT, "Assets", "Art", "_ArtDirection", "squad_raw")
ART = os.path.join(ROOT, "Assets", "Art", "Squads")

CELL = 128
SS = 3                 # compose at 3x the cell, then downsample
FEET_Y = CELL * 0.875  # feet line from the top of the cell (pivot y = 0.125)
MARGIN = 2             # px kept free at every cell edge
IDLE_HEIGHT = 53       # px: height of the idle S pose in the cell (helmet to boots), ~65% of a tier-1 tower
ROWS = ["S", "E", "N"]

# soldier: (folder, {raw pose name: output pose name})
SOLDIERS = {
    "warden":   ("Warden",   {"idle": "idle", "fire": "fire", "skill": "skill_hold"}),
    "hunter":   ("Hunter",   {"idle": "idle", "fire": "fire", "skill": "skill_execute"}),
    "engineer": ("Engineer", {"idle": "idle", "fire": "fire", "skill": "skill_build", "repair": "repair"}),
}


# ------------------------------------------------------------ magenta key
def magenta_key(rgb):
    """Float RGBA (0..1). Background and its purple shadow are keyed by how
    magenta a pixel is relative to its own brightness: min(r, b) - g over
    max(r, b). Pure magenta and the darker purple shadow both score high; the
    dark-violet outline, gloves and blue-grey cloth score low."""
    a = rgb.astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hi = np.maximum(np.maximum(r, b), 1.0)
    score = (np.minimum(r, b) - g) / hi
    pure = score > 0.85
    if pure.sum() < 1000:
        raise ValueError("no magenta background found")
    bg = np.median(a[pure], axis=0)

    alpha = 1.0 - np.clip((score - 0.30) / (0.62 - 0.30), 0, 1)
    am = np.clip(alpha, 0.05, 1)[..., None]
    fg = np.where(alpha[..., None] < 0.995, (a - (1 - am) * bg) / am, a)
    fg = np.clip(fg, 0, 255)
    # despill: an edge pixel may not stay more magenta than the outline colour
    edge = alpha < 0.98
    excess = np.where(edge, np.clip(np.minimum(fg[..., 0], fg[..., 2]) - fg[..., 1] - 30, 0, None), 0)
    fg[..., 0] -= excess
    fg[..., 2] -= excess
    alpha = np.clip((alpha - 0.08) / 0.84, 0, 1)
    return np.dstack([fg / 255.0, alpha])


# ------------------------------------------------- figures and specks
def components(mask):
    """4-connected components of a small bool mask. Returns a label array and sizes."""
    H, W = mask.shape
    labels = np.zeros((H, W), np.int32)
    sizes = [0]
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if labels[y0, x0]:
            continue
        n = len(sizes)
        labels[y0, x0] = n
        q = deque([(y0, x0)])
        count = 0
        while q:
            y, x = q.popleft()
            count += 1
            for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= yy < H and 0 <= xx < W and mask[yy, xx] and not labels[yy, xx]:
                    labels[yy, xx] = n
                    q.append((yy, xx))
        sizes.append(count)
    return labels, np.array(sizes)


def split_three(rgba, factor=4, keep=0.02):
    """Cut the keyed sheet into its three figures, left to right.

    Works on blobs, not columns, because a weapon of one figure can reach over
    the next one's columns. The three largest blobs are the figures; any other
    blob at least `keep` of the largest (a detached glow or weapon tip) joins
    the figure whose centre is nearest; smaller ones (the watermark) are dropped."""
    al = rgba[..., 3]
    H, W = al.shape
    h, w = H // factor, W // factor
    small = al[:h * factor, :w * factor].reshape(h, factor, w, factor).max(axis=(1, 3)) > 0.3
    labels, sizes = components(small)
    order = np.argsort(sizes[1:])[::-1] + 1
    if len(order) < 3:
        raise ValueError(f"found {len(order)} figures, expected 3")
    mains = sorted(order[:3], key=lambda n: np.nonzero(labels == n)[1].mean())
    centres = [np.nonzero(labels == n)[1].mean() for n in mains]
    owner = np.zeros(len(sizes), np.int32) - 1
    for i, n in enumerate(mains):
        owner[n] = i
    for n in order[3:]:
        if sizes[n] >= sizes[order[0]] * keep:
            owner[n] = int(np.argmin([abs(c - np.nonzero(labels == n)[1].mean()) for c in centres]))
    figures = []
    for i in range(3):
        sel = owner[labels] == i
        sel[labels == 0] = False
        full = np.zeros((H, W), bool)
        # grow by one small cell so soft edges just outside the blob are kept
        grown = sel.copy()
        grown[1:] |= sel[:-1]; grown[:-1] |= sel[1:]; grown[:, 1:] |= sel[:, :-1]; grown[:, :-1] |= sel[:, 1:]
        full[:h * factor, :w * factor] = np.repeat(np.repeat(grown, factor, axis=0), factor, axis=1)
        part = rgba.copy()
        part[..., 3] = np.where(full, al, 0)
        ys, xs = np.nonzero(part[..., 3] > 0.02)
        figures.append(part[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
    return figures


def feet_x(im):
    """x of the body's base: weighted median of the lower 25% of the figure.
    Thin weapons that stick out sideways carry too little mass to pull it."""
    h = im.shape[0]
    col = im[int(h * 0.75):, :, 3].sum(axis=0)
    c = np.cumsum(col)
    return float(np.searchsorted(c, c[-1] / 2)) if c[-1] > 0 else im.shape[1] / 2


def base_width(im):
    low = im[int(im.shape[0] * 0.85):, :, 3].sum(axis=0) > 0.5
    xs = np.nonzero(low)[0]
    return (xs.max() - xs.min() + 1) if len(xs) else im.shape[1]


# -------------------------------------------------------------- rendering
def to_pil(im):
    return Image.fromarray((np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")


def premult_resize(pil, size):
    a = np.asarray(pil).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:]
    out = np.asarray(Image.fromarray((a * 255 + 0.5).astype(np.uint8), "RGBA")
                     .resize(size, Image.LANCZOS)).astype(np.float32) / 255
    al = np.clip(out[..., 3:], 1e-4, 1)
    out[..., :3] = np.clip(out[..., :3] / al, 0, 1)
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")


def fit_scale(im, fx, scale):
    """Largest scale <= `scale` at which the figure stays inside the cell margins."""
    h, w = im.shape[:2]
    limits = [scale,
              (FEET_Y - MARGIN) / h,
              (CELL / 2 - MARGIN) / max(fx, 1),
              (CELL / 2 - MARGIN) / max(w - fx, 1)]
    return min(limits)


def render(im, scale):
    """One 128 px cell: figure with its feet on the pivot, soft shadow under it."""
    fx = feet_x(im)
    s = scale * SS
    W = CELL * SS
    h, w = im.shape[:2]
    pil = premult_resize(to_pil(im), (max(1, round(w * s)), max(1, round(h * s))))
    cx, fy = W / 2, FEET_Y * SS
    canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    rx = min(base_width(im) * s * 0.55, W * 0.40)
    sh = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([cx - rx, fy - rx * 0.22, cx + rx, fy + rx * 0.22], fill=(40, 30, 60, 90))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(SS * 1.6)))
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    layer.paste(pil, (round(cx - fx * s), round(fy - pil.size[1])), pil)
    canvas = Image.alpha_composite(canvas, layer)
    return premult_resize(canvas, (CELL, CELL))


# ------------------------------------------------------------------ build
def load(soldier, pose):
    path = os.path.join(RAW, f"{soldier}_{pose}.png")
    if not os.path.exists(path):
        return None
    rgb = np.asarray(Image.open(path).convert("RGB"))
    return split_three(magenta_key(rgb))


def build(soldier, dry=False):
    folder, poses = SOLDIERS[soldier]
    idle = load(soldier, "idle")
    if idle is None:
        print(f"{soldier}: no idle sheet, skipped")
        return {}
    scale = IDLE_HEIGHT / idle[0].shape[0]
    out = {}
    for raw_name, out_name in poses.items():
        figures = idle if raw_name == "idle" else load(soldier, raw_name)
        if figures is None:
            print(f"{soldier}: {raw_name} missing")
            continue
        cells = []
        for row, im in zip(ROWS, figures):
            s = fit_scale(im, feet_x(im), scale)
            if s < scale * 0.995:
                print(f"  {soldier} {out_name} {row}: shrunk to {s / scale:.0%} to fit the cell")
            cells.append(render(im, s))
        sheet = Image.new("RGBA", (CELL, CELL * len(cells)), (0, 0, 0, 0))
        for i, c in enumerate(cells):
            sheet.paste(c, (0, i * CELL))
        name = f"squad_{soldier}_{out_name}"
        out[out_name] = sheet
        if not dry:
            os.makedirs(os.path.join(ART, folder), exist_ok=True)
            sheet.save(os.path.join(ART, folder, name + ".png"))
        print(f"{soldier}: {name}.png" + (" (dry)" if dry else ""))
    return out


# ---------------------------------------------------------------- preview
def write_preview(results, out_dir):
    """Every pose at game size (1x) and at 3x, next to a Machine Gun tower, on map grass."""
    os.makedirs(out_dir, exist_ok=True)
    tower = None
    base = os.path.join(ROOT, "Assets", "Art", "Towers", "MachineGun")
    try:
        b = Image.open(os.path.join(base, "tower_machine_gun_t1_base_idle.png")).convert("RGBA").crop((0, 0, 128, 128))
        hd = Image.open(os.path.join(base, "tower_machine_gun_t1_head_idle.png")).convert("RGBA").crop((0, 0, 128, 128))
        tower = Image.alpha_composite(b, hd)
    except OSError:
        pass
    grass = (86, 102, 70, 255)
    for zoom in (1, 3):
        cols = sum(len(p) for p in results.values()) * 3 + (1 if tower else 0)
        img = Image.new("RGBA", (cols * CELL * zoom, CELL * zoom), grass)
        x = 0
        if tower:
            img.alpha_composite(tower.resize((CELL * zoom, CELL * zoom), Image.NEAREST), (0, 0))
            x = CELL * zoom
        for soldier, poses in results.items():
            for pose, sheet in poses.items():
                for r in range(3):
                    cell = sheet.crop((0, r * CELL, CELL, (r + 1) * CELL))
                    img.alpha_composite(cell.resize((CELL * zoom, CELL * zoom), Image.NEAREST), (x, 0))
                    x += CELL * zoom
        img.save(os.path.join(out_dir, f"squads_preview_{zoom}x.png"))
    # one squad of three on the grass, as Squad.cs places them (spacing 0.45 unit)
    for soldier, poses in results.items():
        if "idle" not in poses:
            continue
        S = poses["idle"].crop((0, 0, CELL, CELL))
        img = Image.new("RGBA", (CELL * 3, CELL * 2), grass)
        if tower:
            img.alpha_composite(tower, (0, 40))
        n = 3 if soldier == "warden" else 2
        for i in range(n):
            ox = (i - (n - 1) * 0.5) * 0.45 * CELL
            oy = 0 if i % 2 == 0 else 0.45 * CELL * 0.3
            img.alpha_composite(S, (int(CELL * 1.9 + ox - CELL / 2), int(CELL * 0.75 + oy - CELL * 0.375)))
        img.resize((img.width * 2, img.height * 2), Image.NEAREST).save(os.path.join(out_dir, f"squad_{soldier}_group_2x.png"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", help="comma-separated soldiers, e.g. warden,hunter")
    ap.add_argument("--dry", action="store_true", help="do not write into Assets")
    ap.add_argument("--preview", help="folder for preview images")
    args = ap.parse_args()
    names = args.only.split(",") if args.only else list(SOLDIERS)
    results = {}
    for n in names:
        res = build(n.strip().lower(), dry=args.dry)
        if res:
            results[n] = res
    if args.preview and results:
        write_preview(results, args.preview)
        print("preview:", args.preview)


if __name__ == "__main__":
    main()
