"""Puppet rigs for the AI wax art: control points that move limbs.

Coordinates are pixels in Tools/ArtGen/source/wax/<name>.png (before any
scaling). Each point is (x, y, motion, ax, ay, phase):
  "fix"   pinned (puddle, ground contact that must not slide)
  "swing" dx = ax*sin(t+ph), dy = ay*sin(t+ph)
  "step"  leg: dx = ax*sin(t+ph), dy = -ay*max(0, cos(t+ph))  (lifts while moving forward)
  "bob"   dx = ax*sin(t+ph), dy = -ay*|sin(t+ph)|  (twice per cycle)
  "howl"  head lifts and pulls back in the second half of the cycle (Frenzy)
t runs 0..2pi over one walk cycle. The image warps smoothly between points
(thin-plate spline), so soft wax bends instead of tearing.
"""
import math

import numpy as np
from PIL import Image
from scipy.interpolate import RBFInterpolator
from scipy.ndimage import map_coordinates, zoom

PI = math.pi

RIGS = {
    "wax_standard": [
        (330, 60, "bob", 8, 7, 0), (330, 170, "bob", 7, 6, 0), (250, 260, "swing", 6, 0, 0),
        (90, 380, "swing", 14, 4, 0), (60, 560, "swing", 32, 10, 0),
        (320, 400, "swing", 14, 4, PI), (345, 540, "swing", 32, 10, PI),
        (60, 690, "fix", 0, 0, 0), (260, 705, "fix", 0, 0, 0), (480, 690, "fix", 0, 0, 0), (250, 610, "fix", 0, 0, 0)],
    "wax_shard": [
        (590, 230, "swing", 26, 10, 0.8), (450, 70, "swing", 16, 6, 0.4), (380, 330, "bob", 4, 10, 0),
        (150, 560, "fix", 0, 0, 0), (400, 610, "fix", 0, 0, 0), (650, 560, "fix", 0, 0, 0)],
    "wax_crab": [
        (330, 100, "bob", 6, 8, 0), (330, 380, "bob", 0, 4, 0),
        (60, 470, "swing", 10, 26, 0), (580, 470, "swing", 10, 26, PI),
        (110, 700, "fix", 0, 0, 0), (330, 725, "fix", 0, 0, 0), (560, 700, "fix", 0, 0, 0)],
    "wax_tiger": [
        (100, 470, "step", 24, 16, 0), (300, 470, "step", 24, 16, PI), (450, 530, "step", 24, 16, PI), (600, 600, "step", 24, 16, 0),
        (130, 330, "swing", 7, 0, 0), (300, 350, "swing", 7, 0, PI), (470, 380, "swing", 7, 0, PI), (580, 430, "swing", 7, 0, 0),
        (640, 250, "bob", 4, 8, 0.3), (400, 150, "bob", 0, 6, 0),
        (150, 50, "swing", 22, 12, 0.6), (80, 160, "swing", 10, 6, 0.3)],
    "wax_tiger_cub": [
        (90, 510, "step", 22, 14, 0), (250, 560, "step", 22, 14, PI), (420, 600, "step", 22, 14, PI), (580, 560, "step", 22, 14, 0),
        (480, 260, "bob", 4, 8, 0.3), (330, 200, "bob", 0, 5, 0),
        (120, 60, "swing", 20, 12, 0.6), (60, 180, "swing", 10, 6, 0.3)],
    "wax_frenzy": [
        (100, 630, "step", 22, 16, 0), (330, 640, "step", 22, 16, PI), (500, 640, "step", 22, 16, PI), (640, 630, "step", 22, 16, 0),
        (560, 140, "howl", 10, 26, 0), (610, 210, "howl", 14, 34, 0), (400, 230, "bob", 0, 6, 0),
        (60, 420, "swing", 22, 14, 0.6), (80, 220, "swing", 10, 8, 0.3)],
    "wax_alpha_tiger": [  # v2 picture: no puddle, four separate legs
        (70, 620, "step", 22, 14, 0), (230, 580, "step", 22, 14, PI), (420, 660, "step", 22, 14, PI), (680, 640, "step", 22, 14, 0),
        (90, 480, "swing", 7, 0, 0), (220, 470, "swing", 7, 0, PI), (400, 520, "swing", 7, 0, PI), (640, 520, "swing", 7, 0, 0),
        (600, 350, "bob", 5, 8, 0.3), (330, 200, "bob", 0, 6, 0), (480, 500, "swing", 10, 4, 0.8),
        (230, 60, "swing", 22, 12, 0.6), (40, 230, "swing", 10, 6, 0.3)],
    "wax_healer": [
        (300, 140, "bob", 6, 6, 0), (70, 280, "swing", 18, 16, 0), (520, 280, "swing", 18, 16, PI),
        (120, 60, "swing", 10, 6, 0.5), (280, 10, "swing", 8, 4, 1.4), (450, 60, "swing", 10, 6, 2.3), (560, 150, "swing", 10, 6, 3.1),
        (100, 720, "fix", 0, 0, 0), (300, 740, "fix", 0, 0, 0), (480, 720, "fix", 0, 0, 0)],
    "wax_spore": [
        (430, 230, "bob", 6, 7, 0), (440, 60, "swing", 12, 8, 0.6), (160, 200, "swing", 12, 8, 1.6), (560, 190, "swing", 12, 8, 2.6),
        (80, 500, "swing", 22, 12, 0), (560, 500, "swing", 22, 12, PI),
        (120, 730, "fix", 0, 0, 0), (320, 745, "fix", 0, 0, 0), (520, 730, "fix", 0, 0, 0)],
    "wax_lens": [
        (300, 60, "bob", 7, 6, 0), (260, 230, "bob", 3, 4, 0),
        (90, 380, "swing", 12, 4, 0), (60, 560, "swing", 30, 10, 0), (400, 380, "swing", 12, 4, PI), (420, 560, "swing", 30, 10, PI),
        (60, 720, "fix", 0, 0, 0), (240, 735, "fix", 0, 0, 0), (440, 720, "fix", 0, 0, 0)],
    "wax_mirror": [
        (260, 60, "bob", 7, 6, 0), (80, 330, "swing", 12, 4, 0), (40, 520, "swing", 28, 10, 0),
        (400, 330, "swing", 12, 4, PI), (420, 520, "swing", 28, 10, PI),
        (60, 720, "fix", 0, 0, 0), (240, 735, "fix", 0, 0, 0), (430, 720, "fix", 0, 0, 0)],
    "wax_ultimate": [
        (220, 190, "bob", 8, 8, 0), (400, 80, "bob", 8, 8, 1.2), (510, 170, "bob", 8, 8, 2.4),
        (60, 230, "swing", 22, 16, 0.4), (620, 110, "swing", 22, 16, 2.0), (130, 530, "swing", 18, 8, 3.0), (560, 540, "swing", 18, 8, 1.0),
        (100, 650, "fix", 0, 0, 0), (380, 670, "fix", 0, 0, 0), (680, 650, "fix", 0, 0, 0)],
    "wax_primordial": [
        (560, 120, "bob", 8, 8, 0), (400, 350, "bob", 4, 5, 0),
        (110, 350, "swing", 14, 6, 0), (80, 560, "swing", 34, 12, 0), (690, 330, "swing", 14, 6, PI), (700, 520, "swing", 34, 12, PI),
        (100, 700, "fix", 0, 0, 0), (400, 720, "fix", 0, 0, 0), (700, 700, "fix", 0, 0, 0)],
    "wax_mother_tree": [
        (380, 300, "bob", 4, 5, 0),
        (40, 170, "swing", 16, 10, 0.3), (120, 90, "swing", 14, 10, 1.1), (330, 40, "swing", 12, 8, 1.9),
        (560, 30, "swing", 12, 8, 2.7), (720, 130, "swing", 14, 10, 3.5), (740, 250, "swing", 16, 10, 4.3),
        (120, 420, "swing", 22, 18, 0), (640, 420, "swing", 22, 18, PI),
        (60, 640, "step", 18, 10, 0), (700, 650, "step", 18, 10, PI), (380, 700, "fix", 0, 0, 0)],
    "wax_prism": [
        (330, 60, "bob", 6, 6, 0), (330, 260, "bob", 0, 4, 0),
        (60, 250, "swing", 20, 14, 0.5), (720, 300, "swing", 20, 14, 2.1), (100, 450, "swing", 22, 14, 0), (680, 450, "swing", 22, 14, PI),
        (100, 700, "fix", 0, 0, 0), (380, 720, "fix", 0, 0, 0), (660, 700, "fix", 0, 0, 0)],
    "wax_myriad": [
        (330, 40, "bob", 8, 8, 0), (380, 300, "bob", 3, 5, 0.5),
        (100, 150, "swing", 24, 18, 0.2), (40, 330, "swing", 22, 14, 1.3), (80, 450, "swing", 18, 10, 2.4),
        (720, 180, "swing", 24, 18, 3.3), (700, 320, "swing", 22, 14, 4.4), (720, 480, "swing", 18, 10, 5.4),
        (100, 690, "fix", 0, 0, 0), (380, 710, "fix", 0, 0, 0), (680, 690, "fix", 0, 0, 0)],
}


