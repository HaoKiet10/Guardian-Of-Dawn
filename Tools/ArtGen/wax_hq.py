"""High-detail wax look (v2): volume shading, candle-like translucency,
wet highlights, ember eye sockets and the person still visible inside.

Art direction (see Assets/Art/Wax/README.md):
- Read like lit candle wax: warm amber core, cool purple-brown shadows,
  thin edges glowing orange where light passes through.
- Wet and heavy: sharp white specular dots, drips with bulb ends, a glossy
  puddle that the creature drags along.
- Story first: a dim human silhouette inside the torso (GDD 7.5 "bên trong
  vẫn còn con người"), hollow eye sockets with a faint ember.
"""
import math

from artlib import (OUTLINE, Rig, flat, glow, inner_shape, lerp2, paint_volume,
                    rgb, shadow)

WAXM = dict(shadow=rgb("#c08a72"), mid=rgb("#f6d690"), light=rgb("#fff8e6"),
            core=rgb("#ffe08c"), rim=rgb("#ff8f3a"), spec=(255, 255, 255), edge_alpha=0.84)
WAXM_FAR = dict(WAXM, shadow=rgb("#a9786c"), mid=rgb("#e6be7c"), light=rgb("#f8e6c0"))
POOLM = dict(WAXM, shadow=rgb("#c99467"), mid=rgb("#f0c77c"), light=rgb("#fff0c8"), edge_alpha=0.8, gloss=14)
SOCKET = rgb("#2a1830")
EMBER = rgb("#ff9a3c")
EMBER_CORE = rgb("#ffe0a0")
INNER = rgb("#8a3f2c")
WHITE = (255, 255, 255)

REST = {"S": ((-18, 7), (19, 8)), "N": ((-18, 7), (19, 8)), "E": ((-4, 9), (12, 7))}
UP = {"S": ((-11, 66), (11, 66)), "N": ((-11, 66), (11, 66)), "E": ((-1, 64), (7, 68))}
SLAM = {"S": ((-8, 3), (8, 3)), "N": ((-8, 28), (8, 28)), "E": ((19, 9), (27, 7))}


def _taper(rig, x0, y0, x1, y1, w0, w1):
    """Limb that thins from w0 to w1, with round ends."""
    X0, Y0 = rig.p(x0, y0)
    X1, Y1 = rig.p(x1, y1)
    dx, dy = X1 - X0, Y1 - Y0
    n = math.hypot(dx, dy) or 1
    px, py = -dy / n, dx / n
    a0, a1 = w0 * rig.k / 2, w1 * rig.k / 2
    quad = ("p", [(X0 + px * a0, Y0 + py * a0), (X1 + px * a1, Y1 + py * a1),
                  (X1 - px * a1, Y1 - py * a1), (X0 - px * a0, Y0 - py * a0)])
    return [quad, ("e", X0, Y0, a0, a0), ("e", X1, Y1, a1, a1)]


def _drip(rig, x, y, length, w):
    """A hanging drip with a bulb at the end."""
    return [rig.c(x, y, x, y - length, w), rig.e(x, y - length - w * 0.25, w * 0.75, w * 0.95)]


