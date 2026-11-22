"""Dị Thể Sáp (wax) placeholder renderers.

Each draw_* function paints one frame of one creature for one direction
('S' toward the camera, 'E' facing right, 'N' away). W = E flipped in code.
Poses are plain dicts so the animation tables in gen_units.py stay readable.
"""
import math

from artlib import OUTLINE, Rig, flat, glow, lerp, lerp2, paint, pal, rgb, shadow, stroke

WAX = pal("#fff4d6", "#f2d68f", "#c9a066")
WAX_FAR = pal("#efdca8", "#d9b878", "#ab8452")
WAX_POOL = pal("#fbe9b8", "#e8c77e", "#bf955c")
SHELL = pal("#f6bf78", "#dc8f44", "#a35a32")
CLOTH = pal("#a9b8d6", "#7a8bb4", "#525d88")
CLOTH_DARK = pal("#7a87ad", "#5b6690", "#3f476c")
HUMAN = pal("#fff3e6", "#f1d9c4", "#c9a68e")
CHAIN = pal("#e1e4ec", "#a3a9ba", "#6a7086")
STRIPE = rgb("#c27a3c")
SCAR = rgb("#fbe2c4")
WHITE = (255, 255, 255)
GLOW = rgb("#ffb347")
GLOW_CORE = rgb("#fff1c2")
RED = rgb("#ff4d4d")

FWD = {"E": (1.0, 0.0), "S": (0.0, 0.6), "N": (0.0, -0.6)}  # (ox, screen oy) per unit


def _fwd(d, dist):
    fx, fy = FWD[d]
    return fx * dist, fy * dist


# ======================================================== humanoid wax
HUM_REST = {"S": ((-18, 14), (18, 14)), "N": ((-18, 14), (18, 14)), "E": ((-6, 16), (10, 14))}
HUM_UP = {"S": ((-11, 64), (11, 64)), "N": ((-11, 64), (11, 64)), "E": ((-2, 62), (6, 66))}
HUM_SLAM = {"S": ((-8, 4), (8, 4)), "N": ((-8, 28), (8, 28)), "E": ((18, 10), (26, 8))}

CRACKS = [[(-6, 44), (-3, 36), (-7, 28), (-4, 18)], [(4, 56), (2, 50), (7, 44)],
          [(9, 31), (5, 23), (9, 13)], [(-13, 25), (-9, 19), (-11, 12)]]


