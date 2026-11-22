#!/usr/bin/env python3
"""Build the in-game wax (Dị Thể Sáp) sprite sheets from DRAWN pose sheets.

Every animation frame is a real drawing. Nothing is bent or warped: the only
things this script adds between drawings are holds and small whole-pose moves
(bob, lunge, recoil, squash on impact, white flash, fade).

Input: Tools/ArtGen/source/wax_poses/<name>.png, one per creature, drawn on a
flat green background (~#00FF00) as a grid with 4 columns:
    row 1  WALK    1-4  contact, passing, opposite contact, passing
    row 2  ATTACK  1-4  anticipation, wind-up peak, strike / impact, recovery
    row 3  HIT (1 drawing), then DIE 1-3 (melting stages)
    row 4  SKILL drawings (optional; one 4-step skill or up to four
           one-drawing skills, see SKILLS below)
All poses are drawn at the same scale.

Output (same contract as before, see Assets/Editor/UnitSpriteImporter.cs):
    Assets/Art/Wax/<Folder>/wax_<name>_<anim>.png   3 rows (S, E, N) x frames
    Assets/Art/Wax/<Folder>/README.md
    Assets/Art/Wax/anim_manifest.json                frame counts, fps, impact
Cell size per creature comes from UNITS; the feet sit on the pivot
(0.5, 0.125). S = the drawing facing down-left, E = its mirror (facing right),
N = same as S (there is no back view); W = E with flipX in the engine.

Usage (repo root):
    python3 Tools/ArtGen/build_wax_from_poses.py                    # every sheet found
    python3 Tools/ArtGen/build_wax_from_poses.py --only Standard,Tiger
    python3 Tools/ArtGen/build_wax_from_poses.py --preview /tmp/prev   # + contact strips and GIFs
    python3 Tools/ArtGen/build_wax_from_poses.py --dry --preview /tmp/prev   # do not touch Assets
Needs Python 3 with Pillow, numpy, scipy.
"""
import argparse
import glob
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
POSES = os.path.join(HERE, "source", "wax_poses")
ART = os.path.join(ROOT, "Assets", "Art", "Wax")
SS = 3                 # frames are composed at 3x the cell, then downsampled
FEET = 0.875           # feet line from the top of the cell (pivot y = 0.125)
MARGIN = 2             # px kept free at every cell edge
ROWS = ["S", "E", "N"]

# name: (folder, file prefix, pose sheet, cell px, fit, in-game size px)
#   fit "h" = `size` is the height of the walk pose, "w" = its width.
#   Cell sizes must match Assets/Editor/UnitSpriteImporter.cs.
UNITS = {
    "Standard":   ("Standard",   "wax_standard",    "standard",    160, "h", 104),
    "Shard":      ("Shard",      "wax_shard",       "shard",        64, "h", 40),
    "Crab":       ("Crab",       "wax_crab",        "crab",        128, "h", 100),
    "Tiger":      ("Tiger",      "wax_tiger",       "tiger",       128, "w", 106),
    "TigerCub":   ("TigerCub",   "wax_tiger_cub",   "tiger_cub",    64, "w", 52),
    "Healer":     ("Healer",     "wax_healer",      "healer",      128, "h", 110),
    "Spore":      ("Spore",      "wax_spore",       "spore",       128, "h", 106),
    "Lens":       ("Lens",       "wax_lens",        "lens",        128, "h", 108),
    "Mirror":     ("Mirror",     "wax_mirror",      "mirror",      128, "h", 108),
    "Ultimate":   ("Ultimate",   "wax_ultimate",    "ultimate",    192, "w", 168),
    "Frenzy":     ("Frenzy",     "wax_frenzy",      "frenzy",      128, "w", 106),
    "Primordial": ("Primordial", "wax_primordial",  "primordial",  256, "h", 210),
    "AlphaTiger": ("AlphaTiger", "wax_alpha_tiger", "alpha_tiger", 256, "w", 212),
    "MotherTree": ("MotherTree", "wax_mother_tree", "mother_tree", 256, "h", 222),
    "Prism":      ("Prism",      "wax_prism",       "prism",       256, "h", 214),
    "Myriad":     ("Myriad",     "wax_myriad",      "myriad",      256, "w", 232),
}

# Which way the drawings look. ChatGPT drew every pose sheet looking down-RIGHT
# (attacks land on the right of the body), so by default each pose is mirrored on
# load: every S row then faces down-left and every E row faces right. Add a
# creature here as "left" only if its pose sheet is drawn looking down-left.
DEFAULT_FACING = "right"
FACING = {}

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


# ----------------------------------------------------------------- timing
# Each frame = (drawing index 0-3 in its row, whole-pose move). Move keys:
#   fwd   px toward where the creature looks (cell px at 128-cell scale)
#   up    px up            sx, sy  scale about the feet
#   flash white 0..1       alpha   fade
# Offsets are scaled by cell/128 so bosses move proportionally.
def walk_timing():
    """4 drawings on twos; contacts sit low, passing poses ride high."""
    return 10, True, None, [
        (0, dict(up=0.0, sy=0.99, sx=1.006)), (0, dict(up=0.5)),
        (1, dict(up=1.2, sy=1.008)),          (1, dict(up=0.7)),
        (2, dict(up=0.0, sy=0.99, sx=1.006)), (2, dict(up=0.5)),
        (3, dict(up=1.2, sy=1.008)),          (3, dict(up=0.7)),
    ]