def draw_standard(fr, cx, gy, k, d, pose):
    m = pose.get("melt", 0.0)
    sx, sy = pose.get("squash", (1.0, 1.0))
    sy *= 1 - 0.8 * m
    sx *= 1 + 0.55 * m
    ow = pose.get("ow", 2.0)
    lean = pose.get("lean", 0.0) + 2.0  # always a little hunched
    lx, ly = {"E": (lean, 0), "S": (0, lean * 0.5), "N": (0, -lean * 0.5)}[d]
    fx, fy = {"E": (1, 0), "S": (0, 0.6), "N": (0, -0.6)}[d]
    st = pose.get("step", 0.0)
    rig = Rig(cx, gy, k, sx, sy, rise=pose.get("bob", 0.0) * (1 - m),
              lean_x=lx + pose.get("sway", 0.0), lean_y=ly, ox=fx * st, oy=fy * st)
    g = Rig(cx, gy, k, ox=fx * st, oy=fy * st)
    hx = {"E": 5, "S": 1, "N": 0}[d]
    drip_len = 1 + 0.5 * math.sin(pose.get("drip", 0.0))

    # ---- ground: shadow + glossy puddle
    shadow(fr.under, *g.p(0, 0), 27 * k * (1 + 0.8 * m), 7 * k, 0.28)
    paint_volume(fr, [g.e(0, 2, 22 * (1 + 1.2 * m), 6 * (1 + 0.35 * m)), g.e(-14, 1, 8, 4), g.e(15, 2.5, 7, 3.5)],
                 POOLM, ow, thick=4)
    flat(fr, [g.e(-9, 4, 5, 1.1), g.e(10, 3.5, 3, 0.9)], WHITE, 0.7 * (1 - 0.5 * m))

    # ---- arms
    a = pose.get("raise", 0.0)
    sw = pose.get("swing", 0.0)
    hands = []
    for i in range(2):
        tgt = UP[d][i] if a >= 0 else SLAM[d][i]
        h = lerp2(REST[d][i], tgt, abs(a))
        h = (h[0] + (-5 if i == 0 else 5) * sw, h[1]) if d == "E" else (h[0], h[1] + (3 if i == 0 else -3) * sw)
        hands.append(h)
    shoulders = {"S": ((-11, 39), (11, 38)), "N": ((-11, 39), (11, 38)), "E": ((0, 39), (6, 38))}[d]

    def arm(i, mat):
        (x0, y0), (x1, y1) = shoulders[i], hands[i]
        ex, ey = (x0 + x1) / 2 + (-2 if i == 0 else 2) * (1 - abs(a)), (y0 + y1) / 2
        prims = _taper(rig, x0, y0, ex, ey, 10, 6.5) + _taper(rig, ex, ey, x1, y1, 6.5, 4.2)
        prims += [rig.e(x1, y1 - 1, 4.6, 5.2), rig.e(x1 - 1.5, y1 - 4, 3, 3)]
        if a > -0.3:  # fingers melt into strands
            prims += _drip(rig, x1 - 2.2, y1 - 5, 4.5 * drip_len, 1.8) + _drip(rig, x1 + 1.6, y1 - 5, 7 * drip_len, 2.0)
        paint_volume(fr, prims, mat, ow, thick=4.5)

    # ---- body: one melted mass
    def body():
        hw = 13 if d == "E" else 15
        prims = [rig.poly([(-18, 1.5), (18, 1.5), (15, 5), (12, 12), (11, 18), (-11, 18), (-12, 12), (-15, 5)]),
                 rig.e(0, 27, hw - 2, 19), rig.e(-9, 39, 6.5, 5.5), rig.e(9, 38, 6.5, 5.5),
                 rig.e(hx * 0.5, 43, 7, 6), rig.e(hx, 51, 10, 9.5), rig.e(hx - 5.5, 45, 4.5, 4.5)]
        prims += _drip(rig, -hw + 1, 24, 12 * drip_len, 3) + _drip(rig, hw - 2.5, 20, 9 * drip_len, 2.6) + _drip(rig, -4, 12, 6 * drip_len, 2.4)
        prims += _drip(rig, hx + 3, 42, 6 * drip_len, 2.2)
        bm = paint_volume(fr, prims, WAXM, ow, thick=11)
        # the person still inside (GDD 7.5)
        if d == "E":
            inner = [rig.e(3, 38, 4.5, 5), rig.r(-5, 18, 6, 34, 4), rig.c(2, 30, 7, 20, 3)]
        else:
            inner = [rig.e(0, 38, 4.5, 5), rig.r(-7, 17, 7, 34, 4), rig.c(-6, 31, -9, 19, 3), rig.c(6, 31, 9, 19, 3)]
        inner_shape(fr, inner, INNER, 0.42 * (1 - m), bm, blur=1.0)
        for (bx, by_, br) in ((-6, 30, 1.2), (5, 22, 0.9), (-2, 14, 1.0), (8, 31, 0.7)):
            flat(fr, [rig.e(bx, by_, br, br)], WHITE, 0.45 * (1 - m), clip=bm)
        return bm

    def face():
        fa = 1 - min(1, m * 1.6)
        if fa <= 0:
            return
        dy = -6 * m
        eyes = [(hx - 4.5, 51), (hx + 4.5, 51)] if d == "S" else ([(hx + 6, 51)] if d == "E" else [])
        for i, (ex, ey) in enumerate(eyes):
            tilt = -12 if ex < hx else 12
            flat(fr, [rig.oe(ex, ey + dy, 2.7 if d == "S" else 2.2, 3.5, tilt)], SOCKET, fa)
            glow(fr, [rig.e(ex, ey - 0.6 + dy, 1.4, 1.6)], EMBER, 1.2, 0.8 * fa)
            flat(fr, [rig.e(ex, ey - 0.6 + dy, 0.8, 1.0)], EMBER_CORE, fa)
        if d == "S":
            flat(fr, [rig.e(hx + 0.5, 44.5 + dy, 2.8, 2.1), rig.c(hx + 0.8, 44, hx + 1.2, 41, 1.4)], SOCKET, 0.9 * fa)
        elif d == "E":
            flat(fr, [rig.e(hx + 9, 44.5 + dy, 1.7, 1.6)], SOCKET, 0.9 * fa)

    if d == "N":
        arm(0, WAXM)
        arm(1, WAXM)
        body()
    elif d == "E":
        arm(0, WAXM_FAR)
        body()
        face()
        arm(1, WAXM)
    else:
        if a > 0.2:
            arm(0, WAXM)
            arm(1, WAXM)
            body()
            face()
        else:
            body()
            face()
            arm(0, WAXM)
            arm(1, WAXM)
