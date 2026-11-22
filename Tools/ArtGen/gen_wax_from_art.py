#!/usr/bin/env python3
"""Build in-game wax sprite sheets from the AI concept art (v3).

Each creature has one finished illustration in Tools/ArtGen/source/wax/
(drawn with ChatGPT to match the tower and map style, background removed).
This script turns that single picture into the same sheets the game already
expects, by animating the picture itself: squash and stretch, lean, lunge,
white hit flash, a melt for death, and glows/shakes for boss skills.

Sheet layout is unchanged (see Assets/Art/Wax/README.md):
    row 0 = S, row 1 = E, row 2 = N; W = E with flipX; columns = frames.
Interim: every creature has only one view, so all three rows use the same
picture. When side and back views are drawn, drop them in as
source/wax/<name>_e.png and <name>_n.png and run this again.

Usage (repo root):
    python3 Tools/ArtGen/gen_wax_from_art.py               # all creatures
    python3 Tools/ArtGen/gen_wax_from_art.py --only Tiger,Lens
"""
import argparse
import math
import os

import numpy as np

import wax_rigs
from PIL import Image, ImageChops, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(HERE, "source", "wax")
ART = os.path.join(ROOT, "Assets", "Art", "Wax")
SS = 3              # work at 3x the cell size, then downsample
FEET = 0.875        # feet line, from the top of the cell (pivot y = 0.125)
DIRS = ["S", "E", "N"]
TAU = 2 * math.pi

# name: (folder, source file, cell px, fit, size in cell px, front_facing)
#   fit "h" = target height, "w" = target width (wide beasts)
#   front_facing: True for creatures drawn facing the viewer, False for the
#   3/4 side-facing beasts (their picture already faces right = E row).
UNITS = {
    "Standard":   ("Standard",   "wax_standard",    160, "h", 104, True),
    "Shard":      ("Shard",      "wax_shard",        64, "h", 40,  True),
    "Crab":       ("Crab",       "wax_crab",        128, "h", 100, True),
    "Tiger":      ("Tiger",      "wax_tiger",       128, "w", 106, False),
    "TigerCub":   ("TigerCub",   "wax_tiger_cub",    64, "w", 52,  False),
    "Healer":     ("Healer",     "wax_healer",      128, "h", 110, True),
    "Spore":      ("Spore",      "wax_spore",       128, "h", 106, True),
    "Lens":       ("Lens",       "wax_lens",        128, "h", 108, True),
    "Mirror":     ("Mirror",     "wax_mirror",      128, "h", 108, True),
    "Ultimate":   ("Ultimate",   "wax_ultimate",    192, "w", 168, True),
    "Frenzy":     ("Frenzy",     "wax_frenzy",      128, "w", 106, False),
    "Primordial": ("Primordial", "wax_primordial",  256, "h", 210, True),
    "AlphaTiger": ("AlphaTiger", "wax_alpha_tiger", 256, "w", 212, False),
    "MotherTree": ("MotherTree", "wax_mother_tree", 256, "h", 222, True),
    "Prism":      ("Prism",      "wax_prism",       256, "h", 214, True),
    "Myriad":     ("Myriad",     "wax_myriad",      256, "w", 232, True),
}
BOSSES = {"Primordial", "AlphaTiger", "MotherTree", "Prism", "Myriad"}


# ------------------------------------------------------------- frame maker
def load(name, view):
    for cand in (f"{name}_{view.lower()}.png", f"{name}.png"):
        p = os.path.join(SRC, cand)
        if os.path.exists(p):
            im = Image.open(p).convert("RGBA")
            im = im.crop(im.getbbox())
            return wax_rigs.crimson(im) if name == "wax_frenzy" else im
    raise FileNotFoundError(name)


def fit_scale(w, h, cell, fit, size):
    s = (size * SS) / (h if fit == "h" else w)
    if fit == "w" and h * s > cell * SS * 0.86:  # never taller than the cell allows
        s = cell * SS * 0.86 / h
    return s


def fitted(im, cell, fit, size):
    s = fit_scale(im.width, im.height, cell, fit, size)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def tint(im, color, k):
    if k <= 0:
        return im
    r, g, b, a = im.split()
    flat = Image.new("RGB", im.size, color)
    rgb = Image.blend(Image.merge("RGB", (r, g, b)), flat, min(1.0, k))
    return Image.merge("RGBA", (*rgb.split(), a))