def attack_timing():
    """Anticipation, held wind-up, a hard 2-frame impact with squash, recovery."""
    return 12, False, 3, [
        (0, dict(fwd=-0.6)),
        (1, dict(fwd=-1.8, sy=1.015, sx=0.99)),
        (1, dict(fwd=-2.4, sy=1.025, sx=0.985, up=0.4)),   # hold the peak
        (2, dict(fwd=4.5, sx=1.05, sy=0.94)),              # impact
        (2, dict(fwd=3.4, sx=1.015, sy=0.985)),
        (3, dict(fwd=1.6)),
        (3, dict(fwd=0.4)),
    ]


def hit_timing():
    """The drawn hit pose, knocked back with a white flash that decays."""
    return 14, False, 0, [
        (0, dict(fwd=-2.5, flash=0.9, sx=0.97, sy=1.03)),
        (0, dict(fwd=-3.6, flash=0.4)),
        (0, dict(fwd=-2.2)),
        (0, dict(fwd=-0.8, sy=0.99)),
    ]


def die_timing():
    """Three melt drawings, then the last one sinks and fades. 7 / 16 = 0.44 s."""
    return 16, False, None, [
        (1, dict(flash=0.18)),
        (1, dict(sy=0.97, sx=1.015)),
        (2, dict()),
        (2, dict(sy=0.95, sx=1.02)),
        (3, dict()),
        (3, dict(sy=0.86, sx=1.04, alpha=0.7)),
        (3, dict(sy=0.72, sx=1.07, alpha=0.35)),
    ]


def seq4():
    """Row 4 drawn as one skill in 4 steps: start, build-up, peak, settle."""
    return [(0, dict()), (0, dict(sy=0.99, sx=1.008)), (1, dict(sy=0.985, sx=1.012)),
            (1, dict(sy=0.98, sx=1.016)), (2, dict(sy=1.03, sx=0.985, up=0.6)),
            (2, dict(sy=1.012)), (3, dict()), (3, dict())]


def loop4():
    """Row 4 as a breathing loop through its four drawings."""
    return [(0, dict()), (1, dict(sy=1.008)), (2, dict(sy=1.015, up=0.3)),
            (2, dict(sy=1.02, up=0.5)), (3, dict(sy=1.008)), (3, dict())]


def hold(d, tremble=0.0):
    """One drawing held as a loop: slow breathing, optional tremble (warnings)."""
    ks = (0.0, 0.5, 1.0, 1.0, 0.5, 0.0)
    return [(d, dict(sy=1 + 0.018 * k, sx=1 - 0.008 * k, fwd=tremble * (1 if i % 2 else -1)))
            for i, k in enumerate(ks)]


def burst(d, pre=None):
    """One drawing as a one-shot: dip, pop up at frame 2, settle."""
    pre = d if pre is None else pre
    return [(pre, dict()), (pre, dict(sy=0.975, sx=1.015)), (d, dict(sy=1.035, sx=0.985, up=0.8)),
            (d, dict(sy=1.012)), (d, dict()), (d, dict(sy=0.995))]


