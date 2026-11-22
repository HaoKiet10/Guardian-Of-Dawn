"""Binh lính (squad) placeholder renderers.

GDD 8.1: hazmat suit white #eef2f5, orange stripes #ff8a3d, yellow visor
#ffc94a, no visible face. Each type reads by silhouette:
- Warden (Lính trấn thủ): riot shield + rifle, horizontal chest band
- Hunter (Thợ săn): solvent canister on the back, bayonet rifle, diagonal sash
"""
import math

from artlib import Rig, flat, glow, pal, paint, rgb, shadow, stroke

SUIT = pal("#ffffff", "#eef2f5", "#b8bfcf")
SUIT_FAR = pal("#e6eaf0", "#cdd3de", "#9ea6ba")
ORANGE = pal("#ffb070", "#ff8a3d", "#d0602a")
VISOR = pal("#fff0b0", "#ffc94a", "#d99a2a")
GEAR = pal("#77758c", "#4f4d64", "#35334a")
METAL = pal("#c9d3e2", "#93a1ba", "#626d8a")
METAL_BACK = pal("#9eabc2", "#77849f", "#525c78")
GLASS = pal("#bfe0ff", "#7fb6e8", "#4f7fb8")
SOLV = pal("#d2f7a6", "#7fd36b", "#4c9a4a")
TAR = pal("#4d4460", "#2f283c", "#1c1726")
WHITE = (255, 255, 255)
FLASH = rgb("#fff4b0")
FLASH_RIM = rgb("#ffc94a")
SHIELD_GLOW = rgb("#bfe6ff")
SOLV_GLOW = rgb("#b6f58a")

FWD = {"E": (1.0, 0.0), "S": (0.0, 0.6), "N": (0.0, -0.6)}

MUZZLE = {
    "warden": {"S": (13.5, 15), "E": (30, 37), "N": (13, 60)},
    "hunter": {"S": (-13.5, 14), "E": (30, 35.5), "N": (13, 62)},
}


def _star(cx, cy, r_out, r_in, n=8, rot=0.0):
    pts = []
    for i in range(n * 2):
        r = r_out if i % 2 == 0 else r_in
        t = rot + math.pi * i / n
        pts.append((cx + r * math.cos(t), cy + r * math.sin(t) * 0.8))
    return ("p", pts)


def muzzle_flash(fr, x, y, s=1.0):
    paint(fr, [_star(x, y, 7 * s, 3 * s)], (FLASH_RIM, FLASH_RIM, FLASH_RIM), 0, outline=False)
    paint(fr, [_star(x, y, 4 * s, 1.8 * s, rot=0.3)], (FLASH, FLASH, FLASH), 0, outline=False)