def draw_humanoid(fr, cx, gy, k, d, pose, variant="standard"):
    m = pose.get("melt", 0.0)
    sx, sy = pose.get("squash", (1.0, 1.0))
    sy *= 1 - 0.8 * m
    sx *= 1 + 0.55 * m
    crab = variant == "crab"
    boss = variant == "primordial"
    ow = pose.get("ow", 2.0)
    lean = pose.get("lean", 0.0) + (3 if crab else 0)
    lx, ly = {"E": (lean, 0), "S": (0, lean * 0.6), "N": (0, -lean * 0.6)}[d]
    ox, oy = _fwd(d, pose.get("step", 0.0))
    rig = Rig(cx, gy, k, sx, sy, rise=pose.get("bob", 0.0) * (1 - m),
              lean_x=lx + pose.get("sway", 0.0), lean_y=ly, ox=ox, oy=oy)
    ground = Rig(cx, gy, k, ox=ox, oy=oy)

    head_y = 44 if crab else 50
    headx = {"E": 4, "S": 0, "N": 0}[d]

    # ---- ground: shadow and wax pool (pool spreads as it melts)
    shadow(fr.under, *ground.p(0, 0), 24 * k * (1 + 0.9 * m), 6 * k)
    paint(fr, [ground.e(0, 2, 19 * (1 + 1.3 * m), 5.5 * (1 + 0.4 * m))], WAX_POOL, ow)

    # ---- arms
    a = pose.get("raise", 0.0)
    sw = pose.get("swing", 0.0)
    hands = []
    for i in range(2):
        rest = HUM_REST[d][i]
        tgt = HUM_UP[d][i] if a >= 0 else HUM_SLAM[d][i]
        h = lerp2(rest, tgt, abs(a))
        if d == "E":
            h = (h[0] + (-5 if i == 0 else 5) * sw, h[1])
        else:
            h = (h[0], h[1] + (3 if i == 0 else -3) * sw)
        hands.append(h)
    sh_y = 36 if crab else 40
    shoulders = {"S": ((-13, sh_y), (13, sh_y)), "N": ((-13, sh_y), (13, sh_y)),
                 "E": ((-1, sh_y), (5, sh_y))}[d]

    def arm(i, palette):
        (x0, y0), (x1, y1) = shoulders[i], hands[i]
        prims = [rig.c(x0, y0, x1, y1, 8), rig.e(x1, y1, 5, 5.5), rig.e(x1 + 0.5, y1 - 6, 1.8, 3)]
        paint(fr, prims, palette, ow)
        if boss and i == 1:  # torn sleeve on the near arm
            mx, my = lerp(x0, x1, 0.38), lerp(y0, y1, 0.38)
            paint(fr, [rig.c(x0, y0, mx, my, 9.6)], CLOTH, ow * 0.6)

    # ---- crab shell
    def shell():
        if d == "E":
            pts = [(8, 2), (18, 3), (26, 12), (27, 22), (22, 31), (14, 36), (9, 33), (10, 24), (10, 12)]
            spikes = [[(15, 34), (19, 41), (21, 32)], [(23, 27), (29, 31), (26, 21)]]
            claws = [rig.e(31, 17, 6, 4.5), rig.e(32, 11, 5, 3.4)]
            ridges = [[(15, 4), (20, 17), (17, 32)], [(21, 6), (25, 18), (21, 29)]]
        else:
            pts = [(-25, 4), (-27, 17), (-22, 28), (-11, 33), (0, 34), (11, 33), (22, 28), (27, 17), (25, 4), (12, 1), (-12, 1)]
            spikes = [[(-19, 29), (-17, 36), (-12, 31)], [(12, 31), (17, 36), (19, 29)]]
            claws = [rig.e(-30, 24, 6, 4.5), rig.e(-31, 18, 5, 3.4), rig.e(30, 24, 6, 4.5), rig.e(31, 18, 5, 3.4)]
            ridges = [[(-24, 12), (-12, 9), (0, 8), (12, 9), (24, 12)],
                      [(-22, 22), (-11, 19), (0, 18), (11, 19), (22, 22)],
                      [(-14, 29), (-7, 27.5), (0, 27), (7, 27.5), (14, 29)]]
        paint(fr, claws, SHELL, ow)
        sm = paint(fr, [rig.poly(pts)] + [rig.poly(s) for s in spikes], SHELL, ow)
        if d != "N":
            for r in ridges:
                stroke(fr, rig.pts(r), 1.5 * k, SHELL[2], 0.9, clip=sm)

    # ---- body (torso + neck + head as one melted mass)
    def body():
        hw = 13 if d == "E" else 15
        base = [(-14, 3), (16, 3), (12, 20), (-12, 20)] if d == "E" else [(-16, 3), (16, 3), (14, 20), (-14, 20)]
        prims = [rig.e(0, 24, hw, 19), rig.poly(base),
                 rig.e(headx * 0.5, head_y - 8, 8, 6), rig.e(headx, head_y, 11, 10),
                 rig.e(-hw + 0.5, 14, 2.5, 5), rig.e(hw - 1.5, 10, 2.4, 4.5),
                 rig.e(headx + 3, head_y - 12, 2, 3.5)]
        return paint(fr, prims, WAX, ow, tone=rig.tone(0, 30, 18, 32))

    def boss_details(bm):
        if d == "E":
            patch = [(-12, 22), (-12, 36), (-6, 42), (6, 42), (12, 34), (12, 22), (7, 25), (3, 20), (-2, 25), (-7, 21)]
        else:
            patch = [(-14, 22), (-15, 34), (-10, 41), (-4, 43), (4, 43), (10, 41), (15, 34), (14, 22),
                     (10, 25), (6, 21), (1, 26), (-4, 21), (-8, 25)]
        paint(fr, [rig.poly(patch)], CLOTH, ow * 0.6, clip=bm)
        if d == "S":
            paint(fr, [rig.poly([(-6, 43), (0, 37), (6, 43), (4, 45), (0, 40), (-4, 45)])], CLOTH_DARK, ow * 0.5, clip=bm)
        g = pose.get("glow", 0.0)
        cracks = CRACKS if d != "N" else [[(x * -1, y) for x, y in c] for c in CRACKS]
        for c in cracks:
            pts = rig.pts(c)
            if g > 0:
                glow(fr, [("c", *pts[i], *pts[i + 1], 3 * k) for i in range(len(pts) - 1)], GLOW, 2.5 * k, 0.75 * g)
                stroke(fr, pts, 1.7 * k, GLOW, g, clip=bm)
                stroke(fr, pts, 0.7 * k, GLOW_CORE, g, clip=bm)
            else:
                stroke(fr, pts, 1.1 * k, OUTLINE, 0.55 * (1 - m), clip=bm)

    def face():
        fa = 1 - min(1, m * 1.6)
        if fa <= 0:
            return
        dy = -6 * m
        if d == "S":
            for sxn in (-1, 1):
                flat(fr, [rig.e(headx + 4.2 * sxn, head_y + 1 + dy, 2.2, 2.9)], OUTLINE, fa)
            flat(fr, [rig.e(headx + 0.5, head_y - 4.5 + dy, 2.2, 1.3)], OUTLINE, 0.85 * fa)
        elif d == "E":
            flat(fr, [rig.e(headx + 6, head_y + 1 + dy, 1.9, 2.7)], OUTLINE, fa)
            flat(fr, [rig.e(headx + 9, head_y - 4 + dy, 1.5, 1.1)], OUTLINE, 0.85 * fa)

    def highlights():
        hx = -6 if d == "E" else -8
        flat(fr, [rig.e(headx - 4.5, head_y + 4, 3, 2)], WHITE, 0.85 * (1 - m))
        flat(fr, [rig.e(hx, 30, 2.2, 5.5)], WHITE, 0.55 * (1 - m))

    # ---- draw order per direction
    if d == "N":
        if crab:
            shell()
        arm(0, WAX)
        arm(1, WAX)
        bm = body()
        if boss:
            boss_details(bm)
        highlights()
    elif d == "E":
        arm(0, WAX_FAR)
        bm = body()
        if boss:
            boss_details(bm)
        face()
        highlights()
        arm(1, WAX)
        if crab:
            shell()
    else:
        bm = body()
        if boss:
            boss_details(bm)
        face()
        highlights()
        arm(0, WAX)
        arm(1, WAX)
        if crab:
            shell()

    # ---- boss: chunks shed by the "Bong tróc" skill
    for (x, y, r) in pose.get("chunks", []):
        paint(fr, [ground.e(x, y, r, r * 0.85)], WAX, ow * 0.8)

    # ---- boss death: the person inside shows for a moment
    rv = pose.get("reveal", 0.0)
    if rv > 0:
        prims = [ground.e(-10, 10, 5.5, 5), ground.oe(1, 8, 10, 5, -8), ground.e(11, 9, 5.5, 4.2),
                 ground.c(-4, 11, 6, 13, 3.5)]
        paint(fr, prims, HUMAN, ow * 0.6, alpha=rv)
        flat(fr, [ground.e(-11.5, 11.5, 1.6, 1.2)], WHITE, 0.7 * rv)


