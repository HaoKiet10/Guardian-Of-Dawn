#!/usr/bin/env python3
"""gen_vfx.py - draws the VFX sprite sheets for the wax creatures (Di The Sap) by code.

    python3 Tools/ArtGen/gen_vfx.py                    # write every sheet + manifest + README
    python3 Tools/ArtGen/gen_vfx.py --only burning,heal # only effects whose name contains a word
    python3 Tools/ArtGen/gen_vfx.py --board out.png     # also render a preview board
    python3 Tools/ArtGen/gen_vfx.py --dry --board out.png   # preview only, nothing written to Assets

Output: Assets/Art/VFX/<Group>/vfx_<name>.png (one row of frames per effect),
Assets/Art/VFX/vfx_manifest.json (read by the game, the HTML prototype and
Assets/Editor/UnitSpriteImporter.cs) and Assets/Art/VFX/README.md.

How it draws: every shape is a signed distance function (SDF) evaluated with
numpy on a supersampled grid, so edges are anti-aliased and outlines are exact
offsets of the shape. Style follows the towers and maps: thick dark-violet
outline #2c2240, 3 tones per colour, light from the top-left. The script is
deterministic (random numbers are seeded from the effect name).

Adding an effect: write a function `def fx(cv, i, n, rng)` that draws frame i of
n on the canvas `cv`, and decorate it with @effect(...). Coordinates are cell
pixels, y goes down. Needs Python 3 with numpy, scipy and Pillow.
"""
import argparse
import json
import math
import os
import zlib

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'Assets', 'Art', 'VFX')
PI, TAU = math.pi, math.tau


# --------------------------------------------------------------------------- colours
def C(h):
    h = h.lstrip('#')
    return tuple(int(h[k:k + 2], 16) / 255.0 for k in (0, 2, 4))


OUTL = C('2c2240')                      # outline of every solid shape
WHITE = C('ffffff')
# neutral wax: light grey-white so the game can tint it with the creature's accent colour
WAX, WAX_D, WAX_L = C('f6f0e4'), C('c8bcc9'), C('ffffff')
# reserved status colours (art-spec.yaml) - used only by their status
FIRE, FIRE_L, FIRE_C, FIRE_D = C('ef5b31'), C('ffb347'), C('fff0a8'), C('a82a1c')
ACID, ACID_L, ACID_D = C('a6ff4d'), C('e6ffb0'), C('4aa52a')
ICE, ICE_L, ICE_D, ICE_B = C('93cdd9'), C('e8fbff'), C('5a94b3'), C('8ff1ff')
HEAL, HEAL_L, HEAL_D = C('58dd7c'), C('d2ffd6'), C('1f7a4a')
TELE = C('fff6d8')                      # telegraph glow (skill warnings only)
AMBER, AMBER_D = C('ffc93d'), C('c9861a')
DANGER, DANGER_L, DANGER_D = C('ff3b55'), C('ffc2c9'), C('9c1432')
ROPE, ROPE_D = C('e8bd80'), C('9a6b3c')
TAR, TAR_M, TAR_L = C('1c1528'), C('3b2c55'), C('7a66a3')
HOWL, HOWL_L = C('e23566'), C('ffc4d6')
SPORE, SPORE_L, SPORE_D = C('a45cf0'), C('dcbcff'), C('6a32a8')
BUTTER, BUTTER_L, BUTTER_D = C('f2bd3c'), C('ffe596'), C('b57a1c')
BONE, BONE_D = C('f6ead0'), C('cfae78')
GOLD, GOLD_L = C('ffd75a'), C('fff4c0')
LILAC, LILAC_L = C('c9a6ff'), C('efe2ff')
STONE, STONE_L, STONE_D = C('8d8fa3'), C('c2c4d2'), C('5c5d73')
ROOT_C, ROOT_L, ROOT_D = C('6b4a2e'), C('9a7248'), C('422a1e')
PINK, PINK_L, PINK_D = C('ff8fb0'), C('ffd3e0'), C('c9547c')
RAINBOW = [C('ff9ad5'), C('ffe680'), C('9dffc8'), C('8fc7ff'), C('c6a2ff')]
DUSTS = {                                # footstep puff per map: mid, dark, light
    'dust': (C('b9ae9a'), C('8b806e'), C('ddd5c6')),
    'splash': (C('a9dcee'), C('6fa9c8'), C('eaf9ff')),
    'salt': (C('f4f0e6'), C('cfc6b4'), C('ffffff')),
    'snow': (C('e9e2fa'), C('b9acd8'), C('ffffff')),
}


# --------------------------------------------------------------------------- SDF shapes
def circle(cx, cy, r):
    return lambda x, y: np.hypot(x - cx, y - cy) - r


def ellipse(cx, cy, rx, ry):
    m = min(rx, ry)
    return lambda x, y: (np.hypot((x - cx) / rx, (y - cy) / ry) - 1.0) * m


def seg(x0, y0, x1, y1, r0, r1=None):
    """Capsule from (x0,y0) to (x1,y1); radius goes from r0 to r1 (tapered)."""
    r1 = r0 if r1 is None else r1
    ex, ey = x1 - x0, y1 - y0
    L = ex * ex + ey * ey + 1e-9

    def f(x, y):
        t = np.clip(((x - x0) * ex + (y - y0) * ey) / L, 0, 1)
        return np.hypot(x - x0 - ex * t, y - y0 - ey * t) - (r0 + (r1 - r0) * t)
    return f


def box(cx, cy, hw, hh, r=0.0):
    def f(x, y):
        dx, dy = np.abs(x - cx) - (hw - r), np.abs(y - cy) - (hh - r)
        return np.hypot(np.maximum(dx, 0), np.maximum(dy, 0)) + np.minimum(np.maximum(dx, dy), 0) - r
    return f


def poly(pts, margin=14.0):
    """Exact polygon SDF (even-odd). Evaluated only near its bounding box."""
    P = np.asarray(pts, np.float64)
    x0, y0 = P.min(0) - margin
    x1, y1 = P.max(0) + margin
    n = len(P)

    def f(x, y):
        xs, ys = x[0, :], y[:, 0]
        ci = np.where((xs >= x0) & (xs <= x1))[0]
        ri = np.where((ys >= y0) & (ys <= y1))[0]
        out = np.full(x.shape, margin, np.float64)
        if len(ci) == 0 or len(ri) == 0:
            return out
        sl = (slice(ri[0], ri[-1] + 1), slice(ci[0], ci[-1] + 1))
        xx, yy = x[sl], y[sl]
        d = np.full(xx.shape, 1e18)
        inside = np.zeros(xx.shape, bool)
        for k in range(n):
            ax, ay = P[k]
            bx, by = P[(k + 1) % n]
            ex, ey = bx - ax, by - ay
            wx, wy = xx - ax, yy - ay
            t = np.clip((wx * ex + wy * ey) / (ex * ex + ey * ey + 1e-12), 0, 1)
            d = np.minimum(d, (wx - ex * t) ** 2 + (wy - ey * t) ** 2)
            if ay != by:
                cross = (ay > yy) != (by > yy)
                inside ^= cross & (xx < ax + wy * ex / ey)
        d = np.sqrt(d)
        out[sl] = np.minimum(np.where(inside, -d, d), margin)
        return out
    return f


def polyline(pts, r):
    fs = [seg(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], r) for k in range(len(pts) - 1)]
    return union(*fs)


def union(*fs):
    def f(x, y):
        d = fs[0](x, y)
        for g in fs[1:]:
            d = np.minimum(d, g(x, y))
        return d
    return f


def smin(k, *fs):
    """Smooth union: shapes melt into each other (wax, puddles)."""
    def f(x, y):
        d = fs[0](x, y)
        for g in fs[1:]:
            e = g(x, y)
            h = np.clip(0.5 + 0.5 * (e - d) / k, 0, 1)
            d = e + (d - e) * h - k * h * (1 - h)
        return d
    return f


def sub(a, b):
    return lambda x, y: np.maximum(a(x, y), -b(x, y))


def inter(a, b):
    return lambda x, y: np.maximum(a(x, y), b(x, y))


def grow(a, r):
    return lambda x, y: a(x, y) - r


def blob(cx, cy, rx, ry, lobes):
    """Wobbly ellipse; lobes = [(k, amplitude, phase), ...] in polar angle."""
    m = min(rx, ry)

    def f(x, y):
        dx, dy = (x - cx) / rx, (y - cy) / ry
        th = np.arctan2(dy, dx)
        rf = 1.0
        for k, a, p in lobes:
            rf = rf + a * np.sin(k * th + p)
        return (np.hypot(dx, dy) / rf - 1.0) * m
    return f


def star(cx, cy, n, ro, ri, rot=0.0):
    pts = []
    for k in range(2 * n):
        r = ro if k % 2 == 0 else ri
        a = rot + k * PI / n
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return poly(pts)


def ngon(cx, cy, n, r, rot=0.0):
    return poly([(cx + r * math.cos(rot + k * TAU / n), cy + r * math.sin(rot + k * TAU / n)) for k in range(n)])


def plus(cx, cy, r, w):
    return union(box(cx, cy, r, w, w * 0.5), box(cx, cy, w, r, w * 0.5))


def tear(cx, cy, r, ang, length):
    """Droplet: round head at (cx,cy), tail pointing along ang."""
    return seg(cx, cy, cx + length * math.cos(ang), cy + length * math.sin(ang), r, r * 0.12)


def earc(cx, cy, rx, ry, a0, a1, w, n=22, taper=True, jag=0.0):
    """Band of width w along an ellipse from angle a0 to a1 (crescent when tapered)."""
    ref = (rx + ry) / 2.0
    if not taper and jag == 0.0 and abs(abs(a1 - a0) - TAU) < 1e-6:      # full ring: analytic, much faster
        k = w / 2.0 / ref
        return lambda x, y: (np.abs(np.hypot((x - cx) / rx, (y - cy) / ry) - 1.0) - k) * ref
    outer, inner = [], []
    for k in range(n + 1):
        u = k / n
        a = a0 + (a1 - a0) * u
        p = (math.sin(PI * u) ** 0.6 if taper else 1.0) * w / 2.0 / ref
        j = 1.0 + (jag if k % 2 else -jag)
        ca, sa = math.cos(a), math.sin(a)
        outer.append((cx + rx * (j + p) * ca, cy + ry * (j + p) * sa))
        inner.append((cx + rx * (j - p) * ca, cy + ry * (j - p) * sa))
    return poly(outer + inner[::-1])


def flame(cx, by, b, h, sway, ph, n=9):
    """One flame tongue standing on (cx, by): half-width b, height h."""
    L, R = [], []
    for k in range(n + 1):
        v = k / n
        w = b * (1 - v) ** 0.75 * (0.8 + 0.5 * math.sin(PI * min(1.0, v * 1.4)))
        x = cx + sway * h * 0.3 * v * v + math.sin(v * 5 + ph) * b * 0.2 * v
        y = by - h * v
        L.append((x - w, y))
        R.append((x + w, y))
    return union(poly(L + R[::-1]), circle(cx, by - b * 0.15, b * 0.82))


def shard(cx, by, w, h, lean):
    """Ice/crystal spike: returns (whole, light facet)."""
    tip = (cx + lean, by - h)
    sl = (cx - w * 0.75 + lean * 0.4, by - h * 0.5)
    sr = (cx + w * 0.8 + lean * 0.5, by - h * 0.45)
    whole = poly([(cx - w, by), sl, tip, sr, (cx + w, by)])
    facet = poly([(cx - w, by), sl, tip, (cx + lean * 0.2, by)])
    return whole, facet


# --------------------------------------------------------------------------- canvas
class Canvas:
    """Premultiplied float RGBA canvas, supersampled `ss` times."""

    def __init__(self, w, h, ss=2):
        self.w, self.h, self.ss = w, h, ss
        ys, xs = np.mgrid[0:h * ss, 0:w * ss]
        self.X = (xs + 0.5) / ss
        self.Y = (ys + 0.5) / ss
        self.buf = np.zeros((h * ss, w * ss, 4), np.float64)

    def cov(self, d):
        return np.clip(0.5 - d * self.ss, 0, 1)

    def paint(self, a, col):
        a = np.clip(a, 0, 1)[..., None]
        self.buf[..., :3] = self.buf[..., :3] * (1 - a) + np.asarray(col) * a
        self.buf[..., 3:] = self.buf[..., 3:] * (1 - a) + a

    def fill(self, f, col, alpha=1.0):
        self.paint(self.cov(f(self.X, self.Y)) * alpha, col)

    def solid(self, f, col, ow=2.2, dark=None, light=None, sh=3.0, outline=OUTL):
        """Outlined shape with an optional shadow crescent (bottom-right) and highlight (top-left)."""
        d = f(self.X, self.Y)
        if ow:
            self.paint(self.cov(d - ow), outline)
        self.paint(self.cov(d), col)
        if dark is not None:
            self.paint(self.cov(np.maximum(d, -f(self.X + sh, self.Y + sh))), dark)
        if light is not None:
            self.paint(self.cov(np.maximum(d, -f(self.X - sh * 0.8, self.Y - sh * 0.8))), light)

    def glow(self, f, col, radius, strength=1.0):
        g = gaussian_filter(self.cov(f(self.X, self.Y)), radius * self.ss)
        self.paint(g * strength, col)

    def erase(self, f, alpha=1.0):
        self.buf *= (1 - self.cov(f(self.X, self.Y)) * alpha)[..., None]

    def group(self, alpha=1.0):
        return _Group(self, alpha)

    def image(self):
        s = self.ss
        b = self.buf.reshape(self.h, s, self.w, s, 4).mean((1, 3))
        a = b[..., 3:]
        rgb = np.where(a > 1e-5, b[..., :3] / np.maximum(a, 1e-5), 0)
        out = np.concatenate([rgb, a], -1)
        return Image.fromarray(np.clip(np.round(out * 255), 0, 255).astype(np.uint8), 'RGBA')


