"""Build a skeletal-animation rig for a humanoid wax creature from a ChatGPT parts sheet.

Input: a parts sheet (magenta background already removed) laid out as
  left third  = the whole creature assembled (A-pose),
  right side  = 6 separate pieces: head (top), torso (middle), arm_L / arm_R
                (left and right of the torso), leg_L / leg_R (bottom).

Output (all in Tools/ArtGen/source/wax/rig/<name>/; experimental, kept out of Assets/ so Unity does not import it):
  - <prefix>_rig.psb   layered PSB for Unity's PSD Importer (Character Rig), 2x game size, 256 PPU
  - rig.json           part positions, joint pivots, suggested bones (PSB pixels, y down)
  - parts_hires/       the cut pieces at full resolution
  - bone_guide.png     where to put the bones in the Skinning Editor
  - preview_*.gif      the walk/attack clips from clips.json played on the rig

Usage:
  sprite-gen cutout sheet.png --key magenta --out sheet_cut.png
  python Tools/ArtGen/rig_humanoid.py sheet_cut.png --name standard --folder Standard \
      --game-height 104 --clips Tools/ArtGen/source/wax/rig/standard/clips.json

Needs: numpy, scipy, Pillow, opencv-python-headless, psd-tools.
"""
import argparse, json, math, os
import numpy as np, cv2
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from psd_tools import PSDImage
from psd_tools.api.layers import PixelLayer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ORDER = ["leg_L", "leg_R", "arm_L", "arm_R", "torso", "head"]          # back to front
PARENT = {"torso": None, "head": "torso", "arm_L": "torso", "arm_R": "torso", "leg_L": None, "leg_R": None}
SEARCH = {"head": (range(-4, 5, 2), (0.94, 0.97, 1, 1.03)), "torso": (range(-4, 5, 2), (0.94, 0.97, 1, 1.03)),
          "arm_L": (range(-20, 21, 2), (0.92, 0.96, 1, 1.04)), "arm_R": (range(-20, 21, 2), (0.92, 0.96, 1, 1.04)),
          "leg_L": (range(-14, 15, 2), (0.92, 0.96, 1, 1.04)), "leg_R": (range(-14, 15, 2), (0.92, 0.96, 1, 1.04))}


def find_pieces(rgba):
    """Label the sheet; the biggest blob is the assembled figure, the rest are named by layout."""
    lab, _ = ndi.label(ndi.binary_dilation(rgba[..., 3] > 40, iterations=2))
    blobs = []
    for i, sl in enumerate(ndi.find_objects(lab)):
        area = int((lab[sl] == i + 1).sum())
        if area >= 1500:
            blobs.append(dict(id=i + 1, area=area, box=(sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)))
    if len(blobs) != 7:
        raise SystemExit(f"expected 7 pieces (assembled + 6 parts), found {len(blobs)}")
    blobs.sort(key=lambda b: -b["area"])
    named = {"assembled": blobs[0]}
    rest = blobs[1:]
    cy = lambda b: (b["box"][1] + b["box"][3]) / 2
    cx = lambda b: (b["box"][0] + b["box"][2]) / 2
    rest.sort(key=cy)
    named["head"] = rest[0]
    legs = sorted(rest[-2:], key=cx)
    named["leg_L"], named["leg_R"] = legs
    mid = sorted(rest[1:4], key=cx)                     # arm_L, torso, arm_R from left to right
    named["arm_L"], named["torso"], named["arm_R"] = mid
    return lab, named


def crop_piece(rgba, lab, blob, pad):
    x0, y0, x1, y1 = blob["box"]
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(rgba.shape[1], x1 + pad), min(rgba.shape[0], y1 + pad)
    p = rgba[y0:y1, x0:x1].copy()
    p[..., 3] = np.where(lab[y0:y1, x0:x1] == blob["id"], p[..., 3], 0)
    return p


def on_grey(rgba):
    a = rgba[..., 3:4] / 255.0
    return (rgba[..., :3] * a + 128 * (1 - a)).astype(np.float32)