def draw_soldier(fr, cx, gy, d, pose, kind):
    ow = 2.0
    fx, fy = FWD[d]
    step = pose.get("step", 0.0)
    ox, oy = fx * step, fy * step
    c = pose.get("crouch", 0.0)
    rec = pose.get("recoil", 0.0)
    rig = Rig(cx, gy, 1.0, rise=pose.get("bob", 0.0) - 4 * c, ox=ox, oy=oy,
              lean_x=pose.get("lean", 0.0) * fx, lean_y=pose.get("lean", 0.0) * fy)
    wrig = Rig(cx, gy, 1.0, rise=pose.get("bob", 0.0) - 4 * c, ox=ox - fx * 1.5 * rec,
               oy=oy - fy * 1.5 * rec)  # weapon rig, kicks back on recoil
    g = Rig(cx, gy, 1.0, ox=ox, oy=oy)

    shadow(fr.under, *g.p(0, 0), 15, 4.2)

    sw = pose.get("swing", 0.0)
    spread = 2.5 * c

    # ---------------- legs
    def legs(order):
        for side in order:
            s = -1 if side == 0 else 1
            if d == "E":
                hip = (1 + 1.5 * s, 22)
                foot = (1.5 * s + 6 * sw * s, 2.4 * max(0.0, -sw * s))
                pal_ = SUIT_FAR if side == 0 else SUIT
            else:
                hip = (4.5 * s, 22)
                lift = 2.4 * max(0.0, sw * s)
                foot = (5 * s + spread * s, lift)
                pal_ = SUIT
            hx, hy = rig.p(*hip)
            fxp, fyp = g.p(*foot)
            if d != "E":
                fyp += 1.4 * sw * s * (1 if d == "S" else -1)
            paint(fr, [("c", hx, hy, fxp, fyp - 2, 7.5)], pal_, ow)
            bx = fxp + (1.8 if d == "E" else 0)
            paint(fr, [("e", bx, fyp - 1, 4.6, 3.1)], GEAR, ow)

    # ---------------- torso, stripes, helmet
    def torso():
        if d == "E":
            prims = [rig.r(-8, 20, 8.5, 44, 5)]
        else:
            prims = [rig.r(-10.5, 20, 10.5, 44, 6)]
        tm = paint(fr, prims, SUIT, ow)
        if kind == "warden":
            flat(fr, [rig.r(-12, 29, 12, 33, 0)], ORANGE[1], 1, clip=tm)
        else:
            sash = [(-12, 41), (-12, 36), (12, 24), (12, 29)]
            if d == "N":
                sash = [(-x, y) for x, y in sash]
            flat(fr, [rig.poly(sash)], ORANGE[1], 1, clip=tm)
        flat(fr, [rig.r(-12, 20, 12, 23, 0)], GEAR[1], 1, clip=tm)
        flat(fr, [rig.r(-7 if d != "E" else -5, 37, -4 if d != "E" else -2, 42, 1)], WHITE, 0.7, clip=tm)
        return tm

    def helmet():
        hxc = 1 if d == "E" else 0
        hm = paint(fr, [rig.e(hxc, 52, 10.8, 10.4)], SUIT, ow)
        if d == "S":
            paint(fr, [rig.r(-8, 47, 8, 55.5, 3.5)], VISOR, 1.5)
            flat(fr, [rig.r(-6, 53, -2, 54.5, 0.8)], WHITE, 0.9)
        elif d == "E":
            paint(fr, [rig.r(3, 47, 12.2, 55.5, 3)], VISOR, 1.5)
            flat(fr, [rig.r(5, 53, 8, 54.5, 0.8)], WHITE, 0.9)
        else:
            flat(fr, [rig.r(-12, 50, 12, 53, 0)], ORANGE[1], 1, clip=hm)
        if kind == "warden":
            if d != "E":
                flat(fr, [rig.c(0, 57, 0, 63, 3)], ORANGE[1], 1, clip=hm)
            else:
                flat(fr, [rig.c(-1, 58, 1, 63, 3)], ORANGE[1], 1, clip=hm)
        else:
            ax = {"S": 6, "E": -3, "N": -6}[d]
            stroke(fr, rig.pts([(ax, 58), (ax + 3, 67)]), 1.3, GEAR[1])
            paint(fr, [rig.e(ax + 3, 67.5, 1.6, 1.6)], SOLV, 1.0)
        flat(fr, [rig.e(hxc - 5, 57, 2.5, 1.5)], WHITE, 0.85)

    def arm(shoulder, hand, palette):
        paint(fr, [rig.c(*shoulder, *hand, 6.5)], palette, ow)
        paint(fr, [rig.e(*hand, 3.4, 3.2)], GEAR, ow * 0.8)

    # ---------------- weapons
    def rifle(p0, p1, stock=None):
        prims = [wrig.c(*p0, *p1, 4.2)]
        if stock:
            prims.append(wrig.c(*stock, *p0, 4.6))
        paint(fr, prims, GEAR, ow)

    def blade(p0, p1, gl):
        if gl > 0:
            glow(fr, [wrig.c(*p0, *p1, 4)], SOLV_GLOW, 2.5, 0.9 * gl)
        paint(fr, [wrig.c(*p0, *p1, 2.4)], SOLV, 1.2)

    def shield_S(gs, down):
        y0, y1 = 6 - 6 * down, 40 - 6 * down
        prims = [rig.r(-23 + 3 * down, y0, -5 + 3 * down, y1, 3)]
        if gs > 0:
            glow(fr, prims, SHIELD_GLOW, 3.5, 0.9 * gs)
        sm = paint(fr, prims, METAL, ow)
        flat(fr, [rig.r(-24, y0 + 9, -4, y0 + 12, 0)], ORANGE[1], 1, clip=sm)
        paint(fr, [rig.r(-20 + 3 * down, y1 - 10, -8 + 3 * down, y1 - 7, 1)], GLASS, 1.0)
        flat(fr, [rig.r(-21 + 3 * down, y1 - 3, -19 + 3 * down, y0 + 15, 1)], WHITE, 0.5)
        if gs > 0:
            stroke(fr, rig.pts([(-23 + 3 * down, y0 + 1), (-23 + 3 * down, y1 - 1), (-5 + 3 * down, y1 - 1)]), 1.3, WHITE, gs)

    def shield_E(gs, down):
        y0, y1 = 5 - 6 * down, 42 - 6 * down
        prims = [rig.poly([(12, y0 - 1), (18.5, y0 + 1), (18.5, y1 + 1), (12, y1 - 1)])]
        if gs > 0:
            glow(fr, prims, SHIELD_GLOW, 3.5, 0.9 * gs)
        sm = paint(fr, prims, METAL, ow)
        flat(fr, [rig.r(11, y0 + 9, 19, y0 + 12, 0)], ORANGE[1], 1, clip=sm)
        if gs > 0:
            stroke(fr, rig.pts([(18.5, y0 + 1), (18.5, y1 + 1)]), 1.3, WHITE, gs)

    gs = pose.get("shield_glow", 0.0)
    sdown = pose.get("shield_down", 0.0)
    bg = pose.get("blade_glow", 0.0)
    flash = pose.get("flash_muzzle", 0.0)

    if d == "S":
        if kind == "hunter":
            paint(fr, [rig.r(-14, 26, 14, 45, 4)], METAL, ow)
        legs((0, 1))
        torso()
        if kind == "hunter":
            for s in (-1, 1):
                flat(fr, [rig.c(7 * s, 43, 6 * s, 24, 2.2)], GEAR[1], 1)
        helmet()
        if kind == "warden":
            arm((11.5, 41), (11, 28 + 2 * sw), SUIT)
            rifle((13, 15), (10, 30), stock=(9, 34))
            paint(fr, [rig.e(11, 28 + 2 * sw, 3.4, 3.2)], GEAR, ow * 0.8)
            arm((-11.5, 41), (-12, 26 - 2 * sw), SUIT)
            shield_S(gs, sdown)
        else:
            arm((11.5, 41), (12, 27 - 2 * sw), SUIT)
            rifle((-13.5, 18), (-9, 36), stock=(-8, 40))
            blade((-13.5, 18), (-14.8, 9), bg)
            arm((-11.5, 41), (-11, 29 + 2 * sw), SUIT)
    elif d == "E":
        if kind == "hunter":
            cm = paint(fr, [rig.r(-17, 24, -7, 46, 4)], METAL, ow)
            paint(fr, [rig.r(-15, 29, -10, 41, 1.5)], SOLV, 1.0)
            flat(fr, [rig.e(-14, 39, 1, 1)], WHITE, 0.8, clip=cm)
        arm((-1, 41), (8 + 2 * sw, 36), SUIT_FAR)
        legs((0, 1))
        torso()
        helmet()
        if kind == "warden":
            shield_E(gs, sdown)
            rifle((2, 36), (28, 37), stock=(-4, 35))
            arm((1, 41), (12 - 2 * sw, 35), SUIT)
        else:
            stroke(fr, rig.pts([(-12, 44), (-4, 40), (3, 34)]), 1.6, SOLV[2])
            rifle((0, 33), (28, 35), stock=(-4, 31))
            blade((22, 32.5), (37, 32), bg)
            arm((1, 41), (12 - 2 * sw, 33), SUIT)
    else:  # N
        if kind == "warden":
            sm = paint(fr, [rig.r(-22, 8 - 6 * sdown, -6, 40 - 6 * sdown, 3)], METAL_BACK, ow)
            flat(fr, [rig.r(-17, 22, -11, 25, 1)], GEAR[1], 1, clip=sm)
            if gs > 0:
                glow(fr, [rig.r(-22, 8 - 6 * sdown, -6, 40 - 6 * sdown, 3)], SHIELD_GLOW, 3.5, 0.6 * gs)
            rifle((13, 60), (9, 34))
        else:
            rifle((13, 62), (9, 36))
            blade((13, 62), (13.8, 68), bg)
        legs((0, 1))
        torso()
        helmet()
        arm((-11.5, 41), (-12, 29 - 2 * sw), SUIT)
        arm((11.5, 41), (11, 31 + 2 * sw), SUIT)
        if kind == "hunter":
            paint(fr, [rig.r(-9, 24, 9, 46, 4)], METAL, ow)
            paint(fr, [rig.r(-4, 28, 4, 42, 2)], SOLV, 1.0)
            flat(fr, [rig.r(-2.5, 36, -1, 41, 0.6)], WHITE, 0.8)

    if flash > 0:
        mx, my = MUZZLE[kind][d]
        X, Y = wrig.p(mx, my)
        if d == "N":
            Y -= 2
        muzzle_flash(fr, X, Y, flash)

    sl = pose.get("slash", 0.0)
    if sl > 0:
        if d == "E":
            pts = [(30, 54), (40, 44), (43, 32), (40, 20), (32, 12)]
        elif d == "S":
            pts = [(-20, 4), (-10, -2), (0, -4), (10, -2), (20, 4)]
        else:
            pts = [(-18, 64), (-9, 70), (0, 72), (9, 70), (18, 64)]
        P = g.pts(pts)
        glow(fr, [("c", *P[i], *P[i + 1], 5) for i in range(len(P) - 1)], SOLV_GLOW, 2.5, 0.9 * sl)
        stroke(fr, P, 2.6, SOLV[1], sl)
        stroke(fr, P, 1.0, WHITE, sl)


