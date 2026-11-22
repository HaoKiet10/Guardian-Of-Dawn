"""Small vector-style sprite toolkit shared by the unit generators.

Every sprite is drawn at SS x resolution from simple primitives (ellipse,
polygon, capsule, rounded rect), shaded in three tones with light from the
top left, outlined in the house outline colour, then downsampled. This is the
same look as the code-built tower and map placeholders:
- outline #2c2240, about 2 px at final size
- each colour has 3 tones (light, mid, dark)
"""
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SS = 4
OUTLINE = (0x2C, 0x22, 0x40)
LIGHT_DIR = (-0.55, -0.83)  # top left, in screen space (y down)


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def pal(light, mid, dark):
    return (rgb(light), rgb(mid), rgb(dark))


class Frame:
    """Premultiplied RGBA canvas drawn at SS x the final size."""

    def __init__(self, w, h=None):
        h = h or w
        self.w, self.h = w, h
        self.W, self.H = w * SS, h * SS
        self.P = np.zeros((self.H, self.W, 3), np.float32)
        self.A = np.zeros((self.H, self.W), np.float32)
        self._grid = None

    def grid(self):
        if self._grid is None:
            ys, xs = np.mgrid[0:self.H, 0:self.W].astype(np.float32)
            self._grid = (xs, ys)
        return self._grid

    def comp(self, color, a):
        c = np.asarray(color, np.float32) / 255.0
        a = np.clip(a, 0, 1).astype(np.float32)
        self.P = a[..., None] * c + self.P * (1 - a[..., None])
        self.A = a + self.A * (1 - a)

    def flash(self, k, color=(255, 255, 255)):
        """Tint everything already drawn toward a colour (hit flash)."""
        if k <= 0:
            return
        c = np.asarray(color, np.float32) / 255.0
        self.P = self.P * (1 - k) + self.A[..., None] * c * k

    def fade(self, k):
        self.P *= k
        self.A *= k

    def image(self):
        P = np.clip(self.P, 0, 1)
        A = np.clip(self.A, 0, 1)
        arr = (np.dstack([P, A[..., None]]) * 255 + 0.5).astype(np.uint8)
        im = Image.frombytes("RGBa", (self.W, self.H), arr.tobytes())
        return im.resize((self.w, self.h), Image.LANCZOS).convert("RGBA")


# ---------------------------------------------------------------- primitives
# Coordinates are final-size pixels; mask() scales by SS.
#   ('e', cx, cy, rx, ry)            ellipse
#   ('oe', cx, cy, rx, ry, deg)      rotated ellipse
#   ('p', [(x, y), ...])             polygon
#   ('c', x0, y0, x1, y1, w)         capsule (round-ended thick line)
#   ('r', x0, y0, x1, y1, radius)    rounded rect
#   ('-', prim)                      cut that primitive out