def glow_layer(im, color, k, radius):
    """Soft halo around the creature (skill warnings)."""
    a = im.split()[3].filter(ImageFilter.GaussianBlur(radius))
    a = a.point(lambda v: int(v * k))
    layer = Image.new("RGBA", im.size, color + (0,))
    layer.putalpha(a)
    return layer


def fit_inside(layer, W, cx, fy, margin=0.02):
    """Shrink a frame about the feet point so nothing touches the cell edge."""
    a = np.asarray(layer.split()[3])
    ys, xs = np.nonzero(a > 8)
    if not len(xs):
        return layer
    m = W * margin
    lim = [(cx - m) / max(1e-6, cx - xs.min()), (W - m - cx) / max(1e-6, xs.max() + 1 - cx),
           (fy - m) / max(1e-6, fy - ys.min())]
    if ys.max() + 1 > fy:
        lim.append((W - m - fy) / max(1e-6, ys.max() + 1 - fy))
    k = min([1.0] + [v for v in lim if v > 0])
    if k >= 0.999:
        return layer
    w2, h2 = max(1, round(W * k)), max(1, round(W * k))
    small = layer.resize((w2, h2), Image.LANCZOS)
    out = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    out.paste(small, (round(cx - cx * k), round(fy - fy * k)), small)
    return out


def frame(base, cell, p, feet_pad=0):
    """Render one frame. p keys (all optional):
    sx, sy   scale about the feet       rot   degrees, + leans forward (right)
    dx, dy   offset in cell px (+dy up) flash white flash 0..1
    alpha    fade                        melt  0..1 (flatten into a puddle)
    tintc, tintk  colour wash            glow  (r,g,b,k) halo
    shake    px jitter (x)
    """
    W = cell * SS
    m = p.get("melt", 0.0)
    sx = p.get("sx", 1.0) * (1 + 0.55 * m)
    sy = p.get("sy", 1.0) * (1 - 0.88 * m)
    im = base
    w, h = max(1, round(im.width * sx)), max(1, round(im.height * sy))
    im = im.resize((w, h), Image.LANCZOS)
    im = tint(im, p.get("tintc", (255, 170, 70)), p.get("tintk", 0.0))
    im = tint(im, (255, 255, 255), p.get("flash", 0.0))
    if p.get("rot"):
        # rotate about the feet (bottom centre)
        pad = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
        pad.alpha_composite(im, (w // 2, 0))
        pad = pad.rotate(-p["rot"], resample=Image.BICUBIC, center=(w, h))
        bb = pad.getbbox()
        im = pad.crop(bb)
        feet_x, feet_y = w - bb[0], h - bb[1]  # feet = rotation centre
    else:
        feet_x, feet_y = im.width / 2, im.height
    canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    # soft ground shadow
    sh = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(sh)
    cx, fy = W / 2, W * FEET
    rx = min((base.width - 2 * feet_pad) * 0.42 * (1 + 0.5 * m), W * 0.42)
    d.ellipse([cx - rx, fy - rx * 0.16, cx + rx, fy + rx * 0.16], fill=(44, 34, 64, 70))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(SS * 1.5)))
    x = round(cx - feet_x + (p.get("dx", 0) + p.get("shake", 0)) * SS)
    y = round(fy + (base.height - feet_pad) * 0.04 - feet_y - p.get("dy", 0) * SS)
    if p.get("glow"):
        r, g, b, k = p["glow"]
        pad = SS * 12
        big = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
        big.paste(im, (pad, pad), im)
        gl = glow_layer(big, (r, g, b), k, SS * 4)
        gcan = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        gcan.paste(gl, (x - pad, y - pad), gl)
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    layer.paste(im, (x, y), im)
    if p.get("glow"):
        layer = Image.alpha_composite(gcan, layer)
        canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(SS * 1.5)))
    layer = fit_inside(layer, W, cx, fy)
    canvas = Image.alpha_composite(canvas, layer)
    a = p.get("alpha", 1.0)
    if a < 1:
        canvas.putalpha(canvas.split()[3].point(lambda v: int(v * a)))
    return canvas.resize((cell, cell), Image.LANCZOS)


# ------------------------------------------------------------- animations
WALK_N = 8


def walk(front, amp=1.0):
    amp *= 0.12  # arms (people) and legs (beasts) carry the walk; the body stays put
    out = []
    for i in range(WALK_N):
        t = TAU * i / WALK_N
        b = abs(math.sin(t))
        out.append(dict(sy=1 + 0.035 * amp * b, sx=1 - 0.02 * amp * b, dy=1.5 * amp * b))
    return out