# Row 4 of the pose sheet. name: list of
#   (anim, frames [(drawing 0-3, move)], fps, loop, impact frame or None, note)
# The anim name becomes the file suffix: wax_<name>_<anim>.png.
SKILLS = {
    "Healer": [("heal", loop4(), 8, True, None, "Đứng yên hồi máu: rung chuông, hoa nến sáng; lặp trong lúc hồi")],
    "Lens": [("focus", seq4(), 8, False, 4, "Hội tụ: đưa thấu kính ra trước, giữ, lóe sáng (frame 4 = bắn tia), hạ xuống")],
    "Frenzy": [("howl", seq4(), 10, False, 4, "Gào: frame 4 = tiếng gào, code tăng tốc đồng loại xung quanh")],
    "Ultimate": [("selfheal", loop4(), 8, True, None, "Tự hồi phục: sáp sáng lên rồi dịu lại, lặp")],
    "Primordial": [("shed", seq4(), 8, False, 4,
                    "Bong tróc: frame 0-3 vết nứt sáng (lặp 2-3 cho đủ 3 giây cảnh báo), frame 4 mảng sáp văng ra, code thả Sáp vụn")],
    "AlphaTiger": [
        ("crouch", hold(0, tremble=0.5), 10, True, None, "Vồ – cảnh báo: cúi người rung, lặp trong 2 giây"),
        ("pounce", [(0, dict(sy=0.96, sx=1.02)), (1, dict(up=2.0)), (1, dict(up=5.0)), (1, dict(up=6.0)),
                    (1, dict(up=3.0)), (0, dict(sy=0.94, sx=1.04))], 10, False, 5,
         "Vồ – bật nhảy (hình giữa không trung); code dời vị trí theo cung, frame 5 = chạm đất"),
        ("headbutt", [(0, dict(fwd=-1.0)), (0, dict(fwd=-2.5, sy=0.98)), (2, dict(fwd=5.0, sx=1.05, sy=0.95)),
                      (2, dict(fwd=3.5)), (2, dict(fwd=1.5)), (0, dict())], 10, False, 2,
         "Húc tường: frame 0-1 cúi đầu (giữ 1,5 giây), frame 2 = lúc trúng"),
        ("roar", burst(3, pre=0), 8, False, 2, "Gọi bầy: gầm, code triệu hồi 4–6 hổ con ở frame 2"),
    ],
    "MotherTree": [
        ("seed", [(0, dict()), (0, dict(sy=0.985, sx=1.01)), (0, dict(sy=1.01)), (1, dict(sy=1.025, up=0.5)),
                  (1, dict(sy=1.008)), (1, dict())], 8, False, 3,
         "Gieo hạt: frame 0-2 rung cành (cảnh báo), frame 3 thả hạt, code đặt 4–6 quả hạt"),
        ("roots", hold(2), 6, True, None, "Rễ nuôi: rễ trồi lên quanh gốc, lặp (vòng hồi máu do VFX vẽ)"),
        ("bark", hold(3), 6, True, None, "Vỏ cây: tấm vỏ che phía trước (giảm sát thương trực diện), lặp"),
    ],
    "Prism": [
        ("focus", hold(0, tremble=0.3), 8, True, None, "Hội tụ: đầu trượng sáng, lặp trong 5 giây nạp tia"),
        ("multi_focus", hold(1, tremble=0.3), 8, True, None, "Hội tụ đa điểm (50% máu): các tinh thể cùng sáng, lặp 5 giây"),
        ("open_core", hold(2), 8, True, None, "Mở lõi: lõi sáng = đang nhận gấp đôi sát thương, lặp"),
        ("mirror_skin", burst(3), 10, False, 2, "Da gương: lóe lên khi phản đạn"),
    ],
    "Myriad": [
        ("absorb", hold(0), 8, True, None, "Hấp thụ: kéo xác về phía mình, lặp"),
        ("scream", hold(1, tremble=0.6), 10, True, None, "Vạn người (66% và 33% máu): các khuôn mặt gào, rung; code sinh bầy"),
        ("last_heart", hold(2), 8, True, None, "Trái tim cuối cùng (10% máu): vỏ nứt hóa cứng, tim nhật thực rực sáng, lặp"),
        ("charge", [(3, dict(fwd=0.0)), (3, dict(fwd=1.2, up=0.5)), (3, dict(fwd=2.0)), (3, dict(fwd=1.2, up=0.5))],
         10, True, None, "Lao về phía tường sau Trái tim cuối cùng, lặp"),
    ],
}

# Extra remark on the die sheet of some creatures.
DIE_NOTE = {"Spore": " Frame cuối có 3 Sáp vụn nhỏ bên vũng (GDD: vỡ thành 3 Sáp vụn) – code sinh 3 Sáp vụn thật ở frame 4."}


