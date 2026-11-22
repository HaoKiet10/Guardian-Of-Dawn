#!/usr/bin/env python3
"""Generate placeholder sprite sheets for Dị Thể Sáp (wax) and squads.

Usage (from the repo root):
    python3 Tools/ArtGen/gen_units.py            # write PNGs into Assets/Art
    python3 Tools/ArtGen/gen_units.py --preview DIR   # also write previews to DIR
    python3 Tools/ArtGen/gen_units.py --only Standard,Warden

Sheet layout (same convention as the tower Head sheets, simplified to 3 rows):
    row 0 = S (toward camera), row 1 = E (facing right), row 2 = N (away)
    W is E with flipX. Columns are frames, left to right.
Cell sizes and pivots live in UNITS below and in Assets/Editor/UnitSpriteImporter.cs.
"""
import argparse
import math
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from artlib import Frame, sheet  # noqa: E402
import squads  # noqa: E402
import wax  # noqa: E402
import wax_hq  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ART = os.path.join(ROOT, "Assets", "Art")
DIRS = ["S", "E", "N"]
PIVOT_Y = 0.125  # feet sit 1/8 of the cell above the bottom edge
TAU = 2 * math.pi


# ======================================================== frame rendering
def render(w, h, draw, pose):
    fr = Frame(w, h)
    fr.under = Frame(w, h)
    draw(fr, pose)
    fr.flash(pose.get("flash", 0.0))
    u = fr.under
    u.P = fr.P + u.P * (1 - fr.A[..., None])
    u.A = fr.A + u.A * (1 - fr.A)
    u.fade(pose.get("alpha", 1.0))
    im = u.image()
    rot = pose.get("rotate", 0.0)
    if rot:
        cx, gy = w / 2, h * (1 - PIVOT_Y)
        im = im.rotate(rot, resample=Image.BICUBIC, center=(cx, gy),
                       translate=(pose.get("drop_x", 0.0), pose.get("drop_y", 0.0)))
    return im


def directional(cell, draw_dir, poses):
    w, h = cell
    return sheet([[render(w, h, lambda fr, p, d=d: draw_dir(fr, d, p), p) for p in poses] for d in DIRS])


def single_row(cell, draw, poses):
    w, h = cell
    return sheet([[render(w, h, draw, p) for p in poses]])


# ======================================================== animation tables
def humanoid_walk(amp=1.0):
    return [dict(bob=1.6 * amp * abs(math.sin(TAU * i / 6)), sway=1.2 * amp * math.sin(TAU * i / 6),
                 swing=amp * math.sin(TAU * i / 6)) for i in range(6)]


def humanoid_attack():
    raise_ = [0, 0.55, 1, -1, -0.85, -0.2]
    lean = [0, -2, -3, 5, 4, 1]
    sq = [(1, 1), (0.97, 1.04), (0.95, 1.07), (1.08, 0.93), (1.05, 0.95), (1, 1)]
    return [dict(raise_=r, lean=l, squash=s) for r, l, s in zip(raise_, lean, sq)]


def hit():
    return [dict(flash=0.65, squash=(1.06, 0.93), lean=-2, step=-1.5), dict(flash=0.25)]


def melt(n=6):
    ms = [0.12, 0.3, 0.5, 0.7, 0.88, 1.0] if n == 6 else [0.1, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1.0]
    al = [1] * (n - 2) + [0.9, 0.6]
    return [dict(melt=m, alpha=a) for m, a in zip(ms, al)]


def fix_raise(poses):
    for p in poses:
        if "raise_" in p:
            p["raise"] = p.pop("raise_")
    return poses


def with_(poses, **kw):
    return [dict(p, **kw) for p in poses]


def shard_hop():
    rise = [0, 2.5, 4, 2.5, 0, 0]
    sq = [(1.12, 0.88), (0.94, 1.08), (0.97, 1.04), (1, 1), (1.12, 0.88), (1.04, 0.96)]
    tip = [0, -1, -2, -1, 1, 1]
    return [dict(bob=r, squash=s, tip=t) for r, s, t in zip(rise, sq, tip)]


def shard_attack():
    step = [0, -1.5, 3, 5, 2.5, 0]
    sq = [(1, 1), (1.1, 0.9), (0.9, 1.12), (1.15, 0.85), (1.05, 0.95), (1, 1)]
    return [dict(step=s, squash=q) for s, q in zip(step, sq)]