class _Group:
    """Draw several shapes, then composite them together with one alpha."""

    def __init__(self, cv, alpha):
        self.cv, self.alpha = cv, alpha

    def __enter__(self):
        self.saved = self.cv.buf
        self.cv.buf = np.zeros_like(self.saved)

    def __exit__(self, *exc):
        top = self.cv.buf * self.alpha
        self.cv.buf = self.saved * (1 - top[..., 3:]) + top


def ease(t):
    t = min(1.0, max(0.0, t))
    return 1 - (1 - t) ** 2


def lerp(a, b, t):
    return a + (b - a) * t


def puff(cv, x, y, r, pal, ow=1.6):
    mid, dk, lt = pal
    f = union(circle(x, y, r), circle(x - r * 0.72, y + r * 0.25, r * 0.62),
              circle(x + r * 0.74, y + r * 0.2, r * 0.66), circle(x + r * 0.1, y - r * 0.55, r * 0.6))
    cv.solid(f, mid, ow=ow, dark=dk, light=lt, sh=max(1.2, r * 0.3))


def ground_ring(cv, cx, cy, rx, ry, col, edge, w=3.5, fill=0.0, light=None):
    """Ring lying on the ground: dark edge, bright line, optional soft fill."""
    if fill:
        cv.fill(ellipse(cx, cy, rx, ry), col, fill)
    cv.fill(earc(cx, cy, rx, ry, 0, TAU, w + 3.5, n=64, taper=False), edge)
    cv.fill(earc(cx, cy, rx, ry, 0, TAU, w, n=64, taper=False), col)
    if light is not None:
        cv.fill(earc(cx, cy, rx, ry, 0, TAU, w * 0.4, n=64, taper=False), light)


def sparkle(cv, x, y, r, col=WHITE, edge=OUTL, ow=1.4, rot=0.0):
    if r < 0.8:
        return
    cv.solid(star(x, y, 4, r, r * 0.28, rot - PI / 2), col, ow=ow, outline=edge)


def chip(cv, x, y, r, rot, col, dk, ow=1.6):
    """Small angular chunk (wax shard, stone chip)."""
    pts = [(x + r * f * math.cos(rot + a), y + r * f * math.sin(rot + a))
           for a, f in ((0, 1.0), (1.9, 0.75), (3.3, 0.9), (4.7, 0.6))]
    cv.solid(poly(pts), col, ow=ow, dark=dk, sh=max(1.0, r * 0.35))


# --------------------------------------------------------------------------- registry
EFFECTS = []


def effect(name, group, cell, frames, fps, loop, pivot, blend='alpha', scale=1.0, layer='over',
           used_by='all', when='', notes='', tintable=False, ss=2):
    """Register an effect. pivot = Unity convention (x from left, y from BOTTOM, 0..1).
    layer: ground (under units) | over (on top of the unit) | icon (above the head) | screen."""
    def deco(fn):
        EFFECTS.append(dict(name=name, group=group, cell=cell, frames=frames, fps=fps, loop=loop,
                            pivot=pivot, blend=blend, scale=scale, layer=layer, used_by=used_by,
                            when=when, notes=notes, tintable=tintable, ss=ss, fn=fn))
        return fn
    return deco


# =========================================================================== SHARED
def _step(style):
    pal = DUSTS[style]

    def fx(cv, i, n, rng):
        t = i / (n - 1)
        e = ease(t)
        with cv.group(1.0 if t < 0.55 else lerp(1.0, 0.25, (t - 0.55) / 0.45)):
            if style == 'splash':
                rx = 6 + 20 * e
                cv.fill(earc(32, 40, rx, rx * 0.36, 0, TAU, 4.6, n=40, taper=False), OUTL, 0.8)
                cv.fill(earc(32, 40, rx, rx * 0.36, 0, TAU, 2.2, n=40, taper=False), pal[2])
                for k in range(5):
                    a = -PI / 2 + (k - 2) * 0.5 + rng.uniform(-0.1, 0.1)
                    sp = rng.uniform(16, 24)
                    x = 32 + math.cos(a) * sp * t * 1.2
                    y = 38 + math.sin(a) * sp * e * 1.4 + 26 * t * t
                    r = lerp(3.6, 1.6, t)
                    va = math.atan2(math.sin(a) * sp * 1.4 * (1 - t) + 26 * t, math.cos(a) * sp)
                    cv.solid(tear(x, y, r, va + PI, r * 2.2), pal[0], ow=1.5, light=pal[2], sh=1.2)
            else:
                for k, (dx, dy, r0) in enumerate(((-13, -3, 7.5), (12, -5, 8.5), (0, -11, 9.5))):
                    r = r0 * (0.45 + 0.75 * e) * (1.0 if t < 0.7 else lerp(1, 0.6, (t - 0.7) / 0.3))
                    puff(cv, 32 + dx * e * 1.15, 38 + dy * e * 1.3, r, pal)
                if style in ('salt', 'snow'):
                    for k in range(4):
                        a = -PI / 2 + (k - 1.5) * 0.7
                        x = 32 + math.cos(a) * 22 * e
                        y = 36 + math.sin(a) * 22 * e + 14 * t * t
                        if style == 'salt':
                            cv.solid(box(x, y, 1.9, 1.9, 0.4), pal[2], ow=1.3)
                        else:
                            cv.solid(circle(x, y, 1.9), pal[2], ow=1.3)
    return fx


for _style, _map, _note in (('dust', 'Outskirts road, Old Town cobbles (default)', 'grey-brown dust puff'),
                            ('splash', 'Harbor (wet planks, water edge)', 'water ripple and droplets'),
                            ('salt', 'White Plains', 'white salt puff with square crystals'),
                            ('snow', 'Observatory', 'lavender snow puff with flakes')):
    effect('vfx_step_' + _style, 'Shared', (64, 48), 6, 14, False, (0.5, 0.2), layer='ground', scale=1.0,
           when='walk: spawn at a foot on every step (walk frames 0 and half-cycle). Map: ' + _map,
           notes=_note + '; scale 0.6 for shard/cub, 1.8 for bosses')(_step(_style))


@effect('vfx_wax_drip', 'Shared', (32, 32), 6, 12, False, (0.5, 0.2), layer='ground', tintable=True,
        when='walk: wax drop falling off the creature every 0.4-0.8 s, leaves a small splat',
        notes='neutral white wax; tint (multiply) with the creature accent colour')
def fx_wax_drip(cv, i, n, rng):
    if i < 2:
        y = 8 + i * 9
        cv.solid(tear(16, y, 3.6, -PI / 2, 8), WAX, ow=1.6, dark=WAX_D, sh=1.4)
    else:
        t = (i - 2) / (n - 3)
        with cv.group(lerp(1, 0.35, t)):
            rx = lerp(6, 11, ease(t)) * (1 - 0.25 * t)
            f = smin(2.5, ellipse(16, 25, rx, rx * 0.42), circle(16 - rx * 0.8, 24, 2.2), circle(16 + rx * 0.7, 26, 1.9))
            cv.solid(f, WAX, ow=1.5, dark=WAX_D, light=WAX_L, sh=1.3)


@effect('vfx_hit_splash', 'Shared', (96, 96), 6, 20, False, (0.5, 0.5), tintable=True,
        when='hit: at the impact point when a creature takes damage (with vfx_hit_flash)',
        notes='wax shards and droplets; tint with the creature accent colour')
def fx_hit_splash(cv, i, n, rng):
    t = i / (n - 1)
    e = ease(t)
    if i < 3:                                 # wax splat that opens up
        r = (11, 17, 19)[i]
        lobes = [(5, 0.22, 0.6), (8, 0.12, 2.0), (3, 0.1, 4.0)]
        f = blob(48, 47, r, r, lobes)
        if i == 2:
            f = sub(f, circle(48, 47, 11))
        with cv.group((1, 1, 0.85)[i]):
            cv.solid(f, WAX, ow=2.2, dark=WAX_D, light=WAX_L, sh=2.4)
    with cv.group(1.0 if t < 0.65 else lerp(1, 0.3, (t - 0.65) / 0.35)):
        for k in range(10):
            a = k * TAU / 10 + rng.uniform(-0.25, 0.25)
            sp = rng.uniform(20, 40)
            x = 48 + math.cos(a) * (6 + sp * e)
            y = 46 + math.sin(a) * (6 + sp * e) + 14 * t * t
            r = rng.uniform(4.5, 7.5) * lerp(1, 0.55, t)
            if k % 2 == 0:
                chip(cv, x, y, r * 1.25, a + t * 4 * (1 if k % 4 else -1), WAX, WAX_D, ow=2.0)
            else:
                cv.solid(tear(x, y, r * 0.8, a + PI, r * 2.6 * (1 - t * 0.6)), WAX, ow=2.0, dark=WAX_D, sh=1.4)


@effect('vfx_hit_flash', 'Shared', (64, 64), 3, 30, False, (0.5, 0.5),
        when='hit: one short white impact flash at the impact point', notes='draw above the splash')
def fx_hit_flash(cv, i, n, rng):
    if i == 0:
        cv.glow(circle(32, 32, 12), WHITE, 5, 0.9)
        cv.solid(star(32, 32, 4, 29, 6, 0.3), WHITE, ow=1.6)
        cv.solid(star(32, 32, 4, 17, 5, 0.3 + PI / 4), WHITE, ow=1.6)
        cv.fill(circle(32, 32, 8), WHITE)
    elif i == 1:
        cv.solid(star(32, 32, 4, 25, 4.5, 0.3), WHITE, ow=1.6)
        cv.fill(earc(32, 32, 15, 15, 0, TAU, 4.6, n=36, taper=False), OUTL, 0.8)
        cv.fill(earc(32, 32, 15, 15, 0, TAU, 2.4, n=36, taper=False), WHITE)
    else:
        with cv.group(0.55):
            cv.fill(earc(32, 32, 22, 22, 0, TAU, 3.4, n=36, taper=False), OUTL, 0.7)
            cv.fill(earc(32, 32, 22, 22, 0, TAU, 1.6, n=36, taper=False), WHITE)


_SLASH = ((-62, -18, 7, 1.0), (-62, 62, 10, 1.0), (-20, 68, 7.5, 1.0), (25, 72, 5, 0.75), (55, 75, 3, 0.4))


@effect('vfx_attack_slash', 'Shared', (128, 128), 5, 20, False, (0.5, 0.5), scale=0.8,
        when='attack: claw swipe in front of tiger, tiger cub, alpha tiger, frenzy, crab (attack frame 2-3)',
        notes='drawn swiping toward +x (east); rotate to the attack direction, flipX for west')
def fx_attack_slash(cv, i, n, rng):
    a0, a1, w, al = _SLASH[i]
    with cv.group(al):
        for k in range(3):
            cx = -2 + k * 19
            cy = 64 + (k - 1) * 3
            d = math.radians(8 * (k - 1))
            f = earc(cx, cy, 60, 60, math.radians(a0) + d, math.radians(a1) + d, w * (1.0 if k == 1 else 0.82))
            cv.solid(f, WHITE, ow=2.0, dark=LILAC, sh=2.2)


_SWIPE = ((-75, -25, 12, 1.0), (-75, 55, 18, 1.0), (-35, 75, 13, 1.0), (15, 78, 8, 0.7), (50, 80, 4, 0.4))


@effect('vfx_attack_swipe', 'Shared', (128, 128), 5, 20, False, (0.5, 0.5), scale=1.0,
        when='attack: weapon swing arc for armed creatures (standard, primordial, healer, spore, mother tree, '
             'lens, mirror, prism, ultimate, myriad)',
        notes='drawn swinging toward +x; rotate to the attack direction; scale 1.8 for bosses')
def fx_attack_swipe(cv, i, n, rng):
    a0, a1, w, al = _SWIPE[i]
    with cv.group(al):
        cv.solid(earc(30, 64, 62, 62, math.radians(a0), math.radians(a1), w), WHITE, ow=2.2, dark=LILAC, sh=3.2)
        cv.fill(earc(30, 64, 62, 62, math.radians(a0 + 12), math.radians(a1 - 6), w * 0.28), GOLD_L)
        if i in (1, 2):
            cv.solid(earc(30, 64, 44, 44, math.radians(a0 + 20), math.radians(a1 - 20), 4), LILAC_L, ow=1.5)


@effect('vfx_attack_impact', 'Shared', (96, 96), 5, 20, False, (0.5, 0.5),
        when='attack: burst at the target (wall or squad) on the hit frame of any creature attack',
        notes='scale 0.6 for shard/cub, 1.6 for bosses')
def fx_attack_impact(cv, i, n, rng):
    t = i / (n - 1)
    if i < 3:
        ro = (22, 34, 30)[i]
        pts = []
        for k in range(16):
            r = ro * (1.0 if k % 2 == 0 else 0.45) * rng.uniform(0.8, 1.1)
            a = k * TAU / 16 + 0.2
            pts.append((48 + r * math.cos(a), 48 + r * math.sin(a)))
        with cv.group((1, 1, 0.7)[i]):
            cv.solid(poly(pts), GOLD_L if i < 2 else WHITE, ow=2.2)
            if i < 2:
                cv.fill(star(48, 48, 8, ro * 0.62, ro * 0.3, 0.2), WHITE)
    with cv.group(1.0 if t < 0.6 else lerp(1, 0.3, (t - 0.6) / 0.4)):
        for k in range(7):
            a = k * TAU / 7 + rng.uniform(-0.25, 0.25)
            sp = rng.uniform(26, 40)
            x = 48 + math.cos(a) * sp * ease(t)
            y = 48 + math.sin(a) * sp * ease(t) + 10 * t * t
            chip(cv, x, y, rng.uniform(5.5, 8.5) * lerp(1, 0.65, t), a + t * 5, STONE, STONE_D, ow=2.0)


@effect('vfx_death_melt', 'Shared', (128, 64), 8, 20, False, (0.5, 0.5), layer='ground', tintable=True,
        when='death: wax puddle that spreads then evaporates (0.4 s) under any creature, starts with the die '
             'animation', notes='neutral white wax; tint with the accent colour; scale 0.5 shard/cub, 2.0 bosses')