def fit(piece, target_grey, rots, scales):
    """Best rotation/scale/position of a piece over the assembled figure (masked squared difference)."""
    best = None
    for s in scales:
        ps = cv2.resize(piece, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        h, w = ps.shape[:2]
        for r in rots:
            M = cv2.getRotationMatrix2D((w / 2, h / 2), r, 1.0)
            c, sn = abs(M[0, 0]), abs(M[0, 1])
            W, H = int(h * sn + w * c) + 2, int(h * c + w * sn) + 2
            M[0, 2] += W / 2 - w / 2
            M[1, 2] += H / 2 - h / 2
            pr = cv2.warpAffine(ps, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
            mask = (pr[..., 3] > 128).astype(np.float32)
            if mask.sum() < 100 or W >= target_grey.shape[1] or H >= target_grey.shape[0]:
                continue
            sc = cv2.matchTemplate(target_grey, on_grey(pr), cv2.TM_SQDIFF, mask=np.dstack([mask] * 3)) / mask.sum()
            mn, _, loc, _ = cv2.minMaxLoc(sc)
            if best is None or mn < best[0]:
                best = (mn, pr, loc)
    return best


def row_centre(img, frac, from_top=True):
    a = np.array(img)[..., 3] > 128
    ys = np.where(a.any(1))[0]
    row = int(ys.min() + frac * (ys.max() - ys.min())) if from_top else int(ys.max() - frac * (ys.max() - ys.min()))
    xs = np.where(a[row])[0]
    return (xs.min() + xs.max()) / 2, row


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet", help="parts sheet with the background already removed")
    ap.add_argument("--name", required=True, help="rig folder name, e.g. standard")
    ap.add_argument("--folder", required=True, help="Assets/Art/Wax/<Folder> the creature belongs to (recorded only)")
    ap.add_argument("--prefix", default=None, help="file prefix (default wax_<name>)")
    ap.add_argument("--game-height", type=float, required=True, help="creature height in game px at 128 PPU")
    ap.add_argument("--clips", default=None, help="clips.json to preview (keyframes per part)")
    a = ap.parse_args()
    prefix = a.prefix or f"wax_{a.name}"
    src = os.path.join(ROOT, "Tools/ArtGen/source/wax/rig", a.name)
    os.makedirs(os.path.join(src, "parts_hires"), exist_ok=True)

    rgba = np.array(Image.open(a.sheet).convert("RGBA"))
    lab, named = find_pieces(rgba)
    asm = crop_piece(rgba, lab, named["assembled"], pad=60)
    target = on_grey(asm)

    parts = {}
    for n in ORDER:
        mn, img, (x, y) = fit(crop_piece(rgba, lab, named[n], pad=4), target, *SEARCH[n])
        im = Image.fromarray(img)
        bb = im.getbbox()
        parts[n] = dict(img=im.crop(bb), x=x + bb[0], y=y + bb[1], score=round(mn, 1))
        print(f"{n:6s} fit score {mn:8.1f}")

    # joints in assembled-figure pixels
    for n, p in parts.items():
        if n.startswith(("arm", "leg")):
            px, py = row_centre(p["img"], 0.10)                 # shoulder / hip socket
        elif n == "torso":
            px, py = row_centre(p["img"], 0.12, from_top=False)  # hip centre = root
        else:
            continue
        p["pivot"] = (p["x"] + px, p["y"] + py)
    tx, ty = row_centre(parts["torso"]["img"], 0.06)               # neck = top of the torso
    parts["head"]["pivot"] = (parts["torso"]["x"] + tx, parts["torso"]["y"] + ty)

    comp = Image.new("RGBA", asm.shape[1::-1])
    for n in ORDER:
        comp.alpha_composite(parts[n]["img"], (parts[n]["x"], parts[n]["y"]))
    m1, m2 = asm[..., 3] > 128, np.array(comp)[..., 3] > 128
    print("reassembled vs assembled, alpha IoU:", round((m1 & m2).sum() / (m1 | m2).sum(), 3))

    # scale to 2x game size, 256 PPU
    top = min(p["y"] for p in parts.values())
    bottom = max(p["y"] + p["img"].height for p in parts.values())
    s = 2 * a.game_height / (bottom - top)
    pad = 24
    left = min(p["x"] for p in parts.values())
    right = max(p["x"] + p["img"].width for p in parts.values())
    CW, CH = math.ceil((right - left) * s + 2 * pad), math.ceil((bottom - top) * s + 2 * pad)
    ox, oy = left * s - pad, top * s - pad
    psd = PSDImage.new("RGBA", (CW, CH))
    psd._record.header.version = 2                                 # PSB
    out = {}
    for n in ORDER:
        p = parts[n]
        p["img"].save(os.path.join(src, "parts_hires", f"{prefix}_{n}.png"))
        im = p["img"].resize((max(1, round(p["img"].width * s)), max(1, round(p["img"].height * s))), Image.LANCZOS)
        x, y = round(p["x"] * s - ox), round(p["y"] * s - oy)
        psd.append(PixelLayer.frompil(im, psd, n, y, x))
        out[n] = dict(top_left=[x, y], size=list(im.size), parent=PARENT[n],
                      pivot=[round(p["pivot"][0] * s - ox, 1), round(p["pivot"][1] * s - oy, 1)], img=im)
    psb_path = os.path.join(src, f"{prefix}_rig.psb")
    psd.save(psb_path)

    # suggested bones: hip -> chest -> head, chest -> upper arm -> forearm, hip -> thigh -> shin
    def along(n, f):
        cx_, row = row_centre(out[n]["img"], f)
        return (out[n]["top_left"][0] + cx_, out[n]["top_left"][1] + row)
    hip, neck = tuple(out["torso"]["pivot"]), tuple(out["head"]["pivot"])
    chest = ((hip[0] + neck[0]) / 2, (hip[1] + neck[1]) / 2)
    bones = {"hip": (hip, chest, None), "chest": (chest, neck, "hip"),
             "head": (neck, (neck[0], out["head"]["top_left"][1] + out["head"]["size"][1] * 0.25), "chest")}
    for sd in "LR":
        sh, hp = tuple(out["arm_" + sd]["pivot"]), tuple(out["leg_" + sd]["pivot"])
        bones["upper_arm_" + sd] = (sh, along("arm_" + sd, 0.5), "chest")
        bones["forearm_" + sd] = (along("arm_" + sd, 0.5), along("arm_" + sd, 0.9), "upper_arm_" + sd)
        bones["thigh_" + sd] = (hp, along("leg_" + sd, 0.5), "hip")
        bones["shin_" + sd] = (along("leg_" + sd, 0.5), along("leg_" + sd, 0.92), "thigh_" + sd)

    K = 3
    g = Image.new("RGBA", (CW * K, CH * K), (240, 240, 240, 255))
    for n in ORDER:
        o = out[n]
        g.alpha_composite(o["img"].resize((o["size"][0] * K, o["size"][1] * K), Image.LANCZOS),
                          (o["top_left"][0] * K, o["top_left"][1] * K))
    g.alpha_composite(Image.new("RGBA", g.size, (255, 255, 255, 110)))
    d = ImageDraw.Draw(g)
    for b, (p0, p1, _) in bones.items():
        d.line([(p0[0] * K, p0[1] * K), (p1[0] * K, p1[1] * K)], fill=(220, 40, 90), width=7)
        d.ellipse([p0[0] * K - 9, p0[1] * K - 9, p0[0] * K + 9, p0[1] * K + 9], fill=(40, 40, 160))
    d.ellipse([hip[0] * K - 14, hip[1] * K - 14, hip[0] * K + 14, hip[1] * K + 14], outline=(0, 150, 0), width=5)
    g.convert("RGB").save(os.path.join(src, "bone_guide.png"))

    rig = dict(character=prefix, psb=os.path.relpath(psb_path, ROOT), canvas=[CW, CH], pixels_per_unit=256,
               feet_y=round(bottom * s - oy, 1), layer_order_back_to_front=ORDER,
               parts={n: {k: v for k, v in o.items() if k != "img"} for n, o in out.items()},
               bones={b: dict(start=[round(v, 1) for v in p0], end=[round(v, 1) for v in p1], parent=par)
                      for b, (p0, p1, par) in bones.items()})
    json.dump(rig, open(os.path.join(src, "rig.json"), "w"), indent=2)
    print("PSB", psb_path, (CW, CH))

    if a.clips:
        preview(rig, out, json.load(open(a.clips)), src)


def preview(rig, out, clips, dst, fps=30):
    """Play the clips on the rig (cut-out: each part turns about its joint) and save GIFs."""
    P = rig["parts"]
    rest = dict(rot=0, dx=0, dy=0, sx=1, sy=1)

    def sample(keys, t, loop, length):
        if loop:
            t %= length
        if t <= keys[0][0]:
            return keys[0][1]
        for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
            if t <= t1:
                u = 0.5 - 0.5 * math.cos(math.pi * (t - t0) / (t1 - t0))
                return v0 + (v1 - v0) * u
        return keys[-1][1]

    def T(x, y):
        return np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], float)

    def RS(p, deg, sx, sy):
        r = math.radians(deg)
        R = np.array([[math.cos(r), math.sin(r), 0], [-math.sin(r), math.cos(r), 0], [0, 0, 1]])
        return T(*p) @ R @ np.diag([sx, sy, 1]) @ T(-p[0], -p[1])

    PAD = 120
    W, H = rig["canvas"][0] + 2 * PAD, rig["canvas"][1] + PAD
    imgs = {n: np.array(out[n]["img"]) for n in ORDER}

    def frame(clip, t):
        C = clips[clip]
        world = {}
        for n in ["torso", "head", "arm_L", "arm_R", "leg_L", "leg_R"]:
            ch = dict(rest)
            for k, keys in C.get(n, {}).items():
                ch[k] = sample(keys, t, C["loop"], C["length"])
            local = T(ch["dx"], ch["dy"]) @ RS([P[n]["pivot"][0] + PAD, P[n]["pivot"][1] + PAD], ch["rot"], ch["sx"], ch["sy"])
            world[n] = world[PARENT[n]] @ local if PARENT[n] else local
        canvas = Image.new("RGBA", (W, H))
        for n in ORDER:
            M = world[n] @ T(P[n]["top_left"][0] + PAD, P[n]["top_left"][1] + PAD)
            canvas.alpha_composite(Image.fromarray(cv2.warpAffine(imgs[n], M[:2], (W, H), flags=cv2.INTER_LINEAR)))
        return canvas

    seq = []
    for clip in ("walk", "attack", "walk"):
        if clip in clips:
            seq += [(clip, i / fps) for i in range(int(clips[clip]["length"] * fps))]
    big = []
    for clip, t in seq:
        f = frame(clip, t)
        b = Image.new("RGBA", f.size, (245, 245, 245, 255))
        b.alpha_composite(f)
        big.append(b.convert("RGB").resize((f.width * 2, f.height * 2), Image.LANCZOS))
    big[0].save(os.path.join(dst, "preview_walk_attack.gif"), save_all=True, append_images=big[1:],
                duration=1000 // fps, loop=0)
    print("preview", len(big), "frames")


if __name__ == "__main__":
    main()