def tiger_run():
    return [dict(phase=i / 6, bob=2 * max(0.0, math.sin(TAU * i / 6))) for i in range(6)]


def tiger_attack():
    step = [0, -2, 4, 7, 4, 1]
    hd = [0, -0.2, 0.3, 0.5, 0.3, 0]
    mo = [0, 0.3, 1, 1, 0.5, 0]
    sq = [(1, 1), (0.97, 1.03), (1.04, 0.97), (1.06, 0.95), (1.02, 0.98), (1, 1)]
    return [dict(step=s, head_down=h, mouth=m, squash=q, gait=0, phase=0.25) for s, h, m, q in zip(step, hd, mo, sq)]


def tiger_static(**kw):
    return dict(gait=0, phase=0.25, **kw)


def primordial_shed():
    glow = [0.25, 0.55, 0.85, 1.0, 0.6, 0.3, 0.1, 0]
    starts = [(-14, 38), (14, 36), (-16, 24), (16, 22), (-10, 48), (10, 50), (-12, 12), (13, 10)]
    poses = []
    for i in range(8):
        chunks = []
        if i >= 4:
            t = (i - 3) / 4
            for j, (x0, y0) in enumerate(starts):
                sx = -1 if x0 < 0 else 1
                x = x0 + sx * (10 + 4 * (j % 3)) * t
                y = max(2.5, y0 + 14 * t - (y0 + 14) * t * t)
                chunks.append((x, y, 3.6 - 0.8 * t))
        poses.append(dict(glow=glow[i], chunks=chunks, squash=(1 + 0.03 * glow[i], 1 - 0.02 * glow[i])))
    return poses


def soldier_idle():
    return [dict(bob=b) for b in (0, 0.5, 0.9, 0.5)]


def soldier_walk():
    return [dict(swing=math.sin(TAU * i / 6), bob=0.9 * abs(math.sin(TAU * i / 6))) for i in range(6)]


def soldier_fire():
    return [dict(recoil=r, flash_muzzle=f) for r, f in ((0, 0), (1, 1), (0.5, 0.55), (0, 0))]


def soldier_die(d):
    ang = [0, 12, 35, 62, 80, 86]
    al = [1, 1, 1, 1, 0.9, 0.7]
    sign = 1 if d == "E" else -1
    return [dict(rotate=sign * a, flash=0.5 if i == 0 else 0, alpha=al[i], drop_y=0.06 * a) for i, a in enumerate(ang)]


def warden_hold():
    return [dict(crouch=c, shield_down=s, shield_glow=g) for c, s, g in
            ((0.3, 0.3, 0), (0.7, 0.8, 0), (1, 1, 0.6), (1, 1, 1), (1, 1, 0.7), (0.6, 0.6, 0.3))]


def hunter_execute():
    return [dict(crouch=c, step=s, slash=sl, blade_glow=b, lean=l) for c, s, sl, b, l in
            ((0.3, 0, 0, 0.4, 0), (0.6, -1, 0, 0.8, -1), (0, 6, 0.7, 1, 4),
             (0, 10, 1, 1, 5), (0.2, 8, 0.4, 0.6, 2), (0, 3, 0, 0.2, 0))]


# ======================================================== unit catalogue
def hum(variant, k, cell, ow):
    w, h = cell
    return lambda fr, d, p: wax.draw_humanoid(fr, w / 2, h * (1 - PIVOT_Y), k, d, dict(p, ow=ow), variant)


def hum_hq(k, cell, ow):
    w, h = cell
    return lambda fr, d, p: wax_hq.draw_standard(fr, w / 2, h * (1 - PIVOT_Y), k, d, dict(p, ow=ow))


def with_drip(poses):
    return [dict(p, drip=i) for i, p in enumerate(poses)]


def shard(k, cell, ow):
    w, h = cell
    return lambda fr, d, p: wax.draw_shard(fr, w / 2, h * (1 - PIVOT_Y), k, d, dict(p, ow=ow))


def tiger(k, cell, ow, boss=False, cx_off=0):
    w, h = cell
    return lambda fr, d, p: wax.draw_tiger(fr, w / 2 + (cx_off if d == "E" else 0), h * (1 - PIVOT_Y), k, d,
                                           dict(p, ow=ow), boss)


def soldier(kind):
    return lambda fr, d, p: squads.draw_soldier(fr, 64, 128 * (1 - PIVOT_Y), d, p, kind)


C64, C128, C256 = (64, 64), (128, 128), (256, 256)