def fx_death_melt(cv, i, n, rng):
    t = i / (n - 1)
    s = ease(min(1.0, t / 0.45))
    fade = 0.0 if t < 0.5 else (t - 0.5) / 0.5
    lobes = [(3, 0.10, rng.uniform(0, 6)), (5, 0.07, rng.uniform(0, 6)), (7, 0.04, rng.uniform(0, 6))]
    holes = [(rng.uniform(34, 94), rng.uniform(30, 44), rng.uniform(6, 11)) for _ in range(6)]
    with cv.group(lerp(1, 0.3, fade)):
        rx, ry = 8 + 46 * s - 6 * fade, 4 + 17 * s - 2 * fade
        parts = [blob(64, 38, rx, ry, lobes)]
        if s < 1:
            parts.append(ellipse(64, 34 - 12 * (1 - s), 13 * (1 - s) + 3, 16 * (1 - s) + 2))
        parts += [circle(64 - rx * 0.95, 40, 4.5 * s), circle(64 + rx * 0.9, 35, 3.8 * s)]
        cv.solid(smin(5, *parts), WAX, ow=2.2, dark=WAX_D, light=WAX_L, sh=3)
        for hx, hy, hr in holes:
            if fade > 0:
                cv.erase(grow(circle(hx, hy, hr * fade * 1.25), 0))
    if fade > 0:
        with cv.group(lerp(0.9, 0.2, fade)):
            for k, x in enumerate((40, 64, 90)):
                puff(cv, x + 3 * math.sin(k + fade * 3), 30 - 20 * fade - 3 * k, 4.5 + 2.5 * fade, DUSTS['salt'], ow=1.3)


def _drop(kind):
    def fx(cv, i, n, rng):
        t = i / (n - 1)
        y = 50 - 30 * ease(t)
        tw = 0.7 + 0.3 * math.cos(t * TAU * 2)
        with cv.group(1.0 if t < 0.7 else lerp(1, 0.2, (t - 0.7) / 0.3)):
            if kind == 'resource':
                cv.glow(circle(24, y, 5), GOLD, 4, 0.6)
                cv.solid(star(24, y, 4, 13 * tw, 3.6, -PI / 2), GOLD, ow=1.7, light=GOLD_L, sh=1.5)
                cv.fill(circle(24, y, 2.6), WHITE)
                col = GOLD_L
            else:
                cv.glow(circle(24, y, 5), LILAC, 4, 0.6)
                r = 9.5 * (0.85 + 0.15 * tw)
                cv.solid(ngon(24, y, 6, r, PI / 6), LILAC, ow=1.7)
                cv.fill(poly([(24, y - r), (24 - r * 0.87, y - r * 0.5), (24, y), (24 + r * 0.87, y - r * 0.5)]), LILAC_L)
                cv.fill(poly([(24, y), (24 + r * 0.87, y - r * 0.5), (24 + r * 0.87, y + r * 0.5), (24, y + r)]), SPORE)
                col = LILAC_L
            for k, (dx, dy, ph) in enumerate(((-13, 8, 0.0), (13, 2, 0.35), (-8, -12, 0.6))):
                r = 4.5 * max(0.0, math.sin(PI * ((t + ph) % 1.0)))
                sparkle(cv, 24 + dx, y + dy, r, col, ow=1.2)
    return fx


effect('vfx_drop_resource', 'Shared', (48, 64), 8, 16, False, (0.5, 0.15),
       when='death: gold 4-point star rising where a creature dropped resources',
       notes='shape = star (resource)')(_drop('resource'))
effect('vfx_drop_specimen', 'Shared', (48, 64), 8, 16, False, (0.5, 0.15),
       when='death: lilac hexagon gem rising where a creature dropped a research specimen',
       notes='shape = hexagon gem (specimen), so it does not rely on colour')(_drop('specimen'))


@effect('vfx_shadow_blob', 'Shared', (128, 64), 1, 0, False, (0.5, 0.5), layer='ground',
        when='always: soft blob shadow under a unit that has no baked shadow (flying shards, pouncing boss, pods)',
        notes='scale x to the unit width; shrink while the unit is in the air')
def fx_shadow(cv, i, n, rng):
    d = np.hypot((cv.X - 64) / 56, (cv.Y - 32) / 24)
    cv.paint(np.clip(1.15 - d, 0, 1) ** 1.4 * 0.5, OUTL)


# =========================================================================== STATUS LOOPS
@effect('vfx_status_burning', 'Status', (96, 96), 8, 12, True, (0.5, 0.08),
        when='status burning (Flamethrower): loop on the creature while it burns',
        notes='flames hug the feet and the sides so the body stays visible; scale = unit cell / 128 (0.5 shard, '
              '2.0 boss). Replaces the 32 px placeholder Towers/Flamethrower/vfx_burning.png')
def fx_burning(cv, i, n, rng):
    ph = TAU * i / n
    tongues = ((13, 86, 8.5, 46, -0.5, 0.0), (83, 86, 8.5, 48, 0.5, 2.1), (30, 89, 8.5, 25, -0.2, 4.0),
               (66, 89, 8.5, 27, 0.2, 1.0), (48, 91, 9.5, 15, 0.0, 3.0))
    for cx, by, b, h, lean, off in tongues:
        hh = h * (1 + 0.16 * math.sin(ph + off))
        sw = lean + 0.55 * math.sin(ph + off * 1.7)
        cv.solid(flame(cx, by, b, hh, sw, ph + off), FIRE, ow=2.0, dark=FIRE_D, sh=2.2)
        cv.fill(flame(cx, by, b * 0.62, hh * 0.62, sw, ph + off), FIRE_L)
        cv.fill(flame(cx, by + 1, b * 0.32, hh * 0.3, sw, ph + off), FIRE_C)
    for k in range(6):
        u = (i / n + k / 6.0) % 1.0
        x = 14 + k * 14 + 4 * math.sin(u * TAU + k)
        y = 60 - 48 * u
        r = 2.4 * (1 - u) + 0.6
        cv.solid(box(x, y, r, r, 0.5), FIRE_L if k % 2 else FIRE_C, ow=1.3, outline=FIRE_D)


@effect('vfx_status_frozen', 'Status', (96, 96), 6, 8, True, (0.5, 0.08),
        when='status frozen (Cryo Tower fully freezes the lens tier and interrupts focus): loop while frozen',
        notes='ice crust at the feet plus a see-through frost sheen; also tint the unit pale blue in code')
def fx_frozen(cv, i, n, rng):
    ph = TAU * i / n
    body = blob(48, 48, 31, 38, [(4, 0.05, 0.6), (7, 0.03, 2.0)])
    with cv.group(0.24):
        cv.fill(body, ICE_B)
    with cv.group(0.6):
        cv.fill(sub(body, grow(body, -2.2)), ICE_L)
    with cv.group(0.8):
        u = i / n
        for k, off in enumerate((0.0, 0.5)):
            x = 22 + 64 * ((u + off) % 1.0)
            a = math.sin(PI * ((u + off) % 1.0))
            cv.fill(seg(x + 8, 22, x - 8, 60, 1.6 * a + 0.2), WHITE, 0.85 * a)
    spikes = ((12, 90, 8, 30, -6), (27, 92, 9, 20, -2), (84, 90, 8, 32, 6), (69, 92, 9, 21, 2),
              (48, 94, 10, 13, 0), (20, 93, 6, 13, -5), (77, 93, 6, 12, 5))
    for cx, by, w, h, lean in spikes:
        whole, facet = shard(cx, by, w, h, lean)
        cv.solid(whole, ICE, ow=2.0, dark=ICE_D, sh=2.4)
        cv.fill(facet, ICE_L)
    for k, (x, y, off) in enumerate(((16, 52, 0.0), (80, 46, 2.1), (60, 18, 4.2))):
        sparkle(cv, x, y, 6.5 * max(0, math.sin(ph + off)), WHITE, edge=ICE_D, ow=1.3)


@effect('vfx_status_frozen_break', 'Status', (96, 96), 6, 20, False, (0.5, 0.08),
        when='status frozen ends: ice crust shatters', notes='one shot, then remove vfx_status_frozen')
def fx_frozen_break(cv, i, n, rng):
    t = i / (n - 1)
    with cv.group(1.0 if t < 0.6 else lerp(1, 0.25, (t - 0.6) / 0.4)):
        for k in range(10):
            a = -PI + k * PI / 9 + rng.uniform(-0.15, 0.15)
            sp = rng.uniform(20, 38)
            x = 48 + math.cos(a) * (26 + sp * ease(t))
            y = 84 + math.sin(a) * (10 + sp * ease(t)) + 30 * t * t
            r = rng.uniform(5, 8) * lerp(1, 0.6, t)
            chip(cv, x, y, r, a + t * 5, ICE, ICE_D)
            cv.fill(circle(x - r * 0.25, y - r * 0.25, r * 0.28), ICE_L)
        if i < 2:
            sparkle(cv, 48, 50, 16 - 6 * i, WHITE, edge=ICE_D)


@effect('vfx_status_solvent', 'Status', (96, 96), 8, 10, True, (0.5, 0.08),
        when='status solvent (Solvent Sprayer puddle, Hunter weapons): loop while the creature is dissolving '
             '(cannot heal, armour melts)', notes='acid drips running down the body and bubbles at the feet')
def fx_solvent(cv, i, n, rng):
    u = i / n
    f = smin(4, ellipse(48, 88, 30, 5.5), circle(22, 87, 4.5), circle(75, 89, 4))
    cv.solid(f, ACID, ow=2.0, dark=ACID_D, light=ACID_L, sh=2)
    for k, (x, off, top) in enumerate(((20, 0.0, 34), (36, 0.55, 22), (61, 0.3, 26), (77, 0.8, 38))):
        v = (u + off) % 1.0
        y = top + (82 - top) * v
        ln = 9 + 9 * math.sin(PI * v)
        with cv.group(1.0 if v < 0.8 else lerp(1, 0.3, (v - 0.8) / 0.2)):
            cv.solid(seg(x, y - ln, x, y, 1.5, 3.8), ACID, ow=1.8, dark=ACID_D, sh=1.4)
            cv.fill(circle(x - 1, y - 1, 1.3), ACID_L)
    for k, (x, off) in enumerate(((30, 0.1), (48, 0.45), (64, 0.75))):
        v = (u + off) % 1.0
        if v < 0.75:
            r = 2 + 4.5 * v
            y = 84 - 10 * v
            cv.fill(circle(x, y, r + 1.6), OUTL)
            cv.fill(circle(x, y, r), ACID_L)
            cv.fill(circle(x + 0.6, y + 0.6, r * 0.62), ACID)
        else:
            for a in (-2.4, -1.57, -0.7):
                cv.solid(circle(x + 8 * math.cos(a), 78 + 8 * math.sin(a), 1.3), ACID_L, ow=1.2)


@effect('vfx_status_netted', 'Status', (96, 96), 4, 6, True, (0.5, 0.08),
        when='status netted (Net Launcher): loop while the creature is tied down (bosses and the ultimate tier '
             'are only slowed: use vfx_status_slowed for them)',
        notes='see-through rope dome with weights; matches Towers/NetLauncher/vfx_net_trap')
def fx_netted(cv, i, n, rng):
    j = (0.0, 1.0, 0.0, -1.0)[i]
    cx, by, rx, ry, H = 48 + j * 0.8, 84, 39 + j * 1.2, 9, 70 - j * 1.5
    lines = []
    for k in range(10):
        ph = k * TAU / 10 + 0.31
        pts = []
        for s in np.linspace(0, PI / 2, 8):
            pts.append((cx + rx * math.cos(ph) * math.cos(s), by - H * math.sin(s) + ry * math.sin(ph) * math.cos(s)))
        lines.append(pts)
    for s in (0.0, 0.42, 0.85, 1.2):
        r = math.cos(s)
        lines.append([(cx + rx * r * math.cos(a), by - H * math.sin(s) + ry * r * math.sin(a))
                      for a in np.linspace(0, TAU, 25)])
    net = union(*[polyline(p, 0.9) for p in lines])
    cv.fill(grow(net, 1.5), OUTL, 0.9)
    cv.fill(net, ROPE)
    for k in range(10):
        ph = k * TAU / 10 + 0.31
        x, y = cx + rx * math.cos(ph), by + ry * math.sin(ph)
        cv.solid(circle(x, y, 2.6), STONE, ow=1.5, light=STONE_L, sh=1)
    cv.solid(circle(cx, by - H, 2.8), ROPE, ow=1.5, dark=ROPE_D, sh=1)


def _snowflake(cx, cy, r, rot):
    fs = []
    for k in range(3):
        a = rot + k * PI / 3
        fs.append(seg(cx - r * math.cos(a), cy - r * math.sin(a), cx + r * math.cos(a), cy + r * math.sin(a), 0.9))
    for k in range(6):
        a = rot + k * PI / 3
        px, py = cx + r * 0.6 * math.cos(a), cy + r * 0.6 * math.sin(a)
        for d in (-0.8, 0.8):
            fs.append(seg(px, py, px + r * 0.38 * math.cos(a + d), py + r * 0.38 * math.sin(a + d), 0.7))
    return union(*fs)


@effect('vfx_status_slowed', 'Status', (96, 64), 8, 10, True, (0.5, 0.42), layer='ground',
        when='status slowed (Cryo Tower aura; Net Launcher on bosses and the ultimate tier): loop at the feet',
        notes='frost ring with dragging chevrons and snowflakes; drawn under the unit')
def fx_slowed(cv, i, n, rng):
    u = i / n
    cx, cy, rx, ry = 48, 37, 40, 17
    cv.fill(ellipse(cx, cy, rx, ry), ICE_B, 0.16)
    for k in range(6):
        a0 = k * TAU / 6 + u * TAU / 6
        cv.fill(earc(cx, cy, rx, ry, a0, a0 + 0.72, 6.6, n=10, taper=False), OUTL, 0.85)
    for k in range(6):
        a0 = k * TAU / 6 + u * TAU / 6
        cv.fill(earc(cx, cy, rx, ry, a0 + 0.04, a0 + 0.68, 3.4, n=10, taper=False), ICE_L)
    for k in range(3):
        a = k * TAU / 3 - u * TAU / 3 + 0.5
        x, y = cx + rx * math.cos(a), cy + ry * math.sin(a) - 4
        f = _snowflake(x, y, 7.5, u * PI / 3)
        cv.fill(grow(f, 1.5), OUTL)
        cv.fill(f, WHITE)
    for k in range(3):                      # chevrons dragging behind = "held back"
        v = (u + k / 3.0) % 1.0
        y = cy - 8 + 16 * v
        with cv.group(math.sin(PI * v)):
            f = union(seg(cx - 9, y - 4, cx, y, 1.3), seg(cx + 9, y - 4, cx, y, 1.3))
            cv.fill(grow(f, 1.4), OUTL)
            cv.fill(f, ICE)