# ======================================================== props
def draw_tar_trap(fr, cx, cy, pose):
    """Bẫy hắc ín (Warden skill-tree trap): a sticky puddle that slows wax."""
    base = [("e", cx, cy, 30, 13), ("e", cx - 17, cy + 3, 14, 8), ("e", cx + 18, cy - 3, 15, 9),
            ("e", cx + 4, cy + 7, 12, 6)]
    paint(fr, base, TAR, 2.0, hi=0.55, lo=-0.25)
    for (x, y, rx, ry) in ((-12, -5, 7, 1.8), (10, -7, 5, 1.4), (19, 1, 3, 1.2)):
        flat(fr, [("e", cx + x, cy + y, rx, ry)], WHITE, 0.35)
    for (x, y, r, a) in pose.get("bubbles", []):
        if a <= 0:
            continue
        if r < 0:  # popped: ring
            stroke(fr, [(cx + x - 3, cy + y), (cx + x, cy + y - 1.5), (cx + x + 3, cy + y)], 1.0, TAR[0], a)
            continue
        paint(fr, [("e", cx + x, cy + y, r, r * 0.8)], TAR, 1.2, alpha=a)
        flat(fr, [("e", cx + x - r * 0.35, cy + y - r * 0.35, r * 0.3, r * 0.22)], WHITE, 0.6 * a)


def draw_rank(fr, n):
    """Cấp bậc đội lính: 1-3 orange chevrons."""
    h = 32
    total = 4 + 6 * (n - 1)
    y0 = (h - total) / 2 - 3
    for i in range(n):
        y = y0 + i * 6
        pts = [(5, y + 8), (16, y + 2), (27, y + 8), (27, y + 12), (16, y + 6), (5, y + 12)]
        paint(fr, [("p", pts)], ORANGE, 1.5)