# ------------------------------------------------------------ chroma key
def chroma_key(rgb):
    """Green-screen key. Returns float RGBA (0..1) with un-mixed edge colour.

    alpha comes from how much greener than max(r, b) a pixel is, measured
    against the sheet's own background, with a soft ramp; the drawn grid
    lines (a darker green) are painted out first so they key like background.
    """
    a = rgb.astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    diff = g - np.maximum(r, b)
    pure = diff > 170
    if pure.sum() < 100:
        raise ValueError("no green background found")
    bg = np.median(a[pure], axis=0)
    dbg = float(bg[1] - max(bg[0], bg[2]))

    # grid lines (thin, dark green or black, full width / height): a row or
    # column that is mostly not-background while its neighbours are mostly
    # background. Paint them out wherever background touches either side, so
    # a weapon that crosses a line is kept whole.
    nonbg = diff < dbg * 0.8
    H, W = nonbg.shape
    lines = np.zeros((H, W), bool)
    for axis in (0, 1):                      # 0: horizontal lines, 1: vertical
        m = nonbg if axis == 0 else nonbg.T
        frac = m.mean(axis=1)
        n = len(frac)
        d = max(6, n // 120)
        pad = np.concatenate([np.zeros(d), frac, np.zeros(d)])
        side = np.maximum(pad[:n], pad[2 * d:])
        hit = np.nonzero((frac > 0.5) & (frac - side > 0.3))[0]
        lm = np.zeros(m.shape, bool)
        for s0, e0 in _clusters(hit):
            if e0 - s0 > d:
                continue
            above = ~m[s0 - 3] if s0 - 3 >= 0 else np.ones(m.shape[1], bool)
            below = ~m[e0 + 3] if e0 + 3 < n else np.ones(m.shape[1], bool)
            lm[max(0, s0 - 2):e0 + 3, :] = (above | below)[None, :]
        lines |= lm if axis == 0 else lm.T
    a[lines] = bg
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    diff = g - np.maximum(r, b)

    lo, hi = 22.0, dbg * 0.86
    alpha = 1.0 - np.clip((diff - lo) / (hi - lo), 0, 1)
    # un-mix the background out of partly transparent pixels
    am = np.clip(alpha, 0.05, 1)[..., None]
    fg = np.where(alpha[..., None] < 0.995, (a - (1 - am) * bg) / am, a)
    fg = np.clip(fg, 0, 255)
    # despill: near the outline no pixel may stay greener than its red/blue
    near = ndi.binary_dilation(alpha < 0.5, iterations=3) | (alpha < 0.98)
    cap = np.maximum(fg[..., 0], fg[..., 2]) + 12
    fg[..., 1] = np.where(near, np.minimum(fg[..., 1], cap), fg[..., 1])
    alpha = np.clip((alpha - 0.10) / 0.82, 0, 1)
    return np.dstack([fg / 255.0, alpha]), lines


def _clusters(idx):
    """Group sorted integer positions into (start, end) runs."""
    out = []
    for v in idx:
        if out and v - out[-1][1] <= 3:
            out[-1][1] = v
        else:
            out.append([v, v])
    return [(s, e) for s, e in out]


def _bands_from_gaps(profile, min_size, min_gap):
    """Content bands along one axis, split at empty gaps."""
    on = profile > 0
    bands, start, gap = [], None, 0
    for i, v in enumerate(on):
        if v:
            if start is None:
                start = i
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= min_gap:
                bands.append((start, i - gap + 1))
                start = None
    if start is not None:
        bands.append((start, len(on)))
    return [b for b in bands if b[1] - b[0] >= min_size]


def _cuts(lines_1d, n, total, tol=0.12):
    """n-1 inner cut positions from detected grid lines, or None."""
    cl = [0.5 * (s + e) for s, e in _clusters(np.nonzero(lines_1d)[0])]
    inner = [c for c in cl if total * 0.06 < c < total * 0.94]
    want = [total * k / n for k in range(1, n)]
    cuts = []
    for w in want:
        near = [c for c in inner if abs(c - w) < total * tol / n * 2]
        if not near:
            return None
        cuts.append(min(near, key=lambda c: abs(c - w)))
    return cuts


def split_cells(rgba, lines):
    """Cut the keyed sheet into rows of up to 4 poses. Returns list of rows,
    each a list of float RGBA crops (None for an empty cell)."""
    H, W = rgba.shape[:2]
    solid = rgba[..., 3] > 0.5
    # drop specks before measuring anything
    lab, n = ndi.label(solid)
    if n:
        area = ndi.sum(solid, lab, range(1, n + 1))
        solid = np.isin(lab, 1 + np.nonzero(area >= max(6, W * H * 2e-6))[0])

    # ---- rows: drawn grid lines, else empty gaps, else equal bands
    row_cuts = None
    hl = lines.mean(axis=1) > 0.3
    for nr in (4, 3):
        c = _cuts(hl, nr, H)
        if c and len([1 for s, e in _clusters(np.nonzero(hl)[0]) if H * 0.06 < (s + e) / 2 < H * 0.94]) == nr - 1:
            row_cuts = [0] + c + [H]
            break
    if row_cuts is None:
        bands = _bands_from_gaps(solid.sum(axis=1), H * 0.08, max(3, H // 150))
        if len(bands) in (3, 4):
            mids = [(bands[i][1] + bands[i + 1][0]) / 2 for i in range(len(bands) - 1)]
            row_cuts = [0] + mids + [H]
        else:
            nr = min(4, max(3, round(4 * H / W)))
            row_cuts = [H * k / nr for k in range(nr + 1)]
    # ---- columns
    col_cuts = _cuts(lines.mean(axis=0) > 0.3, 4, W)
    col_cuts = [0] + col_cuts + [W] if col_cuts else [W * k / 4 for k in range(5)]

    lab, n = ndi.label(ndi.binary_dilation(solid, iterations=max(2, W // 400)))
    objs = ndi.find_objects(lab)
    rows = []
    for ri in range(len(row_cuts) - 1):
        y0, y1 = row_cuts[ri], row_cuts[ri + 1]
        comps = []
        for k, sl in enumerate(objs, 1):
            m = (lab[sl] == k) & solid[sl]
            ar = int(m.sum())
            if not ar:
                continue
            ys, xs = np.nonzero(m)
            cy, cx = ys.mean() + sl[0].start, xs.mean() + sl[1].start
            if y0 <= cy < y1:
                comps.append(dict(k=k, sl=sl, area=ar, cx=cx, cy=cy))
        if not comps:
            rows.append([None] * 4)
            continue
        # by grid column; if that leaves a column empty while another holds
        # two big blobs, trust the 4 biggest blobs left-to-right instead
        big = sorted(comps, key=lambda c: -c["area"])[:4]
        big = [c for c in big if c["area"] > 0.04 * big[0]["area"]]
        col_of = lambda c: int(np.searchsorted(col_cuts, c["cx"], side="right") - 1)
        cols_hit = sorted(col_of(c) for c in big)
        if len(big) == 4 and cols_hit != [0, 1, 2, 3]:
            mains = sorted(big, key=lambda c: c["cx"])
            assign = lambda c: min(range(4), key=lambda i: abs(mains[i]["cx"] - c["cx"]))
        else:
            assign = lambda c: min(3, max(0, col_of(c)))
        cells = [[] for _ in range(4)]
        for c in comps:
            cells[assign(c)].append(c)
        row = []
        for members in cells:
            if not members:
                row.append(None)
                continue
            main = max(members, key=lambda c: c["area"])
            mb = main["sl"]
            keep = np.zeros((H, W), bool)
            reach = (col_cuts[1] - col_cuts[0]) * 0.14
            for c in members:
                sl = c["sl"]
                gap = max(sl[1].start - mb[1].stop, mb[1].start - sl[1].stop, sl[0].start - mb[0].stop,
                          mb[0].start - sl[0].stop, 0)
                if c is main or (gap <= reach and c["area"] >= 10) or c["area"] > 0.03 * main["area"]:
                    keep[sl] |= lab[sl] == c["k"]
            ys, xs = np.nonzero(keep & solid)
            bx = (max(0, xs.min() - 3), max(0, ys.min() - 3), min(W, xs.max() + 4), min(H, ys.max() + 4))
            crop = rgba[bx[1]:bx[3], bx[0]:bx[2]].copy()
            crop[..., 3] *= ndi.binary_dilation(keep[bx[1]:bx[3], bx[0]:bx[2]], iterations=2)
            row.append((crop, bx[1]))
        rows.append(row)
    return rows


# ---------------------------------------------------------- registration
def trim(cell):
    """Crop a float RGBA pose to its solid pixels.
    Returns (pose, y of its lowest pixel row in the sheet)."""
    im, top = cell
    ys, xs = np.nonzero(im[..., 3] > 0.35)
    return im[ys.min():ys.max() + 1, xs.min():xs.max() + 1], top + int(ys.max())


def lifts(bottoms, ref_h):
    """How far each pose of a row was drawn above the row's ground line
    (a hop, a pounce). Small differences are drawing noise and snap to 0."""
    known = sorted(b for b in bottoms if b is not None)
    if not known:
        return [0.0] * len(bottoms)
    ground = known[-2] if len(known) > 2 else known[-1]
    return [0.0 if b is None or ground - b < 0.035 * ref_h else float(ground - b) for b in bottoms]


def feet_x(im):
    """x of the body's base: weighted median of the lower 40% of the pose.
    Thin weapons that stick out sideways carry too little mass to pull it."""
    h = im.shape[0]
    col = im[int(h * 0.6):, :, 3].sum(axis=0)
    c = np.cumsum(col)
    return float(np.searchsorted(c, c[-1] / 2)) if c[-1] > 0 else im.shape[1] / 2


def _sig(im, fx, half, band):
    """Luma * alpha strip around the feet column, bottom-aligned, for matching."""
    h, w = im.shape[:2]
    lum = (0.3 * im[..., 0] + 0.6 * im[..., 1] + 0.1 * im[..., 2] + 0.25) * im[..., 3]
    out = np.zeros((band, 2 * half), np.float32)
    x0 = int(round(fx)) - half
    sx0, sx1 = max(0, x0), min(w, x0 + 2 * half)
    rows = min(band, h)
    if sx1 > sx0:
        out[band - rows:, sx0 - x0:sx1 - x0] = lum[h - rows:, sx0:sx1]
    return out


def register_x(im, ref, ref_fx, whole):
    """Feet x of `im` such that it lines up with the reference pose.
    Starts from the mass median, then slides sideways for the best match of
    the lower body (or the whole body for walk frames)."""
    fx0 = feet_x(im)
    rh, rw = ref.shape[:2]
    band = rh if whole else int(rh * 0.42)
    half = int(rw * 0.75)
    a = _sig(ref, ref_fx, half, band)
    best, best_s = fx0, -1.0
    rng = int(rw * 0.14)
    na = np.sqrt((a * a).sum()) + 1e-6
    for d in range(-rng, rng + 1, max(1, rng // 40)):
        b = _sig(im, fx0 + d, half, band)
        s = float((a * b).sum() / (na * (np.sqrt((b * b).sum()) + 1e-6)))
        s -= 0.06 * abs(d) / max(1, rng)          # prefer staying near the median
        if s > best_s:
            best, best_s = fx0 + d, s
    return best if best_s > 0.45 else fx0


# -------------------------------------------------------------- rendering
def to_pil(im):
    return Image.fromarray((np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")


def premult_resize(pil, size):
    a = np.asarray(pil).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:]
    out = np.asarray(Image.fromarray((a * 255 + 0.5).astype(np.uint8), "RGBa" if False else "RGBA").resize(size, Image.LANCZOS)).astype(np.float32) / 255
    al = np.clip(out[..., 3:], 1e-4, 1)
    out[..., :3] = np.clip(out[..., :3] / al, 0, 1)
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")


class Pose:
    def __init__(self, im, fx, lift=0.0):
        self.pil = to_pil(im)
        self.lift = lift          # drawn height above the ground line, pose pixels
        self.fx = fx              # feet x in pose pixels
        self.h = im.shape[0]
        self.w = im.shape[1]
        low = im[int(im.shape[0] * 0.8):, :, 3].sum(axis=0) > 0.5
        xs = np.nonzero(low)[0]
        self.base_w = (xs.max() - xs.min() + 1) if len(xs) else self.w


def render(pose, cell, scale, move, shadow_w, sink):
    """One cell-sized frame. `scale` = cell px per pose px."""
    W = cell * SS
    k = cell / 128.0
    sx, sy = move.get("sx", 1.0), move.get("sy", 1.0)
    s = scale * SS
    w, h = max(1, round(pose.w * s * sx)), max(1, round(pose.h * s * sy))
    im = premult_resize(pose.pil, (w, h))
    fl = move.get("flash", 0.0)
    if fl > 0:
        r, g, b, a = im.split()
        rgb = Image.blend(Image.merge("RGB", (r, g, b)), Image.new("RGB", im.size, (255, 255, 255)), fl)
        im = Image.merge("RGBA", (*rgb.split(), a))
    cx, fy = W / 2, W * FEET
    fwd = move.get("fwd", 0.0) * k * SS
    x = round(cx - pose.fx * s * sx - fwd)                 # drawings look left: forward = -x
    y = round(fy + sink * SS + 0.175 * fwd - h - pose.lift * s - move.get("up", 0.0) * k * SS)
    canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    rx = min(shadow_w * s * 0.5, W * 0.40)
    sh = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([cx - fwd - rx, fy - rx * 0.2, cx - fwd + rx, fy + rx * 0.2], fill=(40, 30, 60, 78))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(SS * 1.6)))
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    layer.paste(im, (x, y), im)
    canvas = Image.alpha_composite(canvas, layer)
    al = move.get("alpha", 1.0)
    if al < 1:
        canvas.putalpha(canvas.split()[3].point(lambda v: int(v * al)))
    return premult_resize(canvas, (cell, cell))


def extent(pose, scale, move, cell, sink):
    """How far a frame reaches from the feet point, in cell px: (left, right, up, down)."""
    k = cell / 128.0
    sx, sy = move.get("sx", 1.0), move.get("sy", 1.0)
    fwd = move.get("fwd", 0.0) * k
    left = pose.fx * scale * sx + fwd
    right = (pose.w - pose.fx) * scale * sx - fwd
    up = pose.h * scale * sy + pose.lift * scale + move.get("up", 0.0) * k - sink - 0.175 * fwd
    down = sink + 0.175 * fwd
    return left, right, up, down


def sheet(rows):
    cw, ch = rows[0][0].size
    out = Image.new("RGBA", (cw * len(rows[0]), ch * len(rows)), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            out.paste(im, (c * cw, r * ch))
    return out


# ------------------------------------------------------------------ build
def load_poses(name):
    folder, prefix, src, cell, fit, size = UNITS[name]
    path = os.path.join(POSES, src + ".png")
    rgb = np.asarray(Image.open(path).convert("RGB"))
    rgba, lines = chroma_key(rgb)
    rows = split_cells(rgba, lines)
    rows = [[trim(c) if c is not None else None for c in row] for row in rows]
    if FACING.get(name, DEFAULT_FACING) == "right":      # mirror each pose, not the sheet (keeps frame order)
        rows = [[(c[0][:, ::-1].copy(), c[1]) if c else None for c in row] for row in rows]
    return [[c[0] if c else None for c in row] for row in rows], [[c[1] if c else None for c in row] for row in rows]


def build(name, dry=False, preview=None):
    folder, prefix, src, cell, fit, size = UNITS[name]
    cells, bottoms = load_poses(name)
    for ri, need in ((0, 4), (1, 4), (2, 4)):
        if ri >= len(cells) or sum(c is not None for c in cells[ri]) < need:
            raise RuntimeError(f"{name}: row {ri + 1} of the pose sheet has fewer than {need} poses")
    walk = cells[0]
    # one scale for the whole creature, from the walk drawings
    dim = float(np.median([c.shape[0] if fit == "h" else c.shape[1] for c in walk]))
    scale = size / dim
    if fit == "w":
        scale = min(scale, cell * 0.86 / float(np.median([c.shape[0] for c in walk])))
    ref = walk[0]
    # wide beasts nearly fill the cell: centre them on their outline, not on their paws
    ref_fx = ref.shape[1] / 2 if fit == "w" else feet_x(ref)
    sink = 0.03 * ref.shape[0]            # 3/4 view: the front of the feet dips below the pivot

    def poses(ri, whole):
        out = []
        lf = lifts(bottoms[ri], ref.shape[0])
        for i, c in enumerate(cells[ri]):
            if c is None:
                out.append(None)
            elif c is ref:
                out.append(Pose(c, ref_fx, lf[i]))
            else:
                out.append(Pose(c, register_x(c, ref, ref_fx, whole), lf[i]))
        return out

    P = {"walk": poses(0, True), "attack": poses(1, False)}
    r3 = poses(2, False)
    # melt stages 2-3 are puddles: centre them on their own mass
    for i in (2, 3):
        r3[i] = Pose(cells[2][i], 0.5 * (feet_x(cells[2][i]) + cells[2][i].shape[1] / 2))
    P["hit"] = P["die"] = r3
    anims = [("walk",) + walk_timing() + ("đi: 4 tư thế vẽ tay, mỗi tư thế giữ 2 frame với nhịp nhún",),
             ("attack",) + attack_timing() + ("lấy đà → giơ cao (giữ) → đánh; frame 3 = lúc trúng",),
             ("hit",) + hit_timing() + ("tư thế trúng đòn (vẽ tay), nháy trắng, nảy lùi",),
             ("die",) + die_timing() + ("3 giai đoạn tan chảy (vẽ tay) rồi lún và mờ dần; 0,44 giây",)]
    anims[3] = anims[3][:-1] + (anims[3][-1] + DIE_NOTE.get(name, ""),)
    if name in SKILLS and len(cells) > 3:
        row4 = poses(3, False)
        for an, seq, fps, loop, impact, note in SKILLS[name]:
            if any(row4[di] is None for di, _ in seq):
                print(f"  ! {name}: skill '{an}' skipped, its drawing is missing in row 4")
                continue
            P[an] = row4
            anims.append((an, fps, loop, impact, seq, note))
    elif name in SKILLS:
        print(f"  ! {name}: no skill row in the pose sheet")

    # one shrink factor for the whole creature so every frame stays in its cell
    shrink = 1.0
    for an, fps, loop, impact, seq, note in anims:
        for di, mv in seq:
            l, r, u, d = extent(P[an][di], scale, mv, cell, sink * scale)
            for reach, room in ((l, cell / 2 - MARGIN), (r, cell / 2 - MARGIN),
                                (u, cell * FEET - MARGIN), (d, cell * (1 - FEET) - MARGIN)):
                if reach > room:
                    shrink = min(shrink, room / reach)
    if shrink < 1:
        print(f"  {name}: shrunk to {shrink:.3f} so the widest pose fits the {cell}px cell")
    scale *= shrink * 0.999

    out_dir = os.path.join(ART, folder)
    if not dry:
        os.makedirs(out_dir, exist_ok=True)
        for old in glob.glob(os.path.join(out_dir, prefix + "_*.png")):
            if not old.endswith("_rig.png"):
                os.remove(old)                      # no mixing with the previous art
    entry = dict(folder=folder, cell=cell, rows=ROWS, pivot=[0.5, 1 - FEET], ppu=128,
                 height_px=round(ref.shape[0] * scale), source=f"Tools/ArtGen/source/wax_poses/{src}.png", anims={})
    strips = {}
    for an, fps, loop, impact, seq, note in anims:
        frames = [render(P[an][di], cell, scale, mv, P["walk"][0].base_w, sink * scale) for di, mv in seq]
        for i, f in enumerate(frames):              # contract check: nothing on the cell edge
            a = np.asarray(f)[..., 3]
            if max(a[0].max(), a[-1].max(), a[:, 0].max(), a[:, -1].max()) > 8:
                print(f"  ! {name} {an} frame {i} touches the cell edge")
        mirrored = [f.transpose(Image.FLIP_LEFT_RIGHT) for f in frames]
        img = sheet([frames, mirrored, frames])
        fname = f"{prefix}_{an}.png"
        if not dry:
            img.save(os.path.join(out_dir, fname), optimize=True)
        entry["anims"][an] = dict(file=f"{folder}/{fname}", frames=len(frames), fps=fps, loop=loop,
                                  impact_frame=impact, duration_s=round(len(frames) / fps, 3), note=note)
        strips[an] = (frames, fps)
        print(f"Wax/{folder}/{fname}  {img.size[0]}x{img.size[1]}  {len(frames)} frames @ {fps} fps")
    if not dry:
        write_readme(name, entry)
    if preview:
        write_preview(name, cell, strips, preview)
    return entry, strips


BG = (58, 66, 84, 255)


def on_bg(f, z=1):
    im = Image.new("RGBA", f.size, BG)
    im.alpha_composite(f)
    return im.resize((f.width * z, f.height * z), Image.LANCZOS).convert("RGB") if z != 1 else im.convert("RGB")


def write_preview(name, cell, strips, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    z = max(1, 256 // cell)
    wmax = max(len(f) for f, _ in strips.values())
    strip = Image.new("RGB", (wmax * cell * z, len(strips) * cell * z), (30, 34, 44))
    d = ImageDraw.Draw(strip)
    for r, (an, (frames, fps)) in enumerate(strips.items()):
        for c, f in enumerate(frames):
            strip.paste(on_bg(f, z), (c * cell * z, r * cell * z))
            d.rectangle([c * cell * z, r * cell * z, (c + 1) * cell * z - 1, (r + 1) * cell * z - 1], outline=(90, 100, 125))
        d.text((4, r * cell * z + 3), f"{an} {len(frames)}f @{fps}", fill=(255, 235, 120))
    strip.save(os.path.join(out_dir, f"{name}_strip.png"))
    for an, (frames, fps) in strips.items():
        ims = [on_bg(f, z) for f in frames]
        ims[0].save(os.path.join(out_dir, f"{name}_{an}.gif"), save_all=True, append_images=ims[1:],
                    duration=round(1000 / fps), loop=0)


def write_walk_gif(all_strips, path):
    """All creatures walking side by side (each at its real in-game size)."""
    names = [n for n in UNITS if n in all_strips]
    if not names:
        return
    cols = 8
    rows = (len(names) + cols - 1) // cols
    T = 256
    frames = []
    for t in range(8):
        im = Image.new("RGBA", (cols * T, rows * T), BG)
        for i, n in enumerate(names):
            fr = all_strips[n]["walk"][0]
            f = fr[t % len(fr)]
            ox, oy = (i % cols) * T, (i // cols) * T
            im.alpha_composite(f, (ox + (T - f.width) // 2, oy + T - 16 - f.height))
        frames.append(im.convert("RGB"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=100, loop=0)


def write_readme(name, entry):
    folder, prefix, src, cell, fit, size = UNITS[name]
    title, where = INFO[name]
    lines = [f"# {title} ({folder})", "", f"Xuất hiện: {where}", "", "## Hình",
             f"- Bảng tư thế gốc: `Tools/ArtGen/source/wax_poses/{src}.png` – vẽ bằng AI (ChatGPT) theo hình đã chốt "
             f"`Assets/Art/_ArtDirection/options/gothic_v5/ingame_sprites/src_{src}.png`, nền xanh lá",
             "- Mọi frame là hình vẽ thật: `Tools/ArtGen/build_wax_from_poses.py` chỉ tách nền, căn chân, giữ frame, "
             "và dịch/co nhẹ cả hình (nhún, lao tới, nảy lùi, nháy trắng, mờ dần) – không bẻ cong hình",
             "- Hàng S = hình vẽ (quay xuống trái), hàng E = lật ngang (quay phải), hàng N = giống S (chưa có hình nhìn sau)",
             "", "## File", "", "| File | Bố cục | fps | Lặp | Frame trúng | Ghi chú |", "|---|---|---|---|---|---|"]
    for an, a in entry["anims"].items():
        imp = "–" if a["impact_frame"] is None else str(a["impact_frame"])
        lines.append(f"| `{os.path.basename(a['file'])}` | 3 hàng (S, E, N) × {a['frames']} frame | {a['fps']} | "
                     f"{'có' if a['loop'] else 'không'} | {imp} | {a['note']} |")
    lines += ["", "## Thông số Unity",
              f"- Ô sprite {cell}×{cell}, Pixels Per Unit = 128 (1 ô xây = 1 unit); con vật cao khoảng {entry['height_px']} px",
              f"- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô {int(cell * 0.125)} px",
              "- Hàng 0 = S, hàng 1 = E, hàng 2 = N; hướng W dùng hàng E + flipX",
              "- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. "
              "Đổi kích thước ô thì chạy Tools > Units > Reapply Sprite Import Settings",
              "- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite",
              "- Số frame, fps, frame trúng của mọi con: `Assets/Art/Wax/anim_manifest.json`", "",
              f"Dựng lại: `python3 Tools/ArtGen/build_wax_from_poses.py --only {name}`", ""]
    with open(os.path.join(ART, folder, "README.md"), "w") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", default="", help="comma-separated creature names (UNITS keys)")
    ap.add_argument("--dry", action="store_true", help="do not write into Assets")
    ap.add_argument("--preview", default="", help="folder for contact strips and GIFs")
    ap.add_argument("--walk-gif", default="", help="write one GIF of every built creature walking")
    a = ap.parse_args()
    only = [s for s in a.only.split(",") if s]
    mpath = os.path.join(ART, "anim_manifest.json")
    manifest = {"version": 1, "rows": ROWS, "ppu": 128, "pivot": [0.5, 1 - FEET],
                "note": "rows: 0=S (faces down-left), 1=E (faces right), 2=N (=S); W = E with flipX. "
                        "frames are columns, left to right. impact_frame is 0-based.",
                "creatures": {}}
    if os.path.exists(mpath):
        try:
            manifest["creatures"] = json.load(open(mpath)).get("creatures", {})
        except ValueError:
            pass
    strips = {}
    for name, u in UNITS.items():
        if only and name not in only:
            continue
        if not os.path.exists(os.path.join(POSES, u[2] + ".png")):
            print(f"-- {name}: no pose sheet yet ({u[2]}.png), skipped")
            continue
        entry, strips[name] = build(name, a.dry, a.preview)
        manifest["creatures"][name] = entry
    if not a.dry and strips:
        manifest["creatures"] = {k: manifest["creatures"][k] for k in UNITS if k in manifest["creatures"]}
        with open(mpath, "w") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        print("wrote", os.path.relpath(mpath, ROOT))
    if a.walk_gif:
        write_walk_gif(strips, os.path.expanduser(a.walk_gif))


if __name__ == "__main__":
    main()