@effect('vfx_status_tar', 'Status', (96, 64), 8, 8, True, (0.5, 0.42), layer='ground',
        when='status tar-stuck (Warden tar trap): loop at the feet while the creature is stuck',
        notes='dark tar puddle with stretching strands; drawn under the unit, strands overlap the feet')
def fx_tar(cv, i, n, rng):
    ph = TAU * i / n
    lobes = [(3, 0.09, 1.0 + 0.3 * math.sin(ph)), (5, 0.06, 2.0), (8, 0.03, ph)]
    parts = [blob(48, 44, 40, 13, lobes)]
    for k, (x, off, hmax) in enumerate(((24, 0.0, 22), (48, 2.1, 30), (71, 4.2, 20))):
        h = hmax * (0.55 + 0.45 * math.sin(ph + off))
        parts.append(seg(x, 44, x + 2 * math.sin(ph + off), 44 - h, 5.5, 1.6))
        parts.append(circle(x + 2 * math.sin(ph + off), 44 - h, 2.8))
    f = smin(5, *parts)
    cv.fill(grow(f, 2.2), TAR_L)
    cv.fill(grow(f, 0.9), OUTL)
    cv.solid(f, TAR, ow=0, light=TAR_M, sh=2.4)
    for k, (x, y, off) in enumerate(((34, 47, 0.2), (60, 49, 0.7), (16, 45, 0.45), (82, 45, 0.9))):
        v = (i / n + off) % 1.0
        r = 1.2 + 3.2 * v
        if v < 0.8:
            cv.fill(circle(x, y, r), TAR_L)
            cv.fill(circle(x + 0.5, y + 0.5, r * 0.6), TAR)
    cv.fill(seg(30, 39, 44, 37, 1.0), TAR_L, 0.9)
    cv.fill(seg(56, 38, 64, 39, 0.9), TAR_L, 0.9)


# =========================================================================== STATUS ICONS
ICON_NAMES = ['burning', 'frozen', 'solvent', 'netted', 'slowed', 'tar', 'haste', 'regen']
RIM = C('f4eee0')


def _plate(cv, f, col):
    cv.fill(grow(f, 3.0), OUTL)
    cv.fill(grow(f, 1.6), RIM)
    cv.fill(f, OUTL)
    cv.fill(sub(f, grow(f, -1.6)), col)


@effect('vfx_status_icons', 'Status', (40, 40), 8, 0, False, (0.5, 0.0), layer='icon', ss=4,
        when='status: badge above the head of a creature for each active status (GDD 8.5: never colour alone). '
             'Frame index = ' + ', '.join('%d %s' % (k, v) for k, v in enumerate(ICON_NAMES)),
        notes='not an animation: pick one frame per status. Each badge has its own plate SHAPE: burning circle, '
              'frozen hexagon, solvent droplet, netted square, slowed diamond, tar light shield, haste up-arrow, '
              'regen cross. Place side by side 4 px above the health bar; keep at scale 1 (40 px) for all units')
def fx_icons(cv, i, n, rng):
    c = 20
    if i == 0:      # burning: circle + flame
        _plate(cv, circle(c, c, 14.5), FIRE)
        cv.fill(flame(c, 28.5, 5.6, 17, 0.5, 0.4), FIRE)
        cv.fill(flame(c, 28.5, 3.3, 10, 0.4, 0.4), FIRE_L)
        cv.fill(flame(c, 28.8, 1.6, 5, 0.3, 0.4), FIRE_C)
    elif i == 1:    # frozen: hexagon + snowflake
        _plate(cv, ngon(c, c, 6, 16, PI / 6), ICE_B)
        cv.fill(grow(_snowflake(c, c, 9.5, PI / 6), 0.5), ICE_L)
    elif i == 2:    # solvent: droplet + bubbles
        f = smin(3, circle(c, 23.5, 11.5), poly([(c, 2.5), (c - 8.5, 17), (c + 8.5, 17)]))
        _plate(cv, f, ACID)
        cv.fill(sub(circle(c - 2.5, 25.5, 4.6), circle(c - 2.5, 25.5, 2.6)), ACID)
        cv.fill(sub(circle(c + 4.6, 20, 3.0), circle(c + 4.6, 20, 1.5)), ACID_L)
        cv.fill(circle(c, 14, 1.5), ACID_L)
    elif i == 3:    # netted: square + net grid
        f = box(c, c, 14, 14, 3.5)
        _plate(cv, f, ROPE)
        g = union(*[seg(c + o - 10, c - 10, c + o + 10, c + 10, 0.85) for o in (-10, 0, 10)],
                  *[seg(c + o + 10, c - 10, c + o - 10, c + 10, 0.85) for o in (-10, 0, 10)])
        cv.fill(inter(g, grow(f, -3.0)), ROPE)
    elif i == 4:    # slowed: diamond + hourglass
        _plate(cv, ngon(c, c, 4, 17.5, 0), ICE)
        cv.fill(poly([(c - 6, c - 8), (c + 6, c - 8), (c, c)]), ICE_L)
        cv.fill(poly([(c - 6, c + 8), (c + 6, c + 8), (c, c)]), ICE_L)
        cv.fill(union(seg(c - 7, c - 8.5, c + 7, c - 8.5, 1.1), seg(c - 7, c + 8.5, c + 7, c + 8.5, 1.1)), WHITE)
    elif i == 5:    # tar: light shield + dark dripping blob
        f = smin(2, box(c, 17, 13.5, 12, 4), poly([(c - 12, 24), (c + 12, 24), (c, 37)]))
        cv.fill(grow(f, 3.0), OUTL)
        cv.fill(grow(f, 1.6), TAR_L)
        cv.fill(f, C('efe6d2'))
        g = smin(2.5, ellipse(c, 14, 9.5, 5.5), seg(c - 5, 15, c - 5, 24, 2.4, 1.8), seg(c + 1, 15, c + 1, 30, 2.6, 2.0),
                 seg(c + 6.5, 15, c + 6.5, 21, 2.2, 1.6))
        cv.fill(g, TAR)
        cv.fill(seg(c - 4, 12, c + 2, 11.4, 0.8), TAR_L)
    elif i == 6:    # haste: up arrow + double chevron
        f = poly([(c, 2.5), (36, 18), (31, 36), (9, 36), (4, 18)])
        _plate(cv, f, HOWL)
        for y in (19, 28):
            cv.fill(union(seg(c - 7, y, c, y - 7, 1.7), seg(c + 7, y, c, y - 7, 1.7)), HOWL_L)
    else:           # regen: cross + plus
        f = plus(c, c, 16, 8.5)
        _plate(cv, f, HEAL)
        cv.fill(plus(c, c, 9, 2.6), HEAL_L)


# =========================================================================== CREATURE SKILLS
@effect('vfx_heal_ring', 'Skills', (256, 192), 8, 10, True, (0.5, 0.5), layer='ground', used_by='healer',
        when='healer (tier 3) heal: green zone on the ground while it stands still and heals; radius = heal radius',
        notes='ellipse 236x172 px in the cell; scale so the ring matches the heal radius (y squash 0.72)')
def fx_heal_ring(cv, i, n, rng):
    u = i / n
    cx, cy, rx, ry = 128, 96, 118, 85
    pulse = 0.5 + 0.5 * math.sin(u * TAU)
    cv.fill(ellipse(cx, cy, rx, ry), HEAL, 0.13 + 0.05 * pulse)
    ground_ring(cv, cx, cy, rx, ry, HEAL, HEAL_D, w=4.0, light=HEAL_L)
    k2 = 0.62 + 0.3 * u
    with cv.group(1 - u):
        cv.fill(earc(cx, cy, rx * k2, ry * k2, 0, TAU, 2.6, n=48, taper=False), HEAL_L)
    for k in range(8):                       # leaves riding the ring
        a = k * TAU / 8 + u * TAU / 8
        x, y = cx + rx * math.cos(a), cy + ry * math.sin(a)
        tx, ty = -math.sin(a) * rx, math.cos(a) * ry
        tl = math.hypot(tx, ty)
        tx, ty = tx / tl, ty / tl
        leaf = inter(circle(x - ty * 5, y + tx * 5, 10.5), circle(x + ty * 5, y - tx * 5, 10.5))
        cv.solid(leaf, HEAL_L, ow=1.8, outline=HEAL_D, dark=HEAL, sh=1.6)
    for k, (dx, dy, off) in enumerate(((-58, 10, 0.0), (44, 30, 0.3), (0, -30, 0.6), (70, -18, 0.8), (-30, 44, 0.45))):
        v = (u + off) % 1.0
        with cv.group(math.sin(PI * v) * 0.95):
            cv.solid(plus(cx + dx, cy + dy - 22 * v, 6.5, 2.2), HEAL_L, ow=1.6, outline=HEAL_D)


@effect('vfx_heal_sparkle', 'Skills', (48, 64), 8, 12, True, (0.5, 0.1), used_by='healer, mother_tree, any healed ally',
        when='heal received: loop on every creature that is being healed by a healer or by the mother tree roots',
        notes='green plus signs rising; pair with the regen badge (vfx_status_icons frame 7)')
def fx_heal_sparkle(cv, i, n, rng):
    u = i / n
    for k, (x, off, r) in enumerate(((12, 0.0, 6.5), (35, 0.4, 5.5), (24, 0.7, 7.5))):
        v = (u + off) % 1.0
        y = 56 - 46 * v
        with cv.group(min(1.0, math.sin(PI * v) * 1.5)):
            cv.solid(plus(x + 2 * math.sin(v * 5 + k), y, r, r * 0.34), HEAL_L, ow=1.8, outline=HEAL_D, dark=HEAL, sh=1.2)


@effect('vfx_lens_charge_bar', 'Skills', (96, 24), 21, 4, False, (0.5, 0.0), layer='icon', used_by='lens, prism',
        when='lens (tier 4) focus: bar above the head filling over 5 s while it stands next to a tower; '
             'frame = round(progress * 20); frame 20 = full (tower destroyed)',
        notes='5 segments = 5 seconds; high visual priority (GDD 8.3). Reset to frame 0 when the Cryo Tower '
              'freezes the creature')
def fx_charge_bar(cv, i, n, rng):
    p = i / (n - 1)
    body = box(54, 12, 38, 7, 7)
    if i == n - 1:
        cv.glow(body, TELE, 3, 0.9)
    cv.fill(grow(body, 2.6), OUTL)
    cv.fill(grow(body, 1.3), RIM)
    cv.fill(body, C('3a2f55'))
    x1 = 18 + 72 * p
    if p > 0:
        bar = inter(grow(body, -1.6), box((18 + x1) / 2, 12, (x1 - 18) / 2, 10))
        cv.fill(bar, AMBER if i < n - 1 else WHITE)
        cv.fill(inter(bar, box(54, 9.2, 40, 1.6)), TELE)
        if i < n - 1:
            cv.fill(inter(grow(body, -1.6), box(x1 - 1.5, 12, 1.5, 10)), WHITE)
    for k in range(1, 5):
        cv.fill(inter(grow(body, -1.2), box(18 + 72 * k / 5.0, 12, 0.7, 10)), OUTL, 0.75)
    # sun glyph on the left end
    cv.fill(star(12, 12, 8, 11.5, 7.5, 0), OUTL)
    cv.fill(star(12, 12, 8, 9.6, 6.2, 0), AMBER if i < n - 1 else WHITE)
    cv.fill(circle(12, 12, 4.6), TELE)


def _beam(cv, i, n, h, cols, core, period=64):
    """Horizontal tileable beam: dark edge, colour bands, white core, moving pulses."""
    cy = h / 2.0
    shift = i / n * period
    x = cv.X
    wob = 1.0 + 0.22 * np.sin((x - shift) * TAU / period) + 0.10 * np.sin((x + shift) * 2 * TAU / period)
    d = np.abs(cv.Y - cy)
    half = h * 0.30 * wob
    cv.paint(cv.cov(d - half - 2.0), OUTL)
    m = len(cols)
    for k, col in enumerate(cols):
        cv.paint(cv.cov(d - half * (1 - k / m)), col)
    cv.paint(cv.cov(d - half * core), WHITE)


@effect('vfx_lens_beam', 'Skills', (128, 32), 6, 12, True, (0.0, 0.5), used_by='lens',
        when='lens (tier 4) focus: light beam from the lens on its back to the tower it is destroying',
        notes='tileable along x and seamless as a loop: anchor at the lens, rotate toward the tower and stretch or '
              'repeat x to the distance. Amber edge so it reads on the white salt flat')
def fx_lens_beam(cv, i, n, rng):
    _beam(cv, i, n, 32, [AMBER_D, AMBER, TELE], 0.3)


@effect('vfx_lens_beam_hit', 'Skills', (64, 64), 6, 12, True, (0.5, 0.5), used_by='lens, prism',
        when='lens focus / prism focus: hot spot on the tower at the end of the beam',
        notes='spinning sun rays; scale up with charge (0.7 -> 1.2)')
def fx_lens_beam_hit(cv, i, n, rng):
    u = i / n
    pulse = 1 + 0.12 * math.sin(u * TAU)
    cv.glow(circle(32, 32, 10), AMBER, 5, 0.7)
    cv.solid(star(32, 32, 8, 27 * pulse, 10, u * TAU / 8), AMBER, ow=2.0)
    cv.fill(star(32, 32, 8, 18 * pulse, 8, -u * TAU / 8 + 0.4), TELE)
    cv.fill(circle(32, 32, 7.5), WHITE)