def offsets(rig, t, gain=1.0):
    out = []
    for (x, y, kind, ax, ay, ph) in rig:
        a = t + ph
        if kind == "fix":
            dx = dy = 0.0
        elif kind == "swing":
            dx, dy = ax * math.sin(a), ay * math.sin(a)
        elif kind == "step":
            dx, dy = ax * math.sin(a), -ay * max(0.0, math.cos(a))
        elif kind == "bob":
            dx, dy = ax * math.sin(a), -ay * abs(math.sin(a))
        elif kind == "howl":  # quiet first half, head thrown back in the second
            k = max(0.0, -math.sin(a)) ** 1.5
            dx, dy = -ax * k, -ay * k
        else:
            raise ValueError(kind)
        out.append((x, y, dx * gain, dy * gain))
    return out


PAD = 70


def warp(img, rig, t, gain=1.0, grid=6, box=None):
    """Bend `img` (RGBA, source pixels) so each rig point moves by its offset.
    Returns the padded canvas cropped to `box` (same box for every frame, so
    the creature does not jitter), or the full padded canvas."""
    pad = PAD
    W, H = img.width + 2 * pad, img.height + 2 * pad
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    if not rig or gain == 0:
        return canvas.crop(box) if box else canvas
    A = np.asarray(canvas).astype(np.float32)
    pts = offsets(rig, t, gain)
    src = np.array([(x + pad, y + pad) for x, y, _, _ in pts], float)
    dst = src + np.array([(dx, dy) for _, _, dx, dy in pts], float)
    corners = np.array([(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1), (W / 2, 0), (W / 2, H - 1), (0, H / 2), (W - 1, H / 2)], float)
    s = np.vstack([src, corners])
    d = np.vstack([dst, corners])
    f = RBFInterpolator(d, s - d, kernel="thin_plate_spline", smoothing=2.0)
    ys, xs = np.mgrid[0:H:grid, 0:W:grid]
    disp = f(np.c_[xs.ravel(), ys.ravel()].astype(float)).reshape(ys.shape + (2,))
    zy, zx = H / ys.shape[0], W / ys.shape[1]
    dx = zoom(disp[..., 0], (zy, zx), order=1)[:H, :W]
    dy = zoom(disp[..., 1], (zy, zx), order=1)[:H, :W]
    yy, xx = np.mgrid[0:H, 0:W]
    out = np.dstack([map_coordinates(A[..., c], [yy + dy, xx + dx], order=1, mode="constant") for c in range(4)])
    im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    return im.crop(box) if box else im


