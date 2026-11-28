#!/usr/bin/env python3
"""Build a squad soldier's walk frames from a Google Flow image-to-video clip.

Input: Assets/Art/_ArtDirection/squad_raw/<clip>.mp4, a soldier walking in place on flat magenta
(prompt in Docs/Art/Specs/squad-sprite-prompts.md, "Walk from a video"). The frames to use are picked
by hand (one stride, evenly spaced, skipping frames with artefacts) and listed in WALKS below.

Output (contract of Assets/Editor/UnitSpriteImporter.cs):
    Assets/Art/Squads/<Soldier>/squad_<soldier>_walk_<s|e|n>.png
    one row of 128 px cells, one per frame, feet on the pivot (0.5, 0.125), soft shadow drawn in.

The camera of the clip is locked, so every frame gets the SAME scale and offset: the bounce and the
lifted feet drawn in the video are kept. The scale makes the walk as tall as the soldier's idle sprite
for that direction, so walking and standing match in size.

Usage (repo root):
    python Tools/ArtGen/build_squad_walk_from_video.py                 # every clip in WALKS
    python Tools/ArtGen/build_squad_walk_from_video.py --only hunter_e --preview <dir>
Needs Python 3 with Pillow and numpy, and ffmpeg on PATH.
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_squads_from_poses as poses  # noqa: E402  (shared key, split and resize helpers)

CELL, SS, FEET_Y = poses.CELL, poses.SS, poses.FEET_Y
ROWS = {"s": 0, "e": 1, "n": 2}

# "<soldier>_<dir>": (clip in squad_raw, 1-based frame numbers of one stride, in order)
WALKS = {
    "hunter_e": ("hunter_walk_right.mp4", [138, 141, 144, 147, 150, 154, 157, 160]),
    "hunter_s": ("hunter_walk_s.mp4", [37, 40, 43, 46, 49, 52, 55, 58]),
    "hunter_n": ("hunter_walk_n.mp4", [132, 135, 138, 141, 144, 148, 151, 154]),
    "warden_e": ("warden_walk_e.mp4", [115, 118, 121, 124, 127, 131, 134, 137]),
    "warden_s": ("warden_walk_s.mp4", [117, 120, 123, 127, 130, 133, 137, 140]),
    "warden_n": ("warden_walk_n.mp4", [138, 141, 144, 147, 150, 154, 157, 160]),
    "engineer_e": ("engineer_walk_e.mp4", [59, 63, 66, 69, 73, 77, 80, 83]),
    "engineer_s": ("engineer_walk_s.mp4", [106, 109, 112, 115, 118, 121, 124, 127]),
    "engineer_n": ("engineer_walk_n.mp4", [131, 134, 137, 140, 143, 146, 149, 152]),
}


def extract(clip, numbers, tmp):
    """The listed frames of the clip as RGB arrays."""
    subprocess.run(["ffmpeg", "-v", "error", "-i", clip, os.path.join(tmp, "f_%04d.png")], check=True)
    files = sorted(glob.glob(os.path.join(tmp, "f_*.png")))
    return [np.asarray(Image.open(files[n - 1]).convert("RGB")) for n in numbers]


def figure_only(rgba):
    """Keep the largest blob (the soldier); drop the watermark and specks."""
    f = 4
    al = rgba[..., 3]
    H, W = al.shape
    h, w = H // f, W // f
    small = al[:h * f, :w * f].reshape(h, f, w, f).max(axis=(1, 3)) > 0.3
    labels, sizes = poses.components(small)
    keep = labels == (np.argmax(sizes[1:]) + 1)
    keep[1:] |= keep[:-1]; keep[:-1] |= keep[1:]; keep[:, 1:] |= keep[:, :-1]; keep[:, :-1] |= keep[:, 1:]
    full = np.zeros((H, W), bool)
    full[:h * f, :w * f] = np.repeat(np.repeat(keep, f, 0), f, 1)
    out = rgba.copy()
    out[..., 3] = np.where(full, al, 0)
    return out


def idle_height(soldier, direction):
    """Height in cell px of the idle sprite for this direction (helmet to boots)."""
    folder = poses.SOLDIERS[soldier][0]
    sheet = np.asarray(Image.open(os.path.join(poses.ART, folder, f"squad_{soldier}_idle.png")).convert("RGBA"))
    cell = sheet[ROWS[direction] * CELL:(ROWS[direction] + 1) * CELL, :, 3]
    ys = np.nonzero(cell > 128)[0]   # solid pixels only, not the soft shadow
    return ys.max() - ys.min() + 1


def build(key, preview=None, dry=False):
    soldier, direction = key.rsplit("_", 1)
    clip, numbers = WALKS[key]
    with tempfile.TemporaryDirectory() as tmp:
        frames = [figure_only(poses.magenta_key(rgb)) for rgb in extract(os.path.join(poses.RAW, clip), numbers, tmp)]

    # one transform for all frames: anchor = body base x (median), ground = lowest foot of the stride
    boxes = [np.nonzero(f[..., 3] > 0.5) for f in frames]
    heights = [ys.max() - ys.min() + 1 for ys, _ in boxes]
    y0 = min(ys.min() for ys, _ in boxes)
    ground = max(ys.max() for ys, _ in boxes)
    x0 = min(xs.min() for _, xs in boxes)
    x1 = max(xs.max() for _, xs in boxes)
    anchor = float(np.median([poses.feet_x(f[y0:ground + 1, x0:x1 + 1]) for f in frames]))
    scale = idle_height(soldier, direction) / float(np.median(heights))

    s = scale * SS
    W = CELL * SS
    cx, fy = W / 2, FEET_Y * SS
    base = np.median([poses.base_width(f[y0:ground + 1, x0:x1 + 1]) for f in frames])
    rx = min(base * s * 0.55, W * 0.40)
    shadow = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse([cx - rx, fy - rx * 0.22, cx + rx, fy + rx * 0.22], fill=(40, 30, 60, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(SS * 1.6))

    cells = []
    for f in frames:
        crop = f[y0:ground + 1, x0:x1 + 1]
        h, w = crop.shape[:2]
        pil = poses.premult_resize(poses.to_pil(crop), (max(1, round(w * s)), max(1, round(h * s))))
        left, top = round(cx - anchor * s), round(fy - h * s)
        if left < 0 or top < 0 or left + pil.size[0] > W:
            raise SystemExit(f"{key}: frame does not fit the {CELL} px cell, lower the scale")
        canvas = shadow.copy()
        layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        layer.paste(pil, (left, top), pil)
        cells.append(poses.premult_resize(Image.alpha_composite(canvas, layer), (CELL, CELL)))

    sheet = Image.new("RGBA", (CELL * len(cells), CELL), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        sheet.paste(c, (i * CELL, 0))
    folder = poses.SOLDIERS[soldier][0]
    name = f"squad_{soldier}_walk_{direction}"
    if not dry:
        sheet.save(os.path.join(poses.ART, folder, name + ".png"))
    print(f"{key}: {name}.png, {len(cells)} frames, scale {scale:.4f}" + (" (dry)" if dry else ""))

    if preview:
        os.makedirs(preview, exist_ok=True)
        grass = (86, 102, 70, 255)
        out = []
        for c in cells:
            bg = Image.new("RGBA", (CELL, CELL), grass)
            bg.alpha_composite(c)
            out.append(bg.resize((CELL * 3, CELL * 3), Image.NEAREST))
        out[0].save(os.path.join(preview, name + "_3x.gif"), save_all=True, append_images=out[1:],
                    duration=1000 // 8, loop=0)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", help="comma-separated keys of WALKS, e.g. hunter_e")
    ap.add_argument("--dry", action="store_true", help="do not write into Assets")
    ap.add_argument("--preview", help="folder for a 3x preview GIF")
    args = ap.parse_args()
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg not found on PATH")
    for key in (args.only.split(",") if args.only else WALKS):
        build(key.strip(), args.preview, args.dry)


if __name__ == "__main__":
    main()