def _wave(cv, cx, cy, rx, ry, w, col, light, arcs, gap, rot, jag=0.0, n=14):
    span = TAU / arcs - gap
    for k in range(arcs):
        a0 = rot + k * TAU / arcs
        cv.fill(earc(cx, cy, rx, ry, a0, a0 + span, w + 4.4, n=n, jag=jag), OUTL)
    for k in range(arcs):
        a0 = rot + k * TAU / arcs
        cv.fill(earc(cx, cy, rx, ry, a0, a0 + span, w, n=n, jag=jag), col)
        if light is not None:
            cv.fill(earc(cx, cy, rx, ry, a0 + span * 0.15, a0 + span * 0.85, w * 0.35, n=n, jag=jag), light)


@effect('vfx_frenzy_howl', 'Skills', (256, 192), 8, 16, False, (0.5, 0.5), layer='ground', used_by='frenzy',
        when='frenzy howl: sound-wave rings expanding from the creature when it speeds up nearby creatures '
             '(howl frame 2); scale to the buff radius', notes='crimson broken rings; buffed allies get the haste '
             'badge (vfx_status_icons frame 6)')
def fx_howl(cv, i, n, rng):
    t = i / (n - 1)
    for k in range(3):
        v = t * 1.25 - k * 0.2
        if v <= 0 or v >= 1:
            continue
        s = 0.2 + 0.8 * ease(v)
        with cv.group(1.0 if v < 0.55 else lerp(1, 0.0, (v - 0.55) / 0.45)):
            _wave(cv, 128, 96, 118 * s, 85 * s, lerp(11, 4, v), HOWL, HOWL_L, 4, 0.5, 0.25 + k * 0.4)


@effect('vfx_ultimate_regen', 'Skills', (128, 128), 8, 12, False, (0.5, 0.1), used_by='ultimate, myriad',
        when='ultimate (tier 5) self-heal tick: pulse rising around the body every time it regenerates',
        notes='one shot per tick; do not play while burning or under solvent (healing is blocked)')
def fx_regen(cv, i, n, rng):
    t = i / (n - 1)
    y = 108 - 74 * ease(t)
    rx = 52 - 12 * t
    with cv.group(1.0 if t < 0.6 else lerp(1, 0.15, (t - 0.6) / 0.4)):
        with cv.group(0.55):                  # back half of the ring, behind the body
            cv.fill(earc(64, y, rx, rx * 0.32, PI + 0.1, TAU - 0.1, 8, n=20), HEAL_D)
            cv.fill(earc(64, y, rx, rx * 0.32, PI + 0.14, TAU - 0.14, 4, n=20), HEAL)
        cv.fill(earc(64, y, rx, rx * 0.32, 0.02, PI - 0.02, 13, n=20), OUTL)
        cv.fill(earc(64, y, rx, rx * 0.32, 0.06, PI - 0.06, 9, n=20), HEAL)
        cv.fill(earc(64, y, rx, rx * 0.32, 0.4, PI - 0.4, 3, n=20), HEAL_L)
        for k in range(7):
            a = k * TAU / 7 + 0.3
            r0 = rng.uniform(46, 58)
            r = r0 * (1 - 0.45 * ease(t))
            x, yy = 64 + math.cos(a) * r, 80 + math.sin(a) * r * 0.5 - 30 * t
            if k % 2:
                cv.solid(plus(x, yy, 8, 2.8), HEAL_L, ow=2.0, outline=HEAL_D, dark=HEAL, sh=1.4)
            else:
                cv.solid(tear(x, yy, 4.6, PI / 2, 11), WAX, ow=2.0, dark=WAX_D, sh=1.5)


@effect('vfx_spore_burst', 'Skills', (128, 128), 7, 18, False, (0.5, 0.5), used_by='spore',
        when='spore death: purple spore cloud and 3 wax chunks flying out where the 3 shards will spawn '
             '(skip it when the spore dies burning or under solvent: it does not split)',
        notes='chunks fly to 150, 30 and 270 degrees; spawn the shards at those offsets (about 40 px)')
def fx_spore_burst(cv, i, n, rng):
    t = i / (n - 1)
    e = ease(t)
    pal = (SPORE, SPORE_D, SPORE_L)
    with cv.group(1.0 if t < 0.5 else lerp(1, 0.15, (t - 0.5) / 0.5)):
        for k in range(6):
            a = k * TAU / 6 + 0.5
            r = (9 + 9 * e) * (1.0 if k % 2 else 0.8)
            puff(cv, 64 + math.cos(a) * 30 * e, 64 + math.sin(a) * 24 * e - 6 * t, r, pal, ow=1.8)
        for k in range(9):
            a = k * TAU / 9 + rng.uniform(-0.2, 0.2)
            sp = rng.uniform(34, 52)
            cv.solid(circle(64 + math.cos(a) * sp * e, 64 + math.sin(a) * sp * e, 2.3), SPORE_L, ow=1.4)
    for k, deg in enumerate((150, 30, 270)):
        a = math.radians(deg)
        d = 42 * e
        x, y = 64 + math.cos(a) * d, 64 - math.sin(a) * d - 18 * math.sin(PI * t)
        chip(cv, x, y, 8.5, a + t * 6, WAX, WAX_D, ow=2.0)
        cv.fill(circle(x - 2, y - 2, 2.0), WAX_L)
    if i == 0:
        sparkle(cv, 64, 64, 22, WHITE, edge=SPORE_D, ow=1.8)


@effect('vfx_crab_shell_soften', 'Skills', (96, 96), 8, 10, True, (0.5, 0.08), used_by='crab, mother_tree (bark)',
        when='crab under solvent: shell flakes sliding off while its front armour is melted (optional overlay on '
             'top of vfx_status_solvent)', notes='coral flakes; for the mother tree bark tint the flakes brown')
def fx_shell_soften(cv, i, n, rng):
    u = i / n
    for k, (x, off, top) in enumerate(((22, 0.0, 30), (44, 0.35, 20), (66, 0.7, 26), (80, 0.5, 40))):
        v = (u + off) % 1.0
        y = top + 50 * v * v
        with cv.group(1.0 if v < 0.7 else lerp(1, 0.2, (v - 0.7) / 0.3)):
            r = 11 - 3 * v
            pts = [(x + r * f * math.cos(a + v * 2 + k), y + r * f * 0.8 * math.sin(a + v * 2 + k))
                   for a, f in ((0, 1.0), (1.3, 0.8), (2.5, 1.0), (3.9, 0.85), (5.2, 0.9))]
            cv.solid(poly(pts), PINK, ow=2.0, dark=PINK_D, light=PINK_L, sh=2.2)
            cv.solid(seg(x + 5, y + 5, x + 5, y + 14 + 5 * v, 1.6, 3.4), ACID, ow=1.8, dark=ACID_D, sh=1.2)
    for k, (x, off) in enumerate(((34, 0.2), (56, 0.6))):
        v = (u + off) % 1.0
        with cv.group(1 - v):
            puff(cv, x + 3 * math.sin(v * 4), 34 - 22 * v, 4 + 3 * v, (ACID_L, ACID, WHITE), ow=1.4)


@effect('vfx_mirror_reflect', 'Skills', (64, 64), 5, 24, False, (0.5, 0.5), used_by='mirror, prism',
        when='mirror reflect: spark on the salt-crystal skin when it bounces a single-target shot back '
             '(Machine Gun, Sniper, Hunter); also the prism boss mirror skin',
        notes='the streak leaves toward +x: rotate toward the tower that fired')
def fx_mirror_reflect(cv, i, n, rng):
    t = i / (n - 1)
    r = (20, 26, 20, 12, 6)[i]
    with cv.group(1.0 if i < 3 else 0.7):
        if i >= 1:
            x0 = 30 + 6 * i
            cv.solid(seg(x0, 32, min(62, x0 + 22), 32, 0.6, 2.4 - 0.4 * i), WHITE, ow=1.6, outline=SPORE_D)
        cv.solid(star(26, 32, 4, r, r * 0.2, -PI / 2), WHITE, ow=1.8, outline=SPORE_D)
        cv.solid(star(26, 32, 4, r * 0.55, r * 0.16, -PI / 4), LILAC_L, ow=1.2, outline=SPORE_D)
        cv.fill(circle(26, 32, max(1.5, r * 0.2)), WHITE)


# =========================================================================== BOSSES
def _crack_lines(rng, cx, cy, count, length, branch=True):
    lines = []
    for k in range(count):
        a = k * TAU / count + rng.uniform(-0.3, 0.3)
        x, y = cx + math.cos(a) * 6, cy + math.sin(a) * 6
        pts = [(x, y)]
        L = length * rng.uniform(0.65, 1.0)
        steps = 5
        for s in range(steps):
            a2 = a + rng.uniform(-0.7, 0.7)
            x, y = x + math.cos(a2) * L / steps, y + math.sin(a2) * L / steps
            pts.append((x, y))
            if branch and s == 2:
                a3 = a + rng.choice([-1, 1]) * rng.uniform(0.7, 1.1)
                lines.append([(x, y), (x + math.cos(a3) * L * 0.3, y + math.sin(a3) * L * 0.3)])
        lines.append(pts)
    return lines


@effect('vfx_primordial_crack_glow', 'Boss', (256, 256), 8, 10, True, (0.5, 0.5), blend='additive',
        used_by='primordial',
        when='boss 1 Shed warning (66% and 33% HP): cracks on the body glow pale white-yellow for 3 s before '
             'the wax plates fall off', notes='centre on the chest (about 110 px above the feet); pulse gets '
             'faster in code (fps 10 -> 20). Additive, but also fine with normal alpha')
def fx_crack_glow(cv, i, n, rng):
    ph = TAU * i / n
    pulse = 0.65 + 0.35 * math.sin(ph)
    lines = _crack_lines(rng, 128, 128, 6, 80)
    fs = [union(*[seg(p[k][0], p[k][1], p[k + 1][0], p[k + 1][1], lerp(1.9, 0.6, k / max(1, len(p) - 1)),
                      lerp(1.9, 0.6, (k + 1) / max(1, len(p) - 1))) for k in range(len(p) - 1)]) for p in lines]
    f = union(*fs)
    cv.glow(grow(f, 2), TELE, 5, 0.55 * pulse)
    cv.glow(grow(f, 1), AMBER, 3, 0.6 * pulse)
    cv.fill(grow(f, 0.8), TELE, 0.75 + 0.25 * pulse)
    cv.fill(f, WHITE, pulse)


@effect('vfx_primordial_shed_burst', 'Boss', (256, 256), 8, 16, False, (0.5, 0.5), used_by='primordial',
        when='boss 1 Shed: wax plates blast off the body and become 8-10 shards around the boss',
        notes='spawn the shards as the plates land (frame 5)')
def fx_shed_burst(cv, i, n, rng):
    t = i / (n - 1)
    e = ease(t)
    if i < 2:
        cv.glow(circle(128, 128, 30 + 20 * i), TELE, 14, 0.9 - 0.4 * i)
    with cv.group(1.0 if t < 0.5 else lerp(1, 0.0, (t - 0.5) / 0.5)):
        _wave(cv, 128, 150, 30 + 86 * e, 20 + 52 * e, lerp(9, 3, t), TELE, WHITE, 6, 0.25, 0.3, n=10)
    with cv.group(1.0 if t < 0.75 else lerp(1, 0.35, (t - 0.75) / 0.25)):
        for k in range(10):
            a = k * TAU / 10 + rng.uniform(-0.2, 0.2)
            sp = rng.uniform(66, 100)
            x = 128 + math.cos(a) * sp * e
            y = 122 + math.sin(a) * sp * 0.75 * e - 40 * math.sin(PI * t) * 0.6 + 26 * t * t
            r = rng.uniform(11, 17) * lerp(1, 0.8, t)
            rot = a + t * 5 * (1 if k % 2 else -1)
            pts = [(x + r * f * math.cos(rot + b), y + r * f * math.sin(rot + b))
                   for b, f in ((0, 1.0), (1.2, 0.85), (2.4, 1.0), (3.5, 0.7), (4.8, 0.95))]
            cv.solid(poly(pts), BUTTER, ow=2.4, dark=BUTTER_D, light=BUTTER_L, sh=3)
        for k in range(8):
            a = k * TAU / 8 + 0.4
            sp = rng.uniform(40, 110)
            x, y = 128 + math.cos(a) * sp * e, 128 + math.sin(a) * sp * 0.7 * e + 20 * t * t
            cv.solid(tear(x, y, 4 * lerp(1, 0.6, t), a + PI, 10 * (1 - t)), BUTTER_L, ow=1.8, dark=BUTTER, sh=1.4)


@effect('vfx_tiger_pounce_line', 'Boss', (128, 32), 4, 12, True, (0.0, 0.5), layer='ground', used_by='alpha_tiger',
        when='boss 2 Pounce warning (2 s crouch): red chevron line on the lane from the boss to the landing point',
        notes='tileable along x and seamless as a loop: rotate toward the landing point and repeat x to the '
              'distance. Follows the lane; end it with vfx_tiger_pounce_marker')
def fx_pounce_line(cv, i, n, rng):
    sh = i / n * 32
    for pas in range(3):
        for k in range(-1, 5):
            x = k * 32 + sh + 8
            f = union(seg(x, 5, x + 11, 16, 2.6), seg(x, 27, x + 11, 16, 2.6))
            if pas == 0:
                cv.fill(grow(f, 3.2), OUTL)
            elif pas == 1:
                cv.fill(grow(f, 1.4), DANGER_L)
            else:
                cv.fill(f, DANGER)


@effect('vfx_tiger_pounce_marker', 'Boss', (192, 144), 8, 12, True, (0.5, 0.5), layer='ground', used_by='alpha_tiger',
        when='boss 2 Pounce warning: landing marker on the lane for the 2 s crouch (blink faster near the end)',
        notes='supersedes the 128x64 placeholder Wax/AlphaTiger/vfx_pounce_target.png; red target with a paw print')