def _draw(d, p, fill):
    s = SS
    k = p[0]
    if k == "-":
        _draw(d, p[1], 0)
    elif k == "e":
        _, cx, cy, rx, ry = p
        rx, ry = abs(rx), abs(ry)
        d.ellipse([(cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s], fill=fill)
    elif k == "oe":
        _, cx, cy, rx, ry, deg = p
        a = math.radians(deg)
        pts = []
        for i in range(48):
            t = 2 * math.pi * i / 48
            x, y = rx * math.cos(t), ry * math.sin(t)
            pts.append(((cx + x * math.cos(a) - y * math.sin(a)) * s,
                        (cy + x * math.sin(a) + y * math.cos(a)) * s))
        d.polygon(pts, fill=fill)
    elif k == "p":
        d.polygon([(x * s, y * s) for x, y in p[1]], fill=fill)
    elif k == "c":
        _, x0, y0, x1, y1, w = p
        r = w / 2
        d.line([(x0 * s, y0 * s), (x1 * s, y1 * s)], fill=fill, width=max(1, int(round(w * s))))
        for x, y in ((x0, y0), (x1, y1)):
            d.ellipse([(x - r) * s, (y - r) * s, (x + r) * s, (y + r) * s], fill=fill)
    elif k == "r":
        _, x0, y0, x1, y1, rad = p
        x0, x1 = sorted((x0, x1))
        y0, y1 = sorted((y0, y1))
        rad = max(0, min(rad, (x1 - x0) / 2, (y1 - y0) / 2))
        d.rounded_rectangle([x0 * s, y0 * s, x1 * s, y1 * s], radius=rad * s, fill=fill)
    else:
        raise ValueError(k)


def mask(fr, prims):
    im = Image.new("L", (fr.W, fr.H), 0)
    d = ImageDraw.Draw(im)
    for p in prims:
        _draw(d, p, 255)
    return np.asarray(im, np.float32) / 255.0


def _bbox(m, pad, W, H):
    ys = np.nonzero(m.any(axis=1))[0]
    xs = np.nonzero(m.any(axis=0))[0]
    if len(xs) == 0:
        return None
    return (max(0, xs[0] - pad), min(W, xs[-1] + pad + 1),
            max(0, ys[0] - pad), min(H, ys[-1] + pad + 1))


def outline_of(fr, m, ow):
    r = ow * SS
    bb = _bbox(m > 0.5, int(r) + 3, fr.W, fr.H)
    out = np.zeros_like(m)
    if bb is None:
        return out
    x0, x1, y0, y1 = bb
    dist = ndimage.distance_transform_edt(m[y0:y1, x0:x1] < 0.5)
    out[y0:y1, x0:x1] = np.clip(r + 0.5 - dist, 0, 1)
    return out


def toned(fr, m, palette, tone=None, light=LIGHT_DIR, hi=0.36, lo=-0.40):
    """Colour array with 3 toon tones over the part's volume."""
    xs, ys = fr.grid()
    if tone is None:
        bb = _bbox(m > 0.5, 0, fr.W, fr.H)
        if bb is None:
            return np.zeros(m.shape + (3,), np.float32)
        x0, x1, y0, y1 = bb
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        hw, hh = max(1, (x1 - x0) / 2), max(1, (y1 - y0) / 2)
    else:
        cx, cy, hw, hh = (v * SS for v in tone)
    u = (xs - cx) / hw
    v = (ys - cy) / hh
    s = u * light[0] + v * light[1]
    L, M, D = (np.asarray(c, np.float32) for c in palette)
    col = np.empty(m.shape + (3,), np.float32)
    col[:] = M
    col[s > hi] = L
    col[s < lo] = D
    return col


def paint(fr, prims, palette, ow=2.0, alpha=1.0, outline=True, tone=None,
          clip=None, hi=0.36, lo=-0.40):
    """Fill a part in 3 tones with an outline. Returns its mask."""
    m = mask(fr, prims)
    if clip is not None:
        m = m * clip
    if m.max() <= 0:
        return m
    if outline and ow > 0:
        fr.comp(OUTLINE, outline_of(fr, m, ow) * alpha)
    fr.comp(toned(fr, m, palette, tone, hi=hi, lo=lo), m * alpha)
    return m


def flat(fr, prims, color, alpha=1.0, clip=None):
    m = mask(fr, prims)
    if clip is not None:
        m = m * clip
    fr.comp(color, m * alpha)
    return m


def stroke(fr, pts, w, color, alpha=1.0, clip=None):
    prims = [("c", *pts[i], *pts[i + 1], w) for i in range(len(pts) - 1)]
    return flat(fr, prims, color, alpha, clip)


def glow(fr, prims, color, radius, alpha=0.6):
    """Soft blurred halo (for skill and warning glows)."""
    m = mask(fr, prims)
    im = Image.fromarray((m * 255).astype(np.uint8), "L").filter(
        ImageFilter.GaussianBlur(radius * SS))
    fr.comp(color, np.asarray(im, np.float32) / 255.0 * alpha)


def shadow(fr, cx, cy, rx, ry, alpha=0.22):
    flat(fr, [("e", cx, cy, rx, ry)], OUTLINE, alpha)


# ---------------------------------------------------------------- volume shading
def _smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def _mix(a, b, t):
    return a + (b - a) * t[..., None]


def paint_volume(fr, prims, mat, ow=2.0, alpha=1.0, clip=None, thick=None, extra_h=None):
    """Soft 3D-looking fill for organic parts (wax).

    Builds a dome height field from the distance to the part edge, derives
    normals, then mixes: a 4-step toon ramp with soft band edges, warm
    subsurface glow in thick areas, a coloured back-rim on thin edges, sharp
    wet specular highlights, and slightly translucent edges.
    mat: dict of colours (shadow, mid, light, core, rim, spec) as RGB tuples.
    Returns the part mask.
    """
    m = mask(fr, prims)
    if clip is not None:
        m = m * clip
    if m.max() <= 0:
        return m
    if ow > 0:
        fr.comp(OUTLINE, outline_of(fr, m, ow) * alpha)
    bb = _bbox(m > 0.5, 6, fr.W, fr.H)
    x0, x1, y0, y1 = bb
    mc = m[y0:y1, x0:x1]
    d = ndimage.distance_transform_edt(mc > 0.5)
    T = thick * SS if thick else max(1.0, d.max())
    h = np.sqrt(np.clip(d / T, 0, 1))
    if extra_h is not None:
        h = np.clip(h + extra_h[y0:y1, x0:x1], 0, 1.2)
    h = ndimage.gaussian_filter(h, SS * 0.6)
    gy, gx = np.gradient(h)
    k = T * 0.9
    nx, ny, nz = -gx * k, -gy * k, np.ones_like(h)
    inv = 1 / np.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx * inv, ny * inv, nz * inv
    L = np.array([-0.55, -0.65, 0.55])
    L /= np.linalg.norm(L)
    diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    Hv = L + np.array([0, 0, 1.0])
    Hv /= np.linalg.norm(Hv)
    spec = np.clip(nx * Hv[0] + ny * Hv[1] + nz * Hv[2], 0, 1) ** mat.get("gloss", 28)
    S, M, Li = (np.asarray(mat[c], np.float32) / 255 for c in ("shadow", "mid", "light"))
    col = _mix(S, M, _smooth(diff, mat.get("s_lo", 0.16), mat.get("s_hi", 0.26)))
    col = _mix(col, Li, _smooth(diff, mat.get("l_lo", 0.62), mat.get("l_hi", 0.70)))
    core = np.asarray(mat["core"], np.float32) / 255
    col = _mix(col, core, mat.get("core_k", 0.35) * _smooth(h, 0.5, 1.0) * (1 - _smooth(diff, 0.75, 0.95)))
    rim = np.asarray(mat["rim"], np.float32) / 255
    back = np.clip(-(nx * L[0] + ny * L[1]), 0, 1)
    edge = 1 - _smooth(h, 0.0, mat.get("rim_w", 0.6))
    col = _mix(col, rim, mat.get("rim_k", 0.95) * edge * _smooth(back, 0.05, 0.4))
    sp = np.asarray(mat.get("spec", (255, 255, 255)), np.float32) / 255
    col = _mix(col, sp, _smooth(spec, 0.55, 0.62))
    a = mc * alpha * (mat.get("edge_alpha", 0.86) + (1 - mat.get("edge_alpha", 0.86)) * _smooth(h, 0.0, 0.5))
    full = np.zeros((fr.H, fr.W, 3), np.float32)
    full[y0:y1, x0:x1] = col
    am = np.zeros_like(m)
    am[y0:y1, x0:x1] = a
    fr.comp(full * 255, am)
    return m


def inner_shape(fr, prims, color, alpha, clip, blur=1.2):
    """Something seen through translucent wax: blurred, clipped to the body."""
    m = mask(fr, prims)
    m = ndimage.gaussian_filter(m, SS * blur)
    fr.comp(color, m * clip * alpha)


# ---------------------------------------------------------------- rig
class Rig:
    """Maps local unit coordinates (x right, y up from the ground, unscaled)
    to screen pixels, with scale k, squash and a height-weighted lean."""

    def __init__(self, cx, gy, k=1.0, sx=1.0, sy=1.0, rise=0.0, lean_x=0.0,
                 lean_y=0.0, ox=0.0, oy=0.0, ref_h=60.0):
        self.cx, self.gy, self.k = cx, gy, k
        self.sx, self.sy, self.rise = sx, sy, rise
        self.lean_x, self.lean_y = lean_x, lean_y
        self.ox, self.oy, self.ref_h = ox, oy, ref_h

    def p(self, x, y):
        h = y / self.ref_h
        return (self.cx + self.k * (x * self.sx + self.lean_x * h + self.ox),
                self.gy - self.k * (y * self.sy + self.rise) + self.k * (self.lean_y * h + self.oy))

    def e(self, x, y, rx, ry):
        X, Y = self.p(x, y)
        return ("e", X, Y, rx * self.k * self.sx, ry * self.k * self.sy)

    def oe(self, x, y, rx, ry, deg):
        X, Y = self.p(x, y)
        return ("oe", X, Y, rx * self.k * self.sx, ry * self.k * self.sy, deg)

    def c(self, x0, y0, x1, y1, w):
        return ("c", *self.p(x0, y0), *self.p(x1, y1), w * self.k)

    def poly(self, pts):
        return ("p", [self.p(x, y) for x, y in pts])

    def r(self, x0, y0, x1, y1, rad):
        X0, Y0 = self.p(x0, y0)
        X1, Y1 = self.p(x1, y1)
        return ("r", X0, Y0, X1, Y1, rad * self.k)

    def pts(self, pts):
        return [self.p(x, y) for x, y in pts]

    def tone(self, x, y, hw, hh):
        X, Y = self.p(x, y)
        return (X, Y, hw * self.k * self.sx, hh * self.k * self.sy)


# ---------------------------------------------------------------- sheets
def sheet(rows):
    """rows: list of lists of PIL images, all the same size."""
    cw, ch = rows[0][0].size
    cols = max(len(r) for r in rows)
    out = Image.new("RGBA", (cw * cols, ch * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            out.paste(im, (c * cw, r * ch))  # cells never overlap: no alpha mask
    return out


def lerp(a, b, t):
    return a + (b - a) * t


def lerp2(a, b, t):
    return (lerp(a[0], b[0], t), lerp(a[1], b[1], t))