# name -> (folder, file prefix, cell, [(anim, poses, fps, loop, note)], drawer)
UNITS = {
    "Standard": ("Wax/Standard", "wax_standard", C128, hum_hq(1.3, C128, 2.0), [
        ("walk", with_drip(humanoid_walk()), 8, True, "lê bước, tay dài đung đưa, giọt sáp nhỏ xuống"),
        ("attack", with_drip(fix_raise(humanoid_attack())), 12, False, "giơ tay rồi đập xuống; frame 3 = lúc trúng"),
        ("hit", hit(), 12, False, "nháy trắng, nảy lùi"),
        ("die", melt(), 14, False, "tan chảy thành vũng (< 0,5 giây)"),
    ]),
    "Shard": ("Wax/Shard", "wax_shard", C64, shard(1.0, C64, 1.6), [
        ("walk", shard_hop(), 12, True, "nhảy lóc cóc"),
        ("attack", shard_attack(), 14, False, "lao tới; frame 3 = lúc trúng"),
        ("hit", hit(), 12, False, "nháy trắng"),
        ("die", melt(), 16, False, "bẹp thành vũng nhỏ"),
    ]),
    "Crab": ("Wax/Crab", "wax_crab", C128, hum("crab", 1.0, C128, 2.0), [
        ("walk", humanoid_walk(0.55), 6, True, "đi chậm sau mai cứng"),
        ("attack", fix_raise(humanoid_attack()), 10, False, "đập bằng thân; frame 3 = lúc trúng"),
        ("hit", hit(), 12, False, "nháy trắng"),
        ("die", melt(), 14, False, "tan chảy, mai chìm xuống"),
    ]),
    "Tiger": ("Wax/Tiger", "wax_tiger", C128, tiger(1.0, C128, 2.0), [
        ("walk", tiger_run(), 14, True, "phi nước đại (bậc 2 nhanh nhất)"),
        ("attack", tiger_attack(), 14, False, "chồm tới cắn; frame 3 = lúc trúng"),
        ("hit", with_(hit(), gait=0, phase=0.25), 12, False, "nháy trắng"),
        ("die", with_(melt(), gait=0, phase=0.25), 14, False, "tan chảy"),
    ]),
    "TigerCub": ("Wax/TigerCub", "wax_tiger_cub", C64, tiger(0.55, C64, 1.4), [
        ("walk", tiger_run(), 16, True, "hổ con do trùm 2 gọi ra"),
        ("attack", tiger_attack(), 16, False, "frame 3 = lúc trúng"),
        ("hit", with_(hit(), gait=0, phase=0.25), 12, False, "nháy trắng"),
        ("die", with_(melt(), gait=0, phase=0.25), 16, False, "tan chảy"),
    ]),
    "Primordial": ("Wax/Primordial", "wax_primordial", C256, hum("primordial", 2.6, C256, 2.6), [
        ("walk", humanoid_walk(0.8), 6, True, "bước nặng"),
        ("attack", fix_raise(humanoid_attack()), 8, False, "đập tường rất mạnh; frame 3 = lúc trúng"),
        ("hit", hit(), 12, False, "nháy trắng"),
        ("die", [dict(p, reveal=r) for p, r in zip(melt(8), [0, 0, 0, 0, 0.45, 0.9, 0.75, 0.3])], 8, False,
         "tan chảy, lộ thoáng một hình người bên trong (frame 4-6)"),
        ("shed", primordial_shed(), 8, False,
         "kỹ năng Bong tróc: frame 0-3 vết nứt phát sáng (lặp 0-3 cho đủ 3 giây cảnh báo), 4-7 mảng sáp văng ra"),
    ]),
    "AlphaTiger": ("Wax/AlphaTiger", "wax_alpha_tiger", C256, tiger(2.0, C256, 2.6, boss=True, cx_off=4), [
        ("walk", tiger_run(), 12, True, "chạy"),
        ("attack", tiger_attack(), 12, False, "cắn; frame 3 = lúc trúng"),
        ("hit", with_(hit(), gait=0, phase=0.25), 12, False, "nháy trắng"),
        ("die", with_(melt(8), gait=0, phase=0.25), 10, False, "tan chảy"),
        ("crouch", [tiger_static(crouch=1, tail=t, shake=s) for t, s in ((0, 0.6), (0.6, -0.6), (0, 0.6), (-0.6, -0.6))],
         8, True, "Vồ – cảnh báo: cúi người, lặp trong 2 giây"),
        ("pounce", [tiger_static(crouch=c, stretch=s, rise=r) for c, s, r in
                    ((1, 0, 0), (0.5, 0.5, 6), (0, 1, 18), (0, 1, 22), (0, 0.5, 10), (0.4, 0, 0))],
         10, False, "Vồ – bật nhảy; code dời vị trí theo cung, sprite chỉ nhấc thân"),
        ("headbutt", [tiger_static(head_down=h, crouch=c, step=s) for h, c, s in
                      ((0, 0, 0), (0.6, 0.3, -1), (1, 0.4, -2), (1, 0.2, 6), (0.7, 0.1, 8), (0.2, 0, 2))],
         10, False, "Húc tường – frame 1-2 cúi đầu (giữ 1,5 giây), frame 3 = lúc trúng"),
        ("roar", [tiger_static(head_up=h, mouth=m) for h, m in
                  ((0, 0), (0.5, 0.5), (1, 1), (1, 1), (1, 0.8), (0.4, 0.2))],
         8, False, "Gọi bầy – gầm, triệu hồi hổ con"),
    ]),
    "Warden": ("Squads/Warden", "squad_warden", C128, soldier("warden"), [
        ("idle", soldier_idle(), 4, True, "thở"),
        ("walk", soldier_walk(), 10, True, "đi"),
        ("fire", soldier_fire(), 12, True, "bắn; chớp đầu nòng vẽ sẵn ở frame 1-2"),
        ("skill_hold", warden_hold(), 10, False, "Giữ vững: cắm khiên xuống, khiên phát sáng (giữ frame 3-4 khi kỹ năng còn hiệu lực)"),
        ("die", None, 10, False, "ngã xuống"),
    ]),
    "Hunter": ("Squads/Hunter", "squad_hunter", C128, soldier("hunter"), [
        ("idle", soldier_idle(), 4, True, "thở"),
        ("walk", soldier_walk(), 12, True, "đi / truy đuổi"),
        ("fire", soldier_fire(), 14, True, "bắn; chớp đầu nòng vẽ sẵn ở frame 1-2"),
        ("skill_execute", hunter_execute(), 12, False, "Hạ sát: lao tới đâm lưỡi lê dung môi; frame 3 = lúc trúng"),
        ("die", None, 10, False, "ngã xuống"),
    ]),
}