def fx_pounce_marker(cv, i, n, rng):
    u = i / n
    pulse = 0.5 + 0.5 * math.sin(u * TAU)
    cx, cy, rx, ry = 96, 72, 84, 60
    cv.fill(ellipse(cx, cy, rx, ry), DANGER, 0.16 + 0.14 * pulse)
    for pas in range(2):
        for k in range(8):
            a0 = k * TAU / 8 + u * TAU / 8
            cv.fill(earc(cx, cy, rx, ry, a0, a0 + 0.52, 11 if pas == 0 else 6, n=8, taper=False),
                    OUTL if pas == 0 else DANGER)
    for k in range(8):
        a0 = k * TAU / 8 + u * TAU / 8
        cv.fill(earc(cx, cy, rx, ry, a0 + 0.06, a0 + 0.46, 1.8, n=8, taper=False), DANGER_L)
    s = 0.84 - 0.1 * pulse
    for k in range(4):                       # arrows pointing in
        a = k * PI / 2 + PI / 4
        px, py = cx + rx * s * math.cos(a), cy + ry * s * math.sin(a)
        qx, qy = cx + rx * (s - 0.26) * math.cos(a), cy + ry * (s - 0.26) * math.sin(a)
        nx, ny = -math.sin(a) * 11, math.cos(a) * 8
        cv.solid(poly([(px + nx, py + ny), (px - nx, py - ny), (qx, qy)]), DANGER, ow=2.2, light=DANGER_L, sh=1.6)
    paw = union(ellipse(cx, cy + 8, 15, 10.5), *[ellipse(cx + dx, cy + dy, 5.6, 5.0)
                                                 for dx, dy in ((-17, -5), (-6, -12), (6, -12), (17, -5))])
    cv.solid(paw, TELE if pulse > 0.5 else DANGER_L, ow=2.4)


@effect('vfx_tiger_land_dust', 'Boss', (256, 192), 8, 16, False, (0.5, 0.5), layer='ground', used_by='alpha_tiger',
        when='boss 2 Pounce landing: dust ring and cracks where the boss lands',
        notes='also usable for the primordial heavy step at scale 0.6')
def fx_land_dust(cv, i, n, rng):
    t = i / (n - 1)
    e = ease(t)
    pal = DUSTS['dust']
    if t < 0.7:
        with cv.group(1.0 if t < 0.35 else lerp(1, 0, (t - 0.35) / 0.35)):
            for p in _crack_lines(rng, 128, 100, 8, 60, branch=False):
                q = [(x, 100 + (y - 100) * 0.7) for x, y in p]
                cv.fill(polyline(q, 2.0), OUTL)
    with cv.group(1.0 if t < 0.5 else lerp(1, 0.1, (t - 0.5) / 0.5)):
        order = sorted(range(16), key=lambda k: math.sin(k * TAU / 16))
        for k in order:
            a = k * TAU / 16 + rng.uniform(-0.1, 0.1)
            d = 0.25 + 0.75 * e
            x, y = 128 + math.cos(a) * 104 * d, 100 + math.sin(a) * 64 * d - 10 * e
            r = rng.uniform(11, 16) * (0.6 + 0.6 * math.sin(PI * min(1, t * 1.3 + 0.15)))
            puff(cv, x, y, r, pal, ow=2.0)
        for k in range(8):
            a = k * TAU / 8 + 0.3
            sp = rng.uniform(60, 110)
            x = 128 + math.cos(a) * sp * e
            y = 96 + math.sin(a) * sp * 0.6 * e - 50 * math.sin(PI * t) * 0.5
            chip(cv, x, y, rng.uniform(4, 7), a + t * 6, STONE, STONE_D, ow=1.8)


@effect('vfx_tiger_roar_ring', 'Boss', (256, 192), 8, 14, False, (0.5, 0.5), layer='ground', used_by='alpha_tiger',
        when='boss 2 Call the Pack (50% HP): roar rings from the boss when it summons tiger cubs (roar frame 3), '
             'together with vfx_screen_edge_pulse', notes='jagged gold and bone rings; scale 1.5 on the boss')
def fx_roar_ring(cv, i, n, rng):
    t = i / (n - 1)
    for k in range(2):
        v = t * 1.2 - k * 0.22
        if v <= 0 or v >= 1:
            continue
        s = 0.25 + 0.75 * ease(v)
        with cv.group(1.0 if v < 0.55 else lerp(1, 0.0, (v - 0.55) / 0.45)):
            _wave(cv, 128, 96, 112 * s, 80 * s, lerp(18, 8, v), GOLD, BONE, 1, 0.0, k * 0.3, jag=0.06, n=28)
            if k == 0:
                _wave(cv, 128, 96, 112 * s * 0.72, 80 * s * 0.72, lerp(7, 3, v), BONE, None, 8, 0.3, 0.2, n=6)


@effect('vfx_screen_edge_pulse', 'Boss', (480, 270), 1, 0, False, (0.5, 0.5), layer='screen', used_by='alpha_tiger',
        when='boss 2 Call the Pack warning: screen edges blink red while the boss roars; also usable for the '
             'myriad Last Heart darkening with a dark tint',
        notes='single frame: stretch over the whole viewport and animate alpha in code (0 -> 0.9 -> 0, 3 pulses '
              'of 0.5 s). Centre is fully transparent so it never hides enemies or the storm ring')
def fx_edge_pulse(cv, i, n, rng):
    x, y = (cv.X - 240) / 240, (cv.Y - 135) / 135
    d = np.maximum(np.abs(x), np.abs(y)) * 0.75 + np.hypot(x, y) * 0.25
    a = np.clip((d - 0.66) / 0.34, 0, 1) ** 1.7
    cv.paint(a * 0.85, DANGER)
    cv.paint(np.clip((d - 0.9) / 0.1, 0, 1) ** 2 * 0.6, DANGER_D)


@effect('vfx_tiger_headbutt_impact', 'Boss', (192, 192), 7, 18, False, (0.5, 0.5), used_by='alpha_tiger',
        when='boss 2 Wall Ram (first hit on the wall, after a 1.5 s head-down warning): impact burst on the wall '
             '(headbutt frame 3)', notes='also good for the primordial heavy wall hit')
def fx_headbutt(cv, i, n, rng):
    t = i / (n - 1)
    e = ease(t)
    if i < 3:
        ro = (44, 70, 62)[i]
        pts = []
        for k in range(20):
            r = ro * (1.0 if k % 2 == 0 else 0.5) * rng.uniform(0.8, 1.1)
            a = k * TAU / 20 + 0.15
            pts.append((96 + r * math.cos(a), 96 + r * math.sin(a)))
        with cv.group((1, 1, 0.6)[i]):
            cv.solid(poly(pts), GOLD if i < 2 else GOLD_L, ow=2.6)
            cv.fill(star(96, 96, 10, ro * 0.66, ro * 0.34, 0.15), GOLD_L)
            cv.fill(star(96, 96, 10, ro * 0.4, ro * 0.2, 0.4), WHITE)
    with cv.group(1.0 if t < 0.6 else lerp(1, 0.0, (t - 0.6) / 0.4)):
        _wave(cv, 96, 96, 30 + 60 * e, 30 + 60 * e, lerp(10, 3, t), WHITE, None, 4, 0.7, 0.35, n=10)
    with cv.group(1.0 if t < 0.7 else lerp(1, 0.3, (t - 0.7) / 0.3)):
        for k in range(11):
            a = k * TAU / 11 + rng.uniform(-0.2, 0.2)
            sp = rng.uniform(52, 84)
            x = 96 + math.cos(a) * sp * e
            y = 96 + math.sin(a) * sp * e + 22 * t * t
            chip(cv, x, y, rng.uniform(8, 13) * lerp(1, 0.7, t), a + t * 6, STONE, STONE_D, ow=2.2)
            cv.fill(circle(x - 2, y - 2, 2.0), STONE_L)


@effect('vfx_tree_root_ring', 'Boss', (384, 288), 8, 8, True, (0.5, 0.5), layer='ground', used_by='mother_tree',
        when='boss 3 Feeding Roots (always on): green ring on the ground around the walking boss; creatures '
             'inside heal slowly', notes='ellipse 352x256 px; scale so it matches the aura radius. Loop')
def fx_root_ring(cv, i, n, rng):
    u = i / n
    cx, cy, rx, ry = 192, 144, 176, 128
    pulse = 0.5 + 0.5 * math.sin(u * TAU)
    cv.fill(ellipse(cx, cy, rx, ry), HEAL, 0.10 + 0.05 * pulse)
    ground_ring(cv, cx, cy, rx, ry, HEAL, HEAL_D, w=4.5, light=HEAL_L)
    for k in range(12):                      # roots creeping along the rim
        a0 = k * TAU / 12 + 0.1
        pts = []
        for s in range(9):
            v = s / 8.0
            a = a0 + v * 0.36
            rr = 1.0 + 0.045 * math.sin(v * 7 + k + u * TAU) - 0.02
            pts.append((cx + rx * rr * math.cos(a), cy + ry * rr * math.sin(a)))
        f = union(*[seg(pts[s][0], pts[s][1], pts[s + 1][0], pts[s + 1][1], lerp(5, 1.4, s / 8.0), lerp(5, 1.4, (s + 1) / 8.0))
                    for s in range(8)])
        cv.solid(f, ROOT_C, ow=2.0, light=ROOT_L, sh=1.8)
        lx, ly = pts[5]
        g = 5.5 + 2.5 * math.sin(u * TAU + k)
        leaf = inter(circle(lx - 3, ly - g, g + 2), circle(lx + 3, ly - g, g + 2))
        cv.solid(leaf, HEAL_L, ow=1.8, outline=HEAL_D, dark=HEAL, sh=1.4)
    for k in range(7):
        a = k * TAU / 7 + 0.5
        v = (u + k / 7.0) % 1.0
        x, y = cx + rx * 0.6 * math.cos(a), cy + ry * 0.6 * math.sin(a) - 24 * v
        with cv.group(math.sin(PI * v) * 0.95):
            cv.solid(plus(x, y, 7, 2.4), HEAL_L, ow=1.7, outline=HEAL_D)


def _pod(cv, cx, by, s, glow, crack=0.0):
    body = smin(4, ellipse(cx, by - 17 * s, 15 * s, 17 * s), circle(cx, by - 33 * s, 6 * s))
    if glow > 0:
        cv.glow(grow(body, 3), TELE, 6, 1.1 * glow)
    cv.solid(body, ROOT_C, ow=2.2, dark=ROOT_D, light=ROOT_L, sh=3)
    seam = [(cx - 2 * s, by - 34 * s), (cx + 3 * s, by - 26 * s), (cx - 3 * s, by - 18 * s), (cx + 2 * s, by - 10 * s),
            (cx - 1 * s, by - 3 * s)]
    cv.fill(polyline(seam, (1.3 + 2.2 * crack) * s), OUTL)
    if glow > 0 or crack > 0:
        cv.fill(polyline(seam, (0.6 + 1.8 * crack) * s), TELE, max(glow, crack))
    cv.solid(inter(circle(cx + 6 * s, by - 40 * s, 7 * s), circle(cx + 12 * s, by - 36 * s, 7 * s)), HEAL, ow=1.7,
             outline=HEAL_D, light=HEAL_L, sh=1.2)
    cv.solid(circle(cx - 6 * s, by - 22 * s, 3.2 * s), PINK, ow=1.5, light=PINK_L, sh=1)


@effect('vfx_tree_seed_pod_blink', 'Boss', (64, 64), 4, 6, True, (0.5, 0.1), used_by='mother_tree',
        when='boss 3 Seeding (66% and 33% HP): seed pod dropped on the lane, blinking for 5 s before it hatches '
             'into a healer', notes='raise fps from 6 to 16 over the 5 s; pods can be destroyed by area damage')
def fx_pod_blink(cv, i, n, rng):
    g = (0.0, 0.5, 1.0, 0.5)[i]
    cv.fill(ellipse(32, 58, 18, 4.5), OUTL, 0.3)
    _pod(cv, 32, 58, 1.0 + 0.03 * g, g)


@effect('vfx_tree_seed_pod_hatch', 'Boss', (96, 96), 7, 14, False, (0.5, 0.2), used_by='mother_tree',
        when='boss 3 Seeding: the pod swells, cracks and bursts; spawn the healer on frame 4',
        notes='play instead of the blink loop when the 5 s are over')
def fx_pod_hatch(cv, i, n, rng):
    if i < 3:
        s = (1.05, 1.18, 1.3)[i]
        cv.fill(ellipse(48, 78, 18 * s, 4.5), OUTL, 0.3)
        _pod(cv, 48, 78, s, 1.0, crack=i / 2.0)
        return
    t = (i - 3) / (n - 4)
    e = ease(t)
    if i == 3:
        cv.glow(circle(48, 58, 16), TELE, 8, 1.0)
        sparkle(cv, 48, 58, 26, TELE, edge=HEAL_D, ow=2)
    with cv.group(lerp(1, 0.2, t)):
        _wave(cv, 48, 78, 14 + 28 * e, 5 + 10 * e, 5, HEAL, HEAL_L, 5, 0.3, 0.2, n=8)
        for k in range(4):
            cv.solid(plus(48 + (k - 1.5) * 20 * e, 50 - 26 * e - 5 * (k % 2), 6, 2.1), HEAL_L, ow=1.7, outline=HEAL_D)
        for k in range(7):
            a = -PI + k * PI / 6 + rng.uniform(-0.1, 0.1)
            sp = rng.uniform(24, 40)
            x, y = 48 + math.cos(a) * sp * e, 60 + math.sin(a) * sp * e + 24 * t * t
            chip(cv, x, y, rng.uniform(8, 12) * lerp(1, 0.7, t), a + t * 5, ROOT_C, ROOT_D, ow=2.0)


@effect('vfx_prism_charge_beam', 'Boss', (128, 48), 6, 12, True, (0.0, 0.5), used_by='prism',
        when='boss 4 Focus and Multi-Focus: rainbow beam from the prism sceptre to each targeted tower, charging '
             'for 5 s', notes='tileable along x and seamless as a loop: rotate and repeat x to the distance; '
             'scale y 0.4 -> 1.0 with charge progress')