def attack():
    seq = [(1, 1, 0, 0), (0.96, 1.06, -6, -1), (0.94, 1.09, -9, -2), (1.1, 0.9, 10, 4), (1.06, 0.94, 7, 3), (1, 1, 2, 1)]
    return [dict(sx=a, sy=b, rot=r, dx=x) for a, b, r, x in seq]


def hit():
    return [dict(flash=0.65, sx=1.06, sy=0.93, dx=-1.5, rot=-3), dict(flash=0.25)]


def die(n=6):
    ms = [0.12, 0.3, 0.5, 0.7, 0.88, 1.0] if n == 6 else [0.1, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1.0]
    al = [1] * (n - 2) + [0.85, 0.55]
    return [dict(melt=m, alpha=a, flash=0.25 if i == 0 else 0, tintc=(255, 210, 140), tintk=0.25 * m)
            for i, (m, a) in enumerate(zip(ms, al))]


def pulse_glow(color, n=8, hold=4, shake=0.0):
    """Warning glow that builds over the first `hold` frames, then fades."""
    ks = [0.25, 0.55, 0.85, 1.0, 0.6, 0.3, 0.1, 0][:n]
    return [dict(glow=color + (0.9 * k,), tintc=color, tintk=0.28 * k, shake=shake * (1 if i % 2 else -1) * k,
                 sx=1 + 0.02 * k, sy=1 - 0.015 * k) for i, k in enumerate(ks)]


SKILLS = {
    "Primordial": [("shed", pulse_glow((255, 150, 50), shake=1.2), 8, False,
                    "Bong tróc: frame 0-3 vết nứt rực cam (lặp 0-3 cho đủ 3 giây cảnh báo), 4-7 nổ ra; code thả 8–10 Sáp vụn ở frame 4")],
    "AlphaTiger": [
        ("crouch", [dict(sy=0.9, sx=1.06, shake=s, glow=(255, 70, 60, 0.35)) for s in (0.8, -0.8, 0.8, -0.8)], 8, True,
         "Vồ – cảnh báo: cúi người rung, lặp trong 2 giây"),
        ("pounce", [dict(sy=0.88, sx=1.08), dict(sy=1.08, sx=0.95, dy=6, rot=-6), dict(sy=1.1, sx=0.93, dy=12, rot=-9),
                    dict(sy=1.08, sx=0.95, dy=15, rot=-4), dict(sy=0.95, sx=1.05, dy=6, rot=6), dict(sy=0.9, sx=1.08)], 10, False,
         "Vồ – bật nhảy; code dời vị trí theo cung, sprite chỉ nhấc thân"),
        ("headbutt", [dict(), dict(rot=8, dx=-1, sy=0.96), dict(rot=12, dx=-2, sy=0.94), dict(rot=14, dx=8, sx=1.08),
                      dict(rot=9, dx=10, sx=1.05), dict(rot=3, dx=2)], 10, False,
         "Húc tường – frame 1-2 cúi đầu (giữ 1,5 giây), frame 3 = lúc trúng"),
        ("roar", [dict(), dict(rot=-4, sy=1.03), dict(rot=-7, sy=1.06, sx=1.03, shake=1), dict(rot=-7, sy=1.06, sx=1.03, shake=-1),
                  dict(rot=-5, sy=1.04, shake=1), dict(rot=-2)], 8, False, "Gọi bầy – gầm, code triệu hồi 4–6 hổ con ở frame 3"),
    ],
    "MotherTree": [
        ("seed", pulse_glow((150, 255, 120)), 8, False,
         "Gieo hạt: frame 0-3 quả hạt nhấp nháy (cảnh báo), 4-7 thả 4–6 hạt; code đặt hạt ở frame 4"),
        ("heal_aura", [dict(glow=(140, 255, 120, k)) for k in (0.35, 0.6, 0.35, 0.15)], 6, True,
         "Rễ nuôi: vòng xanh luôn bật, lặp"),
    ],
    "Prism": [
        ("focus", pulse_glow((255, 245, 200), shake=0.6), 8, False,
         "Hội tụ: frame 0-3 nạp tia 5 giây (lặp 2-3), lõi sáng = đang nhận gấp đôi sát thương; frame 4 bắn"),
    ],
    "Myriad": [
        ("myriad", pulse_glow((255, 120, 60), shake=1.5), 8, False,
         "Vạn người: các khuôn mặt gào, rung mạnh; code sinh bầy ở frame 4"),
        ("last_heart", [dict(glow=(255, 200, 80, k), tintc=(120, 80, 60), tintk=0.35, shake=s)
                        for k, s in ((0.5, 1), (0.9, -1), (0.5, 1), (0.9, -1))], 8, True,
         "Trái tim cuối cùng (10% máu): vỏ hóa cứng sẫm lại, tim rực sáng, lặp"),
    ],
    "Healer": [("heal", [dict(glow=(140, 255, 120, k), sy=1 + 0.02 * k) for k in (0.2, 0.5, 0.8, 0.5)], 6, True,
                "Đứng yên hồi máu (vùng xanh), lặp trong lúc hồi")],
    "Lens": [("focus", pulse_glow((255, 245, 200), n=6), 6, False, "Hội tụ 5 giây: lõi sáng dần; frame 3 = bắn tia")],
    "Frenzy": [("howl", [dict(), dict(rot=-5, sy=1.04), dict(rot=-8, sy=1.07, glow=(255, 150, 60, 0.5), shake=1),
                         dict(rot=-8, sy=1.07, glow=(255, 150, 60, 0.5), shake=-1), dict(rot=-4), dict()], 10, False,
                "Gào: tăng tốc đồng loại xung quanh ở frame 2")],
}