def extras(only):
    """Non-directional sheets: VFX, props, shared icons."""
    out = []
    if "AlphaTiger" in only:
        poses = [dict(scale=s, alpha=a) for s, a in ((1, 1), (0.95, 0.55), (1, 1), (0.95, 0.55))]
        out.append(("Wax/AlphaTiger", "vfx_pounce_target",
                    single_row((128, 64), lambda fr, p: wax.draw_pounce_target(fr, 64, 32, p), poses)))
    if not only or "Warden" in only:
        bub = [[(-8, 0, 2.5, 1), (12, -2, 0, 0)], [(-8, 0, 3.5, 1), (12, -2, 1.8, 1)],
               [(-8, 0, -1, 0.8), (12, -2, 2.8, 1)], [(4, 4, 1.8, 1), (12, -2, -1, 0.8)]]
        out.append(("Squads/Warden", "squad_warden_tar_trap",
                    single_row((128, 128), lambda fr, p: squads.draw_tar_trap(fr, 64, 66, p),
                               [dict(bubbles=b) for b in bub])))
    if not only or "Shared" in only:
        out.append(("Squads/_Shared", "squad_rank",
                    sheet([[render(32, 32, lambda fr, p: squads.draw_rank(fr, p["n"]), dict(n=n)) for n in (1, 2, 3)]])))
    return out


def build(name):
    folder, prefix, cell, drawer, anims = UNITS[name]
    results = []
    for anim, poses, fps, loop, note in anims:
        if anim == "die" and poses is None:  # soldiers: per-direction fall
            w, h = cell
            rows = [[render(w, h, lambda fr, p, d=d: drawer(fr, d, p), p) for p in soldier_die(d)] for d in DIRS]
            img = sheet(rows)
            n = 6
        else:
            img = directional(cell, drawer, poses)
            n = len(poses)
        results.append((folder, f"{prefix}_{anim}", img, n, fps, loop, note))
    return results


