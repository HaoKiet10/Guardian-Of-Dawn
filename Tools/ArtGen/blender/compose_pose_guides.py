"""Put the 4 walk frames rendered by squad_pose_guides.py side by side, one image per direction.

Usage: python Tools/ArtGen/blender/compose_pose_guides.py <frames dir> <output dir>
Writes <soldier>_walk_<s|e|n>_guide.png with frames 1-4 left to right, numbered.
"""
import glob
import os
import re
import sys

from PIL import Image, ImageDraw


def main(frames, out):
    os.makedirs(out, exist_ok=True)
    groups = {}
    for path in glob.glob(os.path.join(frames, "*_walk_*_*.png")):
        m = re.match(r"(.+_walk_[sen])_(\d)\.png$", os.path.basename(path))
        if m:
            groups.setdefault(m.group(1), {})[int(m.group(2))] = path
    for name, frames_by_n in sorted(groups.items()):
        ims = [Image.open(frames_by_n[n]).convert("RGB") for n in sorted(frames_by_n)]
        w, h = ims[0].size
        sheet = Image.new("RGB", (w * len(ims), h), (237, 237, 237))
        draw = ImageDraw.Draw(sheet)
        for i, im in enumerate(ims):
            sheet.paste(im, (i * w, 0))
            draw.text((i * w + 12, 10), str(i + 1), fill=(60, 60, 60))
        dst = os.path.join(out, name + "_guide.png")
        sheet.save(dst)
        print(dst)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