# ======================================================== shard (Sáp vụn)
def draw_shard(fr, cx, gy, k, d, pose):
    m = pose.get("melt", 0.0)
    sx, sy = pose.get("squash", (1.0, 1.0))
    sy *= 1 - 0.8 * m
    sx *= 1 + 0.7 * m
    ox, oy = _fwd(d, pose.get("step", 0.0))
    rig = Rig(cx, gy, k, sx, sy, rise=pose.get("bob", 0.0), ox=ox, oy=oy, ref_h=20)
    ground = Rig(cx, gy, k, ox=ox, oy=oy)
    ow = pose.get("ow", 1.6)
    tip = pose.get("tip", 0.0)
    shadow(fr.under, *ground.p(0, 0), 11 * k * (1 + 0.6 * m), 3 * k)
    if m > 0:
        paint(fr, [ground.e(0, 1.5, 10 * (1 + 1.2 * m), 3 * (1 + 0.3 * m))], WAX_POOL, ow)
    prims = [rig.e(0, 7, 10, 7.5), rig.poly([(-7, 10), (-2, 19), (1 + tip, 23), (4, 18), (7, 10)]),
             rig.e(-9, 4, 2, 3), rig.e(8.5, 3.5, 1.8, 2.6)]
    paint(fr, prims, WAX, ow, tone=rig.tone(0, 10, 10, 12))
    fa = 1 - min(1, m * 1.8)
    if d == "S":
        for s in (-1, 1):
            flat(fr, [rig.e(3.4 * s, 8, 1.5, 2)], OUTLINE, fa)
    elif d == "E":
        flat(fr, [rig.e(5.2, 8, 1.4, 2)], OUTLINE, fa)
    flat(fr, [rig.e(-4, 12, 2, 1.4)], WHITE, 0.85 * (1 - m))