INFO = {
    "Standard": ("Dị Thể Sáp bậc 1 – tiêu chuẩn", "Bản đồ 1 (từ ngày 1), còn ở mọi bản đồ sau",
                 "Người bị hóa sáp (style v2 \"sáp nến\"): cao gầy, khom, tay dài thon dần nhỏ giọt sáp, thân chảy liền xuống vũng sáp bóng; "
                 "sáp trong mờ lõi ấm, mép ánh cam, chấm bóng ướt; hốc mắt có đốm lửa; thấp thoáng hình người tối bên trong. "
                 "Mini-boss ngày 4 của Bản đồ 1 (\"bậc 1 cỡ lớn\") dùng chính bộ này, scale ×1,5."),
    "Shard": ("Sáp vụn (biến thể của bậc 1)", "Bản đồ 1 (từ ngày 3–4), đi theo bầy 10–20 con",
              "Giọt sáp nhỏ hình hạt, nhảy lóc cóc. Cũng là mảng bong ra từ trùm Sáp Nguyên Thủy và Sáp bào tử."),
    "Crab": ("Sáp vỏ cua (biến thể của bậc 1)", "Bản đồ 2 (từ giữa bản đồ)",
             "Bậc 1 gù sau một mai cứng màu hổ phách có gờ và gai, hai càng hai bên; đi chậm. "
             "Mai chỉ che phía trước – từ phía sau (hàng N) thấy thân sáp."),
    "Tiger": ("Dị Thể Sáp bậc 2 – hổ", "Bản đồ 2 (từ ngày 3), còn ở bản đồ 3–5",
              "Hổ hóa sáp: thân dài, thấp, sọc sáp sẫm; nhanh nhất trong các loại Dị Thể Sáp."),
    "TigerCub": ("Hổ con", "Bản đồ 2 – do trùm Hổ Sáp Đầu Đàn gọi ra (kỹ năng Gọi bầy)",
                 "Bản thu nhỏ của bậc 2, nhỏ, nhanh, máu thấp."),
    "Primordial": ("Trùm 1 – Sáp Nguyên Thủy", "Bản đồ 1, ngày 8",
                   "Bậc 1 khổng lồ, người đầu tiên trong vùng bị hóa sáp; trên người còn mảnh áo xanh bạc màu "
                   "và cổ áo rách, thân có vết nứt (phát sáng cam khi dùng Bong tróc)."),
    "AlphaTiger": ("Trùm 2 – Hổ Sáp Đầu Đàn", "Bản đồ 2, ngày 10",
                   "Hổ đầu đàn: to gấp đôi bậc 2, đầy sẹo, cổ còn vòng xích gãy lủng lẳng."),
    "Warden": ("Lính trấn thủ", "Mở khóa cùng R03 · đứng cố định trên tường thành",
               "Đồ bảo hộ trắng, dải cam ngang ngực, kính mũ vàng, sọc cam trên đỉnh mũ; khiên chống bạo động "
               "(tay trái) và súng trường (tay phải)."),
    "Hunter": ("Thợ săn", "Mở khóa qua R04 · di chuyển, truy đuổi",
               "Đồ bảo hộ trắng, dải cam chéo, kính mũ vàng, ăng-ten đầu xanh; bình dung môi xanh trên lưng, "
               "súng trường có lưỡi lê tẩm dung môi."),
}

EXTRA_DOC = {
    "Wax/AlphaTiger": [("vfx_pounce_target", "1 hàng × 4 frame", 8, "128×64", "Vạch đỏ chỉ điểm rơi của cú Vồ (nhấp nháy); pivot Center")],
    "Squads/Warden": [("squad_warden_tar_trap", "1 hàng × 4 frame", 6, "128×128",
                       "Bẫy hắc ín (nhánh đặt bẫy, R06): vũng hắc ín sủi bọt, lặp; pivot Center")],
}