INFO = {
    "Standard": ("Bậc 1 – Dị Thể Sáp tiêu chuẩn", "Bản đồ 1 (từ ngày 1), còn ở mọi bản đồ sau"),
    "Shard": ("Sáp vụn (biến thể bậc 1)", "Bản đồ 1 (từ ngày 3–4), đi theo bầy 10–20 con"),
    "Crab": ("Sáp vỏ cua (biến thể bậc 1)", "Bản đồ 2 (từ giữa bản đồ)"),
    "Tiger": ("Bậc 2 – Dị Thể Sáp hổ", "Bản đồ 2 (từ ngày 3), còn ở bản đồ 3–5"),
    "TigerCub": ("Hổ con", "Bản đồ 2 – trùm Hổ Sáp Đầu Đàn gọi ra"),
    "Healer": ("Bậc 3 – Dị Thể Sáp hồi phục", "Bản đồ 3 (từ ngày 3), còn ở bản đồ 4–5"),
    "Spore": ("Sáp bào tử (biến thể bậc 3)", "Bản đồ 3 (từ giữa bản đồ)"),
    "Lens": ("Bậc 4 – Dị Thể Sáp thấu kính", "Bản đồ 4 (từ ngày 3), còn ở bản đồ 5"),
    "Mirror": ("Sáp gương (biến thể bậc 4)", "Bản đồ 4 (từ giữa bản đồ)"),
    "Ultimate": ("Bậc 5 – Dị Thể Sáp tối thượng", "Bản đồ 5 (từ ngày 3)"),
    "Frenzy": ("Sáp kích động (biến thể bậc 2)", "Bản đồ 5 (từ giữa bản đồ)"),
    "Primordial": ("Trùm 1 – Sáp Nguyên Thủy", "Bản đồ 1, ngày 8"),
    "AlphaTiger": ("Trùm 2 – Hổ Sáp Đầu Đàn", "Bản đồ 2, ngày 10"),
    "MotherTree": ("Trùm 3 – Cây Sáp Mẹ", "Bản đồ 3, ngày 12"),
    "Prism": ("Trùm 4 – Lăng Kính Sống", "Bản đồ 4, ngày 12"),
    "Myriad": ("Trùm 5 – Khối Sáp Vạn Người", "Bản đồ 5, ngày 15"),
}


def anims_for(name, front):
    boss = name in BOSSES
    slow = name in ("Crab", "Ultimate", "Primordial", "MotherTree", "Myriad", "Prism")
    fast = name in ("Tiger", "TigerCub", "Frenzy", "AlphaTiger")
    walk_fps = 6 if slow else (14 if fast else 8)
    out = [("walk", walk(front, 0.7 if slow else 1.0), walk_fps, True, "đi; giọt sáp và thân nhún theo bước"),
           ("attack", attack(), 8 if boss else 12, False, "lấy đà rồi lao tới; frame 3 = lúc trúng"),
           ("hit", hit(), 12, False, "nháy trắng, nảy lùi"),
           ("die", die(8 if boss else 6), 10 if boss else 14, False, "tan chảy thành vũng (< 0,5 giây với quái thường)")]
    return out + SKILLS.get(name, [])