# ======================================================== tiger family
def _chain_link(rig, x, y, deg):
    return [rig.oe(x, y, 2.6, 1.8, deg), ("-", rig.oe(x, y, 1.2, 0.6, deg))]


def draw_tiger(fr, cx, gy, k, d, pose, boss=False):
    m = pose.get("melt", 0.0)
    sx, sy = pose.get("squash", (1.0, 1.0))
    sy *= 1 - 0.75 * m
    sx *= 1 + 0.45 * m
    c = pose.get("crouch", 0.0)
    st = pose.get("stretch", 0.0)
    hd = pose.get("head_down", 0.0)
    hu = pose.get("head_up", 0.0)
    mo = pose.get("mouth", 0.0)
    gait = pose.get("gait", 1.0)
    a = 2 * math.pi * pose.get("phase", 0.0)
    ow = pose.get("ow", 2.0)
    ox, oy = _fwd(d, pose.get("step", 0.0))
    if d == "E":
        sx *= 1 + 0.12 * st
    rig = Rig(cx, gy, k, sx, sy, rise=pose.get("bob", 0.0) + pose.get("rise", 0.0),
              ox=ox + pose.get("shake", 0.0), oy=oy)
    ground = Rig(cx, gy, k, ox=ox, oy=oy)
    tw = math.sin(a + 1.0) * gait + pose.get("tail", 0.0)
    shadow(fr.under, *ground.p(0 if d != "E" else -4, 0), (36 if d == "E" else 22) * k * (1 + 0.4 * m),
           6 * k, 0.22 * (1 - 0.6 * min(1, pose.get("rise", 0) / 20)))
    if m > 0:
        paint(fr, [ground.e(0, 2, 24 * (1 + m), 6 * (1 + 0.4 * m))], WAX_POOL, ow)

    def leg(x0, y0, x1, y1, palette, w=8):
        paint(fr, [rig.c(x0, y0, x1, y1, w), rig.e(x1 + 1, y1 + 1, w * 0.6, w * 0.4)], palette, ow)

    def lift(ph):
        return 2.6 * max(0.0, -math.cos(ph)) * gait

    by = 24 * (1 - 0.28 * c) if d == "E" else 22 * (1 - 0.28 * c)

    if d == "E":
        hip_y = by - 4
        fx = lambda ph: 7 * math.sin(ph) * gait
        legs_far = [(16, fx(a + 0.6) + 10 * st, lift(a + 0.6)), (-22, -fx(a + 0.6 + math.pi) - 10 * st, lift(a + 0.6 + math.pi))]
        legs_near = [(18, fx(a) + 10 * st, lift(a)), (-20, -fx(a + math.pi) - 10 * st, lift(a + math.pi))]
        for x, dx, lf in legs_far:
            leg(x, hip_y, x + dx, lf, WAX_FAR, 9)
        tail = [(-33, by + 2), (-43, by + 8 + 3 * tw), (-51, by + 5 + 6 * tw)]
        paint(fr, [rig.c(*tail[0], *tail[1], 5.5), rig.c(*tail[1], *tail[2], 4.5)], WAX, ow)
        bm = paint(fr, [rig.e(-4, by, 28, 11), rig.e(14, by + 1, 13, 13), rig.e(-24, by, 12, 11.5),
                        rig.e(24, by + 6 - 6 * hd, 8, 8)],
                   WAX, ow, tone=rig.tone(-2, by, 36, 14))
        for s in ([(-14, by + 10), (-11, by + 1), (-14, by - 8)], [(-2, by + 11), (1, by + 1), (-2, by - 8)],
                  [(10, by + 12), (12, by + 4)], [(-27, by + 9), (-24, by - 1)]):
            stroke(fr, rig.pts(s), 2.3 * k, STRIPE, 0.8, clip=bm)
        flat(fr, [rig.e(-10, by + 7, 6, 1.6)], WHITE, 0.5 * (1 - m))
        for x, dx, lf in legs_near:
            leg(x, hip_y, x + dx, lf, WAX, 9.5)
        hx, hy = 32 + 2 * hd, by + 10 - 12 * hd + 5 * hu
        if boss:
            for i, (lx_, ly_) in enumerate([(22, by + 11), (24, by + 7), (26, by + 3), (27, by - 1)]):
                paint(fr, _chain_link(rig, lx_, ly_, 70 + 20 * i), CHAIN, ow * 0.6)
            sway = 2 * math.sin(a)
            for i in range(3):
                paint(fr, _chain_link(rig, 25 + sway * i * 0.5, by - 5 - 4.5 * i, 90 + 30 * (i % 2)), CHAIN, ow * 0.6)
        hm = paint(fr, [rig.e(hx, hy, 11, 9.5), rig.e(hx - 4, hy + 10, 3.5, 4), rig.e(hx + 2, hy + 10.5, 3.3, 4)],
                   WAX, ow, tone=rig.tone(hx, hy, 12, 11))
        paint(fr, [rig.e(hx + 9, hy - 4 + 4 * hu, 6.5, 5)], WAX, ow * 0.8)
        stroke(fr, rig.pts([(hx - 3, hy + 7), (hx - 1, hy + 3)]), 1.8 * k, STRIPE, 0.8, clip=hm)
        stroke(fr, rig.pts([(hx - 8, hy + 3), (hx - 5, hy - 1)]), 1.8 * k, STRIPE, 0.8, clip=hm)
        if mo > 0:
            flat(fr, [rig.e(hx + 10, hy - 8 + 4 * hu, 5, 3.6 * mo)], OUTLINE)
            flat(fr, [rig.poly([(hx + 7, hy - 6 + 4 * hu), (hx + 8, hy - 8 + 4 * hu), (hx + 9, hy - 6 + 4 * hu)])], WHITE, mo)
        flat(fr, [rig.oe(hx + 4, hy + 2, 2.1, 1.3, -12)], OUTLINE, 1 - m)
        flat(fr, [rig.e(hx + 14.5, hy - 2.5 + 4 * hu, 1.6, 1.3)], OUTLINE, 1 - m)
        flat(fr, [rig.e(hx - 3, hy + 5, 3, 1.6)], WHITE, 0.8 * (1 - m))
        if boss:
            for s in ([(10, by + 9), (16, by + 2)], [(13, by + 10), (19, by + 3)], [(16, by + 10), (21, by + 4)]):
                stroke(fr, rig.pts(s), 2.2 * k, OUTLINE, 0.7, clip=bm)
                stroke(fr, rig.pts(s), 1.0 * k, SCAR, 1, clip=bm)
            s = [(hx + 1, hy + 7), (hx + 7, hy - 3)]
            stroke(fr, rig.pts(s), 2.0 * k, OUTLINE, 0.7, clip=hm)
            stroke(fr, rig.pts(s), 0.9 * k, SCAR, 1, clip=hm)
        return

    # front / back views
    phs = [a, a + math.pi]
    if d == "S":
        for i, s in enumerate((-1, 1)):
            leg(14 * s, by - 6, 14 * s, 2 + lift(phs[1 - i]), WAX_FAR, 9)
        bm = paint(fr, [rig.e(0, by + 9, 14, 8), rig.e(0, by - 2, 19, 12)], WAX, ow, tone=rig.tone(0, by + 3, 20, 18))
        flat(fr, [rig.e(-9, by + 2, 3, 4)], WHITE, 0.5 * (1 - m))
        for i, s in enumerate((-1, 1)):
            leg(9 * s, by - 6, 9 * s, lift(phs[i]), WAX, 10)
        hy = by + 7 - 8 * hd + 6 * hu
        if boss:
            for i in range(7):
                t = i / 6
                paint(fr, _chain_link(rig, lerp(-12, 12, t), hy - 9 - 3 * math.sin(math.pi * t), 0 if i % 2 else 90), CHAIN, ow * 0.6)
            sway = 1.5 * math.sin(a)
            for i in range(3):
                paint(fr, _chain_link(rig, 6 + sway * i * 0.4, hy - 14 - 4.5 * i, 90 if i % 2 else 0), CHAIN, ow * 0.6)
        hm = paint(fr, [rig.e(0, hy, 15, 12), rig.e(-12.5, hy - 3, 5.5, 4.5), rig.e(12.5, hy - 3, 5.5, 4.5),
                        rig.e(-10.5, hy + 10, 3.6, 3.6), rig.e(10.5, hy + 10, 3.6, 3.6)],
                   WAX, ow, tone=rig.tone(0, hy + 2, 16, 14))
        for s in (-1, 1):
            flat(fr, [rig.e(10.5 * s, hy + 10, 1.6, 1.6)], STRIPE, 0.8)
        paint(fr, [rig.e(-3.4, hy - 5.5 + 3 * hu, 4.2, 3.6), rig.e(3.4, hy - 5.5 + 3 * hu, 4.2, 3.6)], WAX, ow * 0.7)
        for s in ([(-4, hy + 11), (-2.5, hy + 6)], [(0, hy + 12), (0, hy + 7)], [(4, hy + 11), (2.5, hy + 6)],
                  [(-15, hy), (-10, hy - 1)], [(-15, hy - 4), (-10, hy - 4)], [(15, hy), (10, hy - 1)], [(15, hy - 4), (10, hy - 4)]):
            stroke(fr, rig.pts(s), 1.7 * k, STRIPE, 0.85, clip=hm)
        if mo > 0:
            flat(fr, [rig.e(0, hy - 10 + 3 * hu, 4.8, 3.4 * mo)], OUTLINE)
            for s in (-1, 1):
                flat(fr, [rig.poly([(2.6 * s - 0.8, hy - 8 + 3 * hu), (2.6 * s, hy - 10.5 + 3 * hu), (2.6 * s + 0.8, hy - 8 + 3 * hu)])], WHITE, mo)
        for s in (-1, 1):
            flat(fr, [rig.oe(6 * s, hy + 3, 2.4, 1.3, -18 * s)], OUTLINE, 1 - m)
        flat(fr, [rig.poly([(-2.2, hy - 2 + 3 * hu), (2.2, hy - 2 + 3 * hu), (0, hy - 4.2 + 3 * hu)])], OUTLINE, 1 - m)
        flat(fr, [rig.e(-6, hy + 6, 3, 1.6)], WHITE, 0.8 * (1 - m))
        if boss:
            for s in ([(5, hy + 9), (9, hy - 1)], [(-15, by + 2), (-9, by - 6)], [(-12, by + 4), (-6, by - 4)]):
                stroke(fr, rig.pts(s), 2.0 * k, OUTLINE, 0.7, clip=hm if s[0][1] > by + 6 else bm)
                stroke(fr, rig.pts(s), 0.9 * k, SCAR, 1, clip=hm if s[0][1] > by + 6 else bm)
        return

    # d == "N"
    for s in (-1, 1):
        leg(13 * s, by - 4, 13 * s, 3, WAX_FAR, 9)
    paint(fr, [rig.e(0, by + 16 - 8 * hd + 4 * hu, 10, 8), rig.e(-7, by + 23 - 8 * hd + 4 * hu, 3.5, 4),
               rig.e(7, by + 23 - 8 * hd + 4 * hu, 3.5, 4)], WAX_FAR, ow)
    if boss:
        for i in range(5):
            t = i / 4
            paint(fr, _chain_link(rig, lerp(-9, 9, t), by + 11 + 1.5 * math.sin(math.pi * t), 0 if i % 2 else 90), CHAIN, ow * 0.6)
    bm = paint(fr, [rig.e(0, by + 8, 15, 10), rig.e(0, by - 1, 17, 13)], WAX, ow, tone=rig.tone(0, by + 2, 18, 18))
    for yy in (by + 10, by + 3, by - 5):
        stroke(fr, rig.pts([(-14, yy), (-7, yy - 2), (0, yy - 2.5), (7, yy - 2), (14, yy)]), 2.2 * k, STRIPE, 0.8, clip=bm)
    if boss:
        for s in ([(-12, by + 6), (-6, by - 2)], [(8, by + 8), (13, by)]):
            stroke(fr, rig.pts(s), 2.0 * k, OUTLINE, 0.7, clip=bm)
            stroke(fr, rig.pts(s), 0.9 * k, SCAR, 1, clip=bm)
    flat(fr, [rig.e(-7, by + 6, 4, 2)], WHITE, 0.5 * (1 - m))
    for i, s in enumerate((-1, 1)):
        leg(10 * s, by - 6, 10 * s, lift(phs[i]), WAX, 10)
    paint(fr, [rig.c(0, by + 2, 8 + 2 * tw, by + 4, 5.5), rig.c(8 + 2 * tw, by + 4, 13 + 3 * tw, by + 13, 4.5)], WAX, ow)


# ======================================================== VFX
def draw_pounce_target(fr, cx, cy, pose):
    """Red landing marker under the Alpha Tiger's pounce (blinks)."""
    s = pose.get("scale", 1.0)
    al = pose.get("alpha", 1.0)
    rx, ry = 40 * s, 20 * s
    ring = [("e", cx, cy, rx, ry), ("-", ("e", cx, cy, rx - 4, ry - 3))]
    paint(fr, ring, (RED, RED, RED), 1.5, alpha=al)
    for dx in (-1, 1):
        paint(fr, [("c", cx - 9 * dx, cy - 6, cx + 9 * dx, cy + 6, 4)], (RED, RED, RED), 1.5, alpha=al)