def write_readme(name, entries):
    folder, prefix, cell, _, _ = UNITS[name]
    title, where, look = INFO[name]
    cw, ch = cell
    feet = int(ch * PIVOT_Y)
    lines = [f"# {title} ({os.path.basename(folder)})", "",
             f"Xuất hiện: {where}", "",
             "## Hình dáng", f"- {look}",
             "- Góc 3/4 từ trên cao, ánh sáng từ trên bên trái, viền tím than `#2c2240`, mỗi màu 3 tông "
             "(cùng quy ước với sprite tháp và bản đồ)", "",
             "## File (placeholder dựng bằng code)", "",
             "| File | Bố cục | fps | Lặp | Ghi chú |", "|---|---|---|---|---|"]
    for _, fname, img, n, fps, loop, note in entries:
        lines.append(f"| `{fname}.png` | 3 hàng (S, E, N) × {n} frame | {fps} | {'có' if loop else 'không'} | {note} |")
    lines += ["", "## Thông số Unity",
              f"- Ô sprite {cw}×{ch}, Pixels Per Unit = 128 (1 ô xây = 1 unit)",
              f"- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô {feet} px",
              "- Hàng 0 = S (về phía camera), hàng 1 = E (quay phải), hàng 2 = N (quay đi). Hướng W dùng hàng E + flipX",
              "- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 90°)` (trục y của Unity hướng lên): "
              "0 = E, 1 = N, -1 = S, ±2 = W",
              "- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. "
              "Muốn áp lại: Tools > Units > Reapply Sprite Import Settings",
              "- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite",
              "", "## Thay bằng bản vẽ thật",
              "Giữ nguyên kích thước ô, vị trí chân (pivot), số hàng và số frame để thay thẳng vào. "
              "Muốn đổi số frame thì sửa luôn bảng này và báo người code.",
              f"Dựng lại placeholder: `python3 Tools/ArtGen/gen_units.py --only {name}`", ""]
    with open(os.path.join(ART, folder, "README.md"), "w") as f:
        f.write("\n".join(lines))


def write_extra_docs():
    for folder, rows in EXTRA_DOC.items():
        path = os.path.join(ART, folder, "README.md")
        if not os.path.exists(path):
            continue
        with open(path, "a") as f:
            f.write("\n## Sprite phụ\n\n| File | Bố cục | fps | Ô | Ghi chú |\n|---|---|---|---|---|\n")
            for fname, layout, fps, c, note in rows:
                f.write(f"| `{fname}.png` | {layout} | {fps} | {c} | {note} |\n")


def preview(img, cell, path, scale=2):
    """Checker background + 2x nearest scale so the sheet is easy to eyeball."""
    w, h = img.size
    bg = Image.new("RGBA", (w, h), (92, 112, 74, 255))
    arr = np.array(bg)
    yy, xx = np.mgrid[0:h, 0:w]
    arr[((xx // 16 + yy // 16) % 2) == 0] = (104, 124, 84, 255)
    bg = Image.fromarray(arr)
    bg.alpha_composite(img)
    bg.resize((w * scale, h * scale), Image.NEAREST).save(path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview")
    ap.add_argument("--only", default="")
    ap.add_argument("--dry", action="store_true", help="previews only, do not write into Assets")
    ap.add_argument("--docs", action="store_true", help="only rewrite the folder READMEs")
    ap.add_argument("--legacy-wax", action="store_true",
                    help="also rebuild the old code-drawn wax sheets (they now come from gen_wax_from_art.py)")
    args = ap.parse_args()
    only = [s for s in args.only.split(",") if s]
    if not args.legacy_wax:  # wax art is AI-drawn now; never overwrite it by accident
        keep = [n for n in UNITS if not UNITS[n][0].startswith("Wax/")]
        only = [n for n in (only or keep) if n in keep] or ["Shared"]
    if args.docs:
        for name, (folder, prefix, cell, _, anims) in UNITS.items():
            if only and name not in only:
                continue
            entries = [(folder, f"{prefix}_{a}", None, len(p) if p is not None else 6, fps, loop, note)
                       for a, p, fps, loop, note in anims]
            write_readme(name, entries)
        write_extra_docs()
        return
    manifest = []
    per_unit = {}
    for name in UNITS:
        if only and name not in only:
            continue
        per_unit[name] = build(name)
        for folder, fname, img, n, fps, loop, note in per_unit[name]:
            manifest.append((folder, fname, img, n, fps, loop, note, UNITS[name][2]))
    for folder, fname, img in extras(only):
        manifest.append((folder, fname, img, None, None, None, None, None))
    if not args.dry:
        for name, entries in per_unit.items():
            os.makedirs(os.path.join(ART, UNITS[name][0]), exist_ok=True)
            write_readme(name, entries)
        write_extra_docs()
    for folder, fname, img, *_ in manifest:
        if not args.dry:
            d = os.path.join(ART, folder)
            os.makedirs(d, exist_ok=True)
            img.save(os.path.join(d, fname + ".png"), optimize=True)
        if args.preview:
            os.makedirs(args.preview, exist_ok=True)
            preview(img, None, os.path.join(args.preview, fname + ".png"))
        print(f"{folder}/{fname}.png  {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()