def fx_prism_beam(cv, i, n, rng):
    _beam(cv, i, n, 48, [SPORE_D] + RAINBOW, 0.14)


@effect('vfx_prism_target_marker', 'Boss', (128, 96), 8, 12, True, (0.5, 0.5), layer='ground', used_by='prism',
        when='boss 4 Multi-Focus (50% HP): marker under each of the 3 targeted towers for the 5 s charge',
        notes='high priority (same family as the storm ring): draw it above tower bases, never above the storm ring')
def fx_prism_marker(cv, i, n, rng):
    u = i / n
    pulse = 0.5 + 0.5 * math.sin(u * TAU)
    cx, cy, rx, ry = 64, 48, 54, 38
    cv.fill(ellipse(cx, cy, rx, ry), LILAC, 0.14 + 0.12 * pulse)
    for k in range(3):
        a0 = k * TAU / 3 + u * TAU / 3
        cv.fill(earc(cx, cy, rx, ry, a0, a0 + 1.5, 10, n=14, taper=False), OUTL)
    for k in range(3):
        a0 = k * TAU / 3 + u * TAU / 3
        cv.fill(earc(cx, cy, rx, ry, a0 + 0.05, a0 + 1.45, 5.4, n=14, taper=False), RAINBOW[(k * 2) % 5])
        cv.fill(earc(cx, cy, rx, ry, a0 + 0.15, a0 + 1.35, 1.6, n=14, taper=False), WHITE)
    s = 1.0 + 0.1 * pulse
    tri = poly([(cx, cy - 20 * s), (cx - 19 * s, cy + 13 * s), (cx + 19 * s, cy + 13 * s)])
    cv.solid(tri, TELE, ow=2.4)
    cv.fill(poly([(cx, cy - 20 * s), (cx, cy + 13 * s), (cx + 19 * s, cy + 13 * s)]), LILAC_L)
    cv.fill(box(cx, cy + 1 * s, 1.6, 7 * s, 1.2), OUTL)
    cv.fill(circle(cx, cy + 9.5 * s, 2.0), OUTL)


@effect('vfx_prism_mirror_glint', 'Boss', (128, 128), 6, 14, False, (0.5, 0.5), blend='additive', used_by='prism, mirror',
        when='boss 4 Mirror Skin (always on): glints running over the crystals every few seconds, and whenever a '
             'single-target shot is reflected', notes='centre on the body; additive, also fine with normal alpha')
def fx_mirror_glint(cv, i, n, rng):
    spots = ((38, 44, 0), (84, 34, 1), (64, 76, 2), (96, 86, 3))
    for x, y, k in spots:
        v = (i - k * 0.9) / 2.6
        if 0 <= v <= 1:
            r = 22 * math.sin(PI * v)
            if r > 1.5:
                cv.glow(circle(x, y, r * 0.3), RAINBOW[(k + 3) % 5], 4, 0.8)
                cv.fill(star(x, y, 4, r + 1.6, r * 0.2 + 1.2, -PI / 2), RAINBOW[k % 5])
                cv.fill(star(x, y, 4, r, r * 0.16, -PI / 2), WHITE)
                cv.fill(star(x, y, 4, r * 0.5, r * 0.14, -PI / 4), WHITE)


@effect('vfx_prism_core_glow', 'Boss', (128, 128), 8, 10, True, (0.5, 0.5), blend='additive', used_by='prism',
        when='boss 4 Open Core (while it charges a beam, it takes double damage): glowing core on the chest crystal',
        notes='centre on the big chest crystal; additive, also fine with normal alpha')
def fx_core_glow(cv, i, n, rng):
    u = i / n
    pulse = 0.5 + 0.5 * math.sin(u * TAU)
    cv.glow(circle(64, 64, 18), TELE, 9, 0.7 + 0.3 * pulse)
    for k in range(10):
        a = k * TAU / 10 + u * TAU / 10
        L = (46 if k % 2 == 0 else 32) * (0.85 + 0.15 * pulse)
        cv.fill(seg(64 + 14 * math.cos(a), 64 + 14 * math.sin(a), 64 + L * math.cos(a), 64 + L * math.sin(a), 3.4, 0.4),
                RAINBOW[k % 5], 0.9)
    cv.fill(earc(64, 64, 25 + 3 * pulse, 25 + 3 * pulse, 0, TAU, 3.2, n=40, taper=False), TELE)
    d = poly([(64, 42 - 3 * pulse), (80 + 2 * pulse, 64), (64, 86 + 3 * pulse), (48 - 2 * pulse, 64)])
    cv.fill(grow(d, 2), TELE)
    cv.fill(d, WHITE)


@effect('vfx_myriad_absorb_trail', 'Boss', (128, 48), 8, 12, True, (0.0, 0.5), used_by='myriad',
        when='boss 5 Absorb (always on): wax of a creature that died nearby streams toward the boss and heals it',
        notes='tileable along x and seamless as a loop; blobs travel toward +x: anchor at the corpse, rotate toward '
              'the boss, repeat x to the distance. Blocked by fire and solvent')
def fx_absorb_trail(cv, i, n, rng):
    u = i / n
    cols = (BUTTER, SPORE, PINK, C('58cfc0'))
    lights = (BUTTER_L, SPORE_L, PINK_L, C('c8fff4'))
    for k in range(4):
        for rep in (-1, 0, 1):
            x = ((k / 4.0 + u) % 1.0) * 128 + rep * 128
            y = 24 + 8 * math.sin(k * 2.2 + 1) + 3 * math.sin(u * TAU + k)
            r = 7.5 - (k % 2) * 1.5
            if -40 < x < 170:
                cv.solid(seg(x - 30, y, x, y, 1.0, r), cols[k], ow=2.0, light=lights[k], sh=1.8)
                cv.fill(circle(x - 2, y - 2, r * 0.3), WHITE)
    for k in range(6):
        for rep in (-1, 0, 1):
            x = ((k / 6.0 + 0.1 + u * 2) % 1.0) * 128 + rep * 128
            y = 8 + (k * 17) % 34
            if -10 < x < 140:
                cv.solid(seg(x - 6, y, x, y, 0.6, 1.8), WAX_L, ow=1.3)


@effect('vfx_myriad_scream_wave', 'Boss', (384, 288), 8, 14, False, (0.5, 0.5), layer='ground', used_by='myriad',
        when='boss 5 Ten Thousand (66% and 33% HP): the faces scream and a wave spreads out as it spawns a mixed '
             'pack with a frenzy', notes='jagged violet rings; play on the scream frame')
def fx_scream_wave(cv, i, n, rng):
    t = i / (n - 1)
    for k in range(3):
        v = t * 1.3 - k * 0.2
        if v <= 0 or v >= 1:
            continue
        s = 0.22 + 0.78 * ease(v)
        with cv.group(1.0 if v < 0.55 else lerp(1, 0.0, (v - 0.55) / 0.45)):
            _wave(cv, 192, 144, 174 * s, 126 * s, lerp(22, 9, v), (SPORE, PINK, LILAC)[k], WHITE, 1, 0.0, k * 0.25,
                  jag=0.05 + 0.01 * k, n=36)


@effect('vfx_myriad_heart_glow', 'Boss', (128, 128), 8, 10, True, (0.5, 0.5), used_by='myriad',
        when='boss 5 Last Heart (10% HP): the eclipsed-sun heart opens on its back and beats; only squads can '
             'damage it', notes='centre on the heart on the boss back; heartbeat loop (two thumps per cycle)')
def fx_heart_glow(cv, i, n, rng):
    beat = (0.0, 1.0, 0.35, 0.9, 0.3, 0.1, 0.0, 0.0)[i]
    r = 21 + 3 * beat
    cv.glow(circle(64, 64, r + 6), GOLD, 12, 0.9 + 0.5 * beat)
    for k in range(12):
        a = k * TAU / 12 + 0.13
        L = r + (20 if k % 2 == 0 else 12) + 9 * beat
        cv.fill(seg(64 + (r + 2) * math.cos(a), 64 + (r + 2) * math.sin(a), 64 + L * math.cos(a), 64 + L * math.sin(a),
                    4.6, 0.5), OUTL, 0.85)
    for k in range(12):
        a = k * TAU / 12 + 0.13
        L = r + (20 if k % 2 == 0 else 12) + 9 * beat
        cv.fill(seg(64 + (r + 2) * math.cos(a), 64 + (r + 2) * math.sin(a), 64 + (L - 2) * math.cos(a),
                    64 + (L - 2) * math.sin(a), 2.8, 0.3), GOLD if k % 2 else TELE)
    cv.fill(circle(64, 64, r + 5.5), OUTL)
    cv.fill(circle(64, 64, r + 3.6), GOLD)
    cv.fill(circle(64, 64, r + 1.8), WHITE)
    cv.fill(circle(64 + 1.2, 64 + 1.2, r), C('140d20'))
    cv.fill(earc(64, 64, r * 0.72, r * 0.72, PI * 1.05, PI * 1.45, 2.4, n=8), TAR_L, 0.8)


# --------------------------------------------------------------------------- render + export
def render(e):
    w, h = e['cell']
    frames = []
    for i in range(e['frames']):
        cv = Canvas(w, h, e['ss'])
        e['fn'](cv, i, e['frames'], np.random.RandomState(zlib.crc32(e['name'].encode()) & 0x7fffffff))
        frames.append(cv.image())
    return frames


def sheet(frames):
    w, h = frames[0].size
    img = Image.new('RGBA', (w * len(frames), h), (0, 0, 0, 0))
    for k, f in enumerate(frames):
        img.paste(f, (k * w, 0))
    return img


def manifest_entry(e):
    w, h = e['cell']
    px, py = e['pivot']
    return {
        'name': e['name'], 'group': e['group'],
        'file': 'Assets/Art/VFX/%s/%s.png' % (e['group'], e['name']),
        'cell': [w, h], 'frames': e['frames'], 'rows': 1, 'fps': e['fps'], 'loop': e['loop'],
        'duration': round(e['frames'] / e['fps'], 3) if e['fps'] else 0,
        'pivot': [px, py], 'anchor_px': [round(px * w, 2), round((1 - py) * h, 2)],
        'blend': e['blend'], 'scale': e['scale'], 'layer': e['layer'], 'tintable': e['tintable'],
        'used_by': e['used_by'], 'when': e['when'], 'notes': e['notes'],
    }


MANIFEST_HELP = {
    'cell': '[width, height] of one frame in px; frames run left to right in one row',
    'fps': 'suggested playback speed; 0 = not an animation (pick a frame)',
    'pivot': 'Unity pivot [x from left, y from BOTTOM], 0..1',
    'anchor_px': 'the same point in px from the TOP-LEFT of the cell (for canvas drawImage)',
    'blend': 'alpha = normal blending; additive = add (canvas "lighter"), also acceptable as alpha',
    'scale': 'suggested scale for a tier-1 creature (128 px = 1 build cell); see notes for other sizes',
    'layer': 'ground = under units, over = on top of the unit, icon = above the head/health bar, '
             'screen = full-viewport overlay',
    'tintable': 'true = neutral white wax, multiply with the creature accent colour',
    'status_icon_frames': 'frame index of each status badge inside vfx_status_icons',
}

README_HEAD = """# VFX – hiệu ứng cho Dị Thể Sáp

Sprite sheet hiệu ứng của 16 Dị Thể Sáp và các trạng thái (cháy, băng, dung môi, lưới, chậm, hắc ín), vẽ bằng code
(`Tools/ArtGen/gen_vfx.py`). Cùng style với tháp và bản đồ: viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ
trên bên trái. Mọi hiệu ứng có viền tối nên đọc được trên cả nền tối (cầu cảng) lẫn nền sáng (đồng muối, tuyết).

- Mỗi file là **một hàng frame**, chạy từ trái sang phải. Ô (cell), số frame, fps, lặp, pivot, kiểu blend, scale gợi ý
  và lúc dùng nằm trong `vfx_manifest.json` (code và prototype HTML đọc file này, không chép số bằng tay)
- Pivot theo Unity: x tính từ trái, y tính từ **dưới** (0..1). `anchor_px` là cùng điểm đó tính bằng px từ góc trên trái
- `layer`: `ground` vẽ dưới chân quái · `over` vẽ đè lên quái · `icon` trên đầu, cạnh thanh máu · `screen` phủ cả màn hình
- `tintable = true`: sáp trắng trung tính, nhân màu (multiply) với màu nhấn của từng con
- 1 ô xây = 128 px. Scale gợi ý tính cho quái bậc 1; Sáp vụn và hổ con khoảng 0.5–0.6, trùm khoảng 1.6–2.0

## Màu dành riêng cho trạng thái
Cháy đỏ cam `#ef5b31` · dung môi xanh axit `#a6ff4d` · băng `#93cdd9` / `#8ff1ff` · hồi máu xanh lá `#58dd7c`.
Chỉ dùng cho đúng trạng thái đó. Cảnh báo kỹ năng dùng vàng nhạt `#fff6d8`, vạch nguy hiểm của trùm 2 dùng đỏ hồng `#ff3b55`.

## Biểu tượng trạng thái (GDD 8.5)
`Status/vfx_status_icons.png`, ô 40×40, không phải animation: mỗi frame là một huy hiệu, **mỗi cái một hình nền riêng**
để không phụ thuộc vào màu: 0 cháy (tròn, ngọn lửa) · 1 băng (lục giác, bông tuyết) · 2 dung môi (giọt, bong bóng) ·
3 lưới (vuông, mắt lưới) · 4 chậm (thoi, đồng hồ cát) · 5 hắc ín (khiên sáng, vệt đen chảy) · 6 tăng tốc (mũi tên lên) ·
7 đang hồi máu (chữ thập). Đặt cạnh nhau phía trên thanh máu, giữ nguyên cỡ 40 px cho mọi loại quái.

## Ưu tiên hiển thị (GDD 6.6, 8.3)
Vòng bão và thanh hội tụ luôn vẽ trên cùng. Hiệu ứng trạng thái bám quanh chân và hai bên thân để không che quái;
vũng tan chảy khi chết dài 0,4 giây và nằm dưới chân. `vfx_screen_edge_pulse` trong suốt ở giữa màn hình.

"""