def ref_box(img, margin=60):
    """Crop box (in padded coordinates) shared by every frame of a creature."""
    x0, y0, x1, y1 = img.getbbox()
    return (x0 + PAD - margin, y0 + PAD - margin, x1 + PAD + margin, y1 + PAD + 2)


def crimson(img):
    """Frenzy wax: push the honey colours toward an angry crimson-orange."""
    a = np.asarray(img.convert("RGBA")).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3:]
    hsv = np.asarray(Image.fromarray(rgb.astype(np.uint8)).convert("HSV")).astype(np.float32)
    hsv[..., 0] = (hsv[..., 0] - 18) % 256          # yellow-orange -> red-orange
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.25 + 10, 0, 255)
    hsv[..., 2] = np.clip(hsv[..., 2] * 0.92, 0, 255)
    rgb2 = np.asarray(Image.fromarray(hsv.astype(np.uint8), "HSV").convert("RGB")).astype(np.float32)
    dark = rgb.mean(axis=2, keepdims=True) < 60       # keep the purple outline as it was
    rgb2 = np.where(dark, rgb, rgb2)
    return Image.fromarray(np.dstack([rgb2, al]).astype(np.uint8), "RGBA")


# stronger strides for the beasts, bigger tentacle waves for the big ones
_GAIN = {"wax_tiger": 1.45, "wax_tiger_cub": 1.45, "wax_frenzy": 1.4, "wax_alpha_tiger": 1.45,
         "wax_myriad": 1.35, "wax_mother_tree": 1.3, "wax_prism": 1.3, "wax_ultimate": 1.3, "wax_primordial": 1.2}
for _k, _g in _GAIN.items():
    RIGS[_k] = [(x, y, kind, ax * _g if kind in ("step", "swing") else ax, ay * _g if kind in ("step", "swing") else ay, ph)
                for (x, y, kind, ax, ay, ph) in RIGS[_k]]


# Body and head stay calm; only the limbs act (people: arms, beasts: legs).
RIGS = {k: [(x, y, kind, ax * 0.5 if kind == "bob" else ax, ay * 0.5 if kind == "bob" else ay, ph)
            for (x, y, kind, ax, ay, ph) in v] for k, v in RIGS.items()}