def sheet(rows):
    cw, ch = rows[0][0].size
    out = Image.new("RGBA", (cw * max(len(r) for r in rows), ch * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            out.paste(im, (c * cw, r * ch))
    return out


# Creatures with AI-drawn key poses (source/wax/<src>_kp1..4.png, same scale as
# the base picture): kp1 / kp2 = walk contact left / right, kp3 = attack
# wind-up, kp4 = attack strike. Frames between keys are bob/squash holds.
KEYPOSES = {"Standard"}


def centred_on_base(im):
    """Pad sideways so the creature's base (bottom quarter) is centred: arms
    reaching out to one side must not slide the body between frames."""
    a = np.asarray(im)[..., 3] > 40
    low = a[int(a.shape[0] * 0.75):]
    xs = np.nonzero(low.any(axis=0))[0]
    cx = (xs.min() + xs.max()) / 2 if len(xs) else im.width / 2
    half = int(max(cx, im.width - cx)) + 2
    out = Image.new("RGBA", (half * 2, im.height), (0, 0, 0, 0))
    out.paste(im, (int(half - cx), 0))
    return out


def keypose_anims(name, src, cell, fit, size):
    base = load(src, "S")
    s = fit_scale(base.width, base.height, cell, fit, size)
    kp = {}
    for i in range(1, 5):
        im = Image.open(os.path.join(SRC, f"{src}_kp{i}.png")).convert("RGBA")
        im = centred_on_base(im.crop(im.getbbox()))
        kp[i] = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    b = centred_on_base(base)
    kp[0] = b.resize((max(1, round(b.width * s)), max(1, round(b.height * s))), Image.LANCZOS)
    # walk: contact, down, passing, up  x2 (left / right)
    # one walking pose only: alternating left/right drawings made the body flip
    # from side to side, so the cycle is a plain down/up bob on pose 1
    walk = [(1, dict(sy=s_y, sx=s_x, dy=d_y)) for s_y, s_x, d_y in
            ((1.0, 1.0, 0), (0.98, 1.015, -0.5), (0.96, 1.03, -1), (0.98, 1.015, -0.5),
             (1.0, 1.0, 0), (1.015, 0.99, 0.8), (1.03, 0.98, 1.5), (1.015, 0.99, 0.8))]
    attack = [(1, dict()), (3, dict(sy=0.97, sx=1.02)), (3, dict(sy=1.03, sx=0.98, dy=1)),
              (4, dict(sy=0.94, sx=1.06)), (4, dict(sy=0.97, sx=1.03)), (1, dict())]
    hit_ = [(1, p) for p in hit()]
    die_ = [(1, p) for p in die(6)]
    return kp, [("walk", walk, 8, True, "đi: một tư thế bước (AI vẽ), nhịp hạ người / nhấc người"),
                ("attack", attack, 12, False, "đánh: lấy đà giơ tay (AI vẽ) → đập xuống (AI vẽ); frame 3 = lúc trúng"),
                ("hit", hit_, 12, False, "nháy trắng, nảy lùi"),
                ("die", die_, 14, False, "tan chảy thành vũng")]


def rig_walk_frames(src, cell, fit, size, n=8):
    """Walk frames from the base picture bent by its rig (arms / legs move)."""
    raw = load(src, "S")
    rig = wax_rigs.RIGS.get(src, [])
    box = wax_rigs.ref_box(raw)
    s = fit_scale(raw.width, raw.height, cell, fit, size)
    out = []
    for i in range(n):
        img = wax_rigs.warp(raw, rig, TAU * i / n, 1.0, box=box)
        out.append(img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS))
    return out, 60 * s


def build_keyposes(name):
    folder, src, cell, fit, size, front = UNITS[name]
    kp, anims = keypose_anims(name, src, cell, fit, size)
    walk_imgs, pad = rig_walk_frames(src, cell, fit, size)
    out_dir = os.path.join(ART, folder)
    os.makedirs(out_dir, exist_ok=True)
    entries = []
    for anim, seq, fps, loop, note in anims:
        if anim == "walk":
            rows = [[frame(im, cell, {}, feet_pad=pad) for im in walk_imgs] for d in DIRS]
            seq = walk_imgs
            note = "đi: hai tay dài vung ngược nhau, đầu gật nhẹ, thân đứng yên"
        else:
            rows = [[frame(kp[k], cell, dict(p, rot=p.get("rot", 0) * (1 if d != "N" else -1))) for k, p in seq] for d in DIRS]
        img = sheet(rows)
        fname = f"{src}_{anim}.png"
        img.save(os.path.join(out_dir, fname), optimize=True)
        entries.append((fname, len(seq), fps, loop, note))
        print(f"Wax/{folder}/{fname}  {img.size[0]}x{img.size[1]}")
    write_readme(name, entries)


def build(name):
    if name in KEYPOSES and os.path.exists(os.path.join(SRC, f"{UNITS[name][1]}_kp1.png")):
        return build_keyposes(name)
    folder, src, cell, fit, size, front = UNITS[name]
    rig = wax_rigs.RIGS.get(src, [])
    raws = {}
    for d in DIRS:
        try:
            im = load(src, d)
        except FileNotFoundError:
            im = load(src, "S")
        raws[d] = im
    out_dir = os.path.join(ART, folder)
    os.makedirs(out_dir, exist_ok=True)
    entries = []
    cache = {}

    def posed(d, t, gain):
        key = (d, round(t, 4), gain)
        if key not in cache:
            raw = raws[d]
            box = wax_rigs.ref_box(raw)
            img = wax_rigs.warp(raw, rig, t, gain, box=box) if (rig and gain > 0) else \
                wax_rigs.warp(raw, [], 0, 0, box=box)
            ref_w, ref_h = raw.width, raw.height
            s = fit_scale(ref_w, ref_h, cell, fit, size)
            cache[key] = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
        return cache[key]

    for anim, poses, fps, loop, note in anims_for(name, front):
        n = len(poses)
        gain = {"walk": 1.0, "hit": 0.3, "die": 0.0}.get(anim, 0.5)
        rows = []
        for d in DIRS:
            row = []
            for i, p in enumerate(poses):
                base = posed(d, TAU * i / n, gain)
                row.append(frame(base, cell, dict(p, rot=p.get("rot", 0) * (1 if d != "N" else -1)), feet_pad=60 * fit_scale(raws[d].width, raws[d].height, cell, fit, size)))
            rows.append(row)
        img = sheet(rows)
        fname = f"{src}_{anim}.png"
        img.save(os.path.join(out_dir, fname), optimize=True)
        entries.append((fname, n, fps, loop, note))
        print(f"Wax/{folder}/{fname}  {img.size[0]}x{img.size[1]}")
    write_readme(name, entries)


def write_readme(name, entries):
    folder, src, cell, fit, size, front = UNITS[name]
    title, where = INFO[name]
    lines = [f"# {title} ({folder})", "", f"Xuất hiện: {where}", "",
             "## Hình",
             f"- Hình gốc: `Tools/ArtGen/source/wax/{src}.png` – vẽ bằng AI (ChatGPT) theo style tháp và bản đồ của game "
             "(viền tím than `#2c2240`, tô bóng hoạt hình, ánh sáng từ trên bên trái), đã tách nền",
             "- Animation dựng từ chính hình đó bằng `Tools/ArtGen/gen_wax_from_art.py`: nhún, nghiêng, lao tới, nháy trắng, "
             "tan chảy, phát sáng cho kỹ năng",
             "- **Tạm thời** 3 hàng hướng dùng chung một hình"
             + (" nhìn thẳng" if front else " nhìn nghiêng quay phải")
             + ". Khi có hình nhìn ngang/nhìn sau: thêm `"
             + f"{src}_e.png` / `{src}_n.png` vào `Tools/ArtGen/source/wax/` rồi chạy lại script", "",
             "## File", "", "| File | Bố cục | fps | Lặp | Ghi chú |", "|---|---|---|---|---|"]
    for fname, n, fps, loop, note in entries:
        lines.append(f"| `{fname}` | 3 hàng (S, E, N) × {n} frame | {fps} | {'có' if loop else 'không'} | {note} |")
    lines += ["", "## Thông số Unity",
              f"- Ô sprite {cell}×{cell}, Pixels Per Unit = 128 (1 ô xây = 1 unit)",
              f"- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô {int(cell * 0.125)} px",
              "- Hàng 0 = S, hàng 1 = E, hàng 2 = N; hướng W dùng hàng E + flipX",
              "- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. "
              "Đổi kích thước ô thì chạy Tools > Units > Reapply Sprite Import Settings",
              "- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite", "",
              f"Dựng lại: `python3 Tools/ArtGen/gen_wax_from_art.py --only {name}`", ""]
    with open(os.path.join(ART, folder, "README.md"), "w") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    only = [s for s in a.only.split(",") if s]
    for name in UNITS:
        if not only or name in only:
            build(name)


if __name__ == "__main__":
    main()