README_TAIL = """
## Unity
- Pixels Per Unit = 128, Sprite Mode Multiple, Filter Bilinear, Compression None
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot theo `vfx_manifest.json` khi import lần đầu. Đổi kích thước ô
  hay pivot: chạy lại script rồi Tools > Units > Reapply Sprite Import Settings
- Sprite tên `<file>_r0_c<frame>`
- `blend = additive`: dùng material Particles/Additive (hoặc Sprites-Default cũng chấp nhận được)
- Các dải tia (`vfx_lens_beam`, `vfx_prism_charge_beam`, `vfx_tiger_pounce_line`, `vfx_myriad_absorb_trail`) lặp được theo
  chiều ngang: pivot ở giữa mép trái, xoay về phía mục tiêu, dùng Draw Mode Tiled hoặc xếp nhiều sprite nối nhau

## Dựng lại
```bash
python3 Tools/ArtGen/gen_vfx.py                      # tất cả (khoảng 1,5 phút)
python3 Tools/ArtGen/gen_vfx.py --only burning,heal  # vài hiệu ứng (manifest và README vẫn viết đủ)
python3 Tools/ArtGen/gen_vfx.py --board ~/Downloads/GuardianOfDawn-drafts/fable_vfx_board.png   # kèm bảng xem thử
```
"""


def write_docs():
    data = {'version': 1, 'generator': 'Tools/ArtGen/gen_vfx.py', 'pixels_per_unit': 128, 'fields': MANIFEST_HELP,
            'status_icon_frames': {v: k for k, v in enumerate(ICON_NAMES)},
            'effects': [manifest_entry(e) for e in EFFECTS]}
    with open(os.path.join(OUT_DIR, 'vfx_manifest.json'), 'w', encoding='utf-8') as fh:
        json.dump(data, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    lines = [README_HEAD]
    titles = {'Shared': 'Dùng chung cho mọi Dị Thể Sáp', 'Status': 'Trạng thái', 'Skills': 'Kỹ năng từng loại',
              'Boss': 'Trùm: cảnh báo và kỹ năng'}
    for g in ('Shared', 'Status', 'Skills', 'Boss'):
        lines.append('## %s (`%s/`)\n\n| File | Ô | Frame | fps | Lặp | Pivot | Blend | Lớp | Dùng khi |\n'
                     '|---|---|---|---|---|---|---|---|---|\n' % (titles[g], g))
        for e in EFFECTS:
            if e['group'] != g:
                continue
            lines.append('| `%s.png` | %d×%d | %d | %s | %s | (%g, %g) | %s | %s | %s |\n' % (
                e['name'], e['cell'][0], e['cell'][1], e['frames'], e['fps'] or '–', 'có' if e['loop'] else 'không',
                e['pivot'][0], e['pivot'][1], e['blend'], e['layer'], e['when'] + (' — ' + e['notes'] if e['notes'] else '')))
        lines.append('\n')
    lines.append(README_TAIL)
    with open(os.path.join(OUT_DIR, 'README.md'), 'w', encoding='utf-8') as fh:
        fh.write(''.join(lines))


# --------------------------------------------------------------------------- preview board
DARK_BG, LIGHT_BG = (35, 32, 46), (240, 237, 228)
MAPS = {
    'outskirts': ('Outskirts/map_outskirts_background.png', (600, 376)),
    'harbor': ('Harbor/map_harbor_background.png', (500, 500)),
    'old_town': ('OldTown/map_old_town_background.png', (400, 1064)),
    'white_plains': ('WhitePlains/map_white_plains_background.png', (200, 904)),
    'observatory': ('Observatory/map_observatory_background.png', (640, 664)),
}
# (map, [ (kind, name, x, y, size-or-scale, frame) ... ]) ; kind 'u' = creature (size = height px), 'v' = effect
SCENES = [
    ('outskirts', [('v', 'vfx_death_melt', 110, 205, 1.0, 3), ('v', 'vfx_drop_resource', 110, 200, 1, 3),
                   ('v', 'vfx_step_dust', 215, 208, 1, 3), ('u', 'standard', 250, 205, 104, 0),
                   ('v', 'vfx_status_burning', 250, 208, 1, 2), ('v', 'vfx_status_icons', 250, 92, 1, 0),
                   ('u', 'standard', 380, 215, 104, 0), ('v', 'vfx_hit_splash', 372, 170, 1, 2),
                   ('v', 'vfx_hit_flash', 372, 170, 1, 0), ('v', 'vfx_attack_swipe', 440, 170, 1, 1),
                   ('u', 'primordial', 540, 250, 210, 0), ('v', 'vfx_primordial_crack_glow', 540, 150, 1, 2),
                   ('v', 'vfx_status_tar', 250, 326, 0.6, 2), ('u', 'shard', 250, 330, 44, 0),
                   ('v', 'vfx_status_icons', 250, 276, 1, 5), ('v', 'vfx_primordial_shed_burst', 430, 300, 0.8, 4)]),
    ('harbor', [('v', 'vfx_tiger_pounce_line', 60, 180, 1, 0), ('v', 'vfx_tiger_pounce_line', 188, 180, 1, 0),
                ('v', 'vfx_tiger_pounce_marker', 400, 180, 1, 2), ('v', 'vfx_step_splash', 120, 222, 1, 3),
                ('u', 'tiger', 90, 215, 96, 0), ('v', 'vfx_status_netted', 90, 220, 1.1, 0),
                ('v', 'vfx_status_icons', 90, 100, 1, 3), ('v', 'vfx_attack_slash', 180, 290, 0.8, 1),
                ('u', 'crab', 540, 230, 96, 0), ('v', 'vfx_status_solvent', 540, 234, 1.1, 3),
                ('v', 'vfx_status_icons', 540, 112, 1, 2), ('v', 'vfx_tiger_land_dust', 400, 320, 0.9, 3),
                ('v', 'vfx_tiger_roar_ring', 170, 330, 0.8, 3)]),
    ('old_town', [('v', 'vfx_heal_ring', 170, 190, 1.0, 2), ('u', 'healer', 170, 200, 110, 0),
                  ('u', 'spore', 70, 215, 96, 0), ('v', 'vfx_heal_sparkle', 70, 150, 1, 3),
                  ('v', 'vfx_status_icons', 70, 100, 1, 7), ('v', 'vfx_spore_burst', 330, 120, 1, 3),
                  ('v', 'vfx_tree_seed_pod_blink', 300, 250, 1, 2), ('v', 'vfx_tree_seed_pod_hatch', 370, 250, 1, 4),
                  ('v', 'vfx_tree_root_ring', 500, 230, 0.8, 2), ('u', 'mother_tree', 500, 270, 220, 0)]),
    ('white_plains', [('u', 'lens', 90, 230, 104, 0), ('v', 'vfx_lens_charge_bar', 90, 100, 1, 13),
                      ('v', 'vfx_lens_beam', 120, 160, 1, 2), ('v', 'vfx_lens_beam_hit', 262, 160, 1, 2),
                      ('u', 'mirror', 90, 370, 100, 0), ('v', 'vfx_mirror_reflect', 100, 320, 1, 1),
                      ('v', 'vfx_status_slowed', 240, 362, 1, 2), ('u', 'lens', 240, 370, 104, 0),
                      ('v', 'vfx_status_frozen', 240, 374, 1.1, 2), ('v', 'vfx_status_icons', 240, 250, 1, 1),
                      ('v', 'vfx_step_salt', 330, 372, 1, 2),
                      ('v', 'vfx_prism_target_marker', 350, 110, 1, 2), ('v', 'vfx_prism_charge_beam', 400, 130, 1, 2),
                      ('u', 'prism', 540, 300, 230, 0), ('v', 'vfx_prism_core_glow', 545, 205, 1, 2),
                      ('v', 'vfx_prism_mirror_glint', 540, 180, 1, 2), ('v', 'vfx_death_melt', 400, 330, 1, 4)]),
    ('observatory', [('v', 'vfx_frenzy_howl', 150, 180, 1, 3), ('u', 'frenzy', 150, 215, 104, 0),
                     ('v', 'vfx_status_icons', 60, 110, 1, 6), ('u', 'ultimate', 60, 240, 110, 0),
                     ('v', 'vfx_ultimate_regen', 60, 245, 1, 3), ('v', 'vfx_step_snow', 250, 330, 1, 3),
                     ('v', 'vfx_myriad_scream_wave', 480, 230, 0.8, 4), ('u', 'myriad', 480, 300, 230, 0),
                     ('v', 'vfx_myriad_heart_glow', 520, 110, 0.9, 1), ('v', 'vfx_myriad_absorb_trail', 250, 250, 1, 2),
                     ('v', 'vfx_tiger_headbutt_impact', 300, 100, 0.8, 1), ('v', 'vfx_shadow_blob', 250, 372, 0.7, 0),
                     ('v', 'vfx_drop_specimen', 250, 372, 1, 3)]),
]


def _label(d, xy, text, fill):
    d.text(xy, text, fill=fill)


def board(rendered, path):
    """Every effect on a dark and a light background, then scenes composited over map crops."""
    W = 2400
    rows = []
    for e in EFFECTS:
        frames = rendered.get(e['name'])
        if not frames:
            continue
        w, h = e['cell']
        nshow = len(frames)
        idx = list(range(nshow))
        if nshow > 11:
            idx = list(range(0, nshow, 2))
        k = min(1.0, (W / 2 - 20) / (w * len(idx)), 150.0 / h)
        if h <= 48 and w * len(idx) * 2 <= W / 2 - 20:
            k = 2.0
        fw, fh = max(1, int(w * k)), max(1, int(h * k))
        row = Image.new('RGB', (W, fh + 26), DARK_BG)
        row.paste(Image.new('RGB', (W // 2, fh + 26), LIGHT_BG), (W // 2, 0))
        d = ImageDraw.Draw(row)
        txt = '%s  %dx%d  %df @%s fps  %s  %s' % (e['name'], w, h, e['frames'], e['fps'],
                                               'loop' if e['loop'] else 'once', e['blend'])
        _label(d, (6, 4), txt, (210, 205, 225))
        _label(d, (W // 2 + 6, 4), txt, (60, 50, 80))
        for side in (0, 1):
            for j, fi in enumerate(idx):
                f = frames[fi].resize((fw, fh), Image.LANCZOS if k < 1 else Image.NEAREST) if k != 1 else frames[fi]
                row.paste(f, (side * W // 2 + 8 + j * fw, 22), f)
        rows.append(row)
    scenes = []
    for mname, items in SCENES:
        mp, (ox, oy) = MAPS[mname]
        bg = Image.open(os.path.join(ROOT, 'Assets', 'Art', 'Maps', mp)).convert('RGBA').crop((ox, oy, ox + 640, oy + 400))
        for kind, name, x, y, s, fr in items:
            if kind == 'u':
                src = os.path.join(ROOT, 'Assets', 'Art', '_ArtDirection', 'options', 'gothic_v5', 'ingame_sprites',
                                   'src_%s.png' % name)
                if not os.path.exists(src):
                    continue
                im = Image.open(src).convert('RGBA')
                im = im.crop(im.getbbox())
                im = im.resize((max(1, int(im.width * s / im.height)), int(s)), Image.LANCZOS)
                bg.alpha_composite(im, (int(x - im.width / 2), int(y - im.height)))
            else:
                e = next((q for q in EFFECTS if q['name'] == name), None)
                if e is None or name not in rendered:
                    continue
                im = rendered[name][fr]
                if e['tintable']:              # show tintable wax in a creature accent colour
                    arr = np.asarray(im, np.float64)
                    arr[..., :3] *= np.asarray(C('ffcf5a'))
                    im = Image.fromarray(arr.astype(np.uint8), 'RGBA')
                if s != 1:
                    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
                px, py = e['pivot']
                pos = (int(x - px * im.width), int(y - (1 - py) * im.height))
                layer = Image.new('RGBA', bg.size, (0, 0, 0, 0))
                layer.paste(im, pos)
                if e['blend'] == 'additive':
                    a = np.asarray(bg, np.float64)
                    b = np.asarray(layer, np.float64)
                    a[..., :3] = np.clip(a[..., :3] + b[..., :3] * b[..., 3:] / 255.0, 0, 255)
                    bg = Image.fromarray(a.astype(np.uint8), 'RGBA')
                else:
                    bg.alpha_composite(layer)
        ImageDraw.Draw(bg).text((6, 4), mname + ' (1x, 1 build cell = 128 px)', fill=(255, 255, 255))
        scenes.append(bg.convert('RGB'))
    sh = 0
    if scenes:
        sh = 2 * 408 + 8
    H = sum(r.height for r in rows) + sh + 8
    out = Image.new('RGB', (W, H), (20, 18, 28))
    y = 0
    for k, s in enumerate(scenes):
        out.paste(s, (8 + (k % 3) * 648 + (0 if k < 3 else 0), 8 + (k // 3) * 408))
    y = sh
    for r in rows:
        out.paste(r, (0, y))
        y += r.height
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    out.save(path)
    return out.size


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--only', default='', help='comma-separated words; render only effects whose name contains one')
    ap.add_argument('--dry', action='store_true', help='do not write into Assets')
    ap.add_argument('--board', default='', help='write a preview board PNG to this path')
    args = ap.parse_args()
    words = [w.strip() for w in args.only.split(',') if w.strip()]
    rendered = {}
    for e in EFFECTS:
        if words and not any(w in e['name'] for w in words):
            continue
        frames = render(e)
        rendered[e['name']] = frames
        if not args.dry:
            d = os.path.join(OUT_DIR, e['group'])
            os.makedirs(d, exist_ok=True)
            sheet(frames).save(os.path.join(d, e['name'] + '.png'))
        print('%-32s %3dx%-3d x%d' % (e['name'], e['cell'][0], e['cell'][1], e['frames']))
    if not args.dry:
        os.makedirs(OUT_DIR, exist_ok=True)
        write_docs()
    if args.board:
        print('board', os.path.expanduser(args.board), board(rendered, os.path.expanduser(args.board)))


if __name__ == '__main__':
    main()
