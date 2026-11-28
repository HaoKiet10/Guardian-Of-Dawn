"""Render walk-cycle POSE GUIDES for the squad soldiers with Blender (headless).

The guides are not game art: a simple mannequin with the soldier's proportions and gear
shapes (helmet, cloak, shield or rifle), shown in the 4 key poses of a walk cycle from the
game's camera (orthographic, 40 degrees from above). They are attached to Google Flow as a
pose reference so the drawn frames keep the right leg positions, size and baseline.

Usage (repo root):
    E:/Blender/blender.exe -b --factory-startup -P Tools/ArtGen/blender/squad_pose_guides.py -- \
        --soldier warden --out <frames dir>
    python Tools/ArtGen/blender/compose_pose_guides.py <frames dir> Tools/ArtGen/source/squad_pose_guides

Colours only help reading the pose: the soldier's LEFT limbs are dark, RIGHT limbs light.
"""
import argparse
import math
import os
import sys

import bpy

DEG = math.pi / 180.0

# ---------------------------------------------------------------- the walk
# (body height offset, {joint: degrees}) per key pose. Swing: + = forward. Knee/elbow: + = bent.
WALK = [
    # 1 CONTACT: right heel forward, left foot back on its toes, body lowest
    (-0.025, dict(r_thigh=28, r_knee=4, l_thigh=-22, l_knee=22, r_arm=-16, l_arm=16)),
    # 2 PASSING: standing on the right leg, left knee lifted passing forward, body highest
    (0.02, dict(r_thigh=-4, r_knee=2, l_thigh=18, l_knee=55, r_arm=0, l_arm=0)),
    # 3 CONTACT (opposite)
    (-0.025, dict(l_thigh=28, l_knee=4, r_thigh=-22, r_knee=22, l_arm=-16, r_arm=16)),
    # 4 PASSING (opposite)
    (0.02, dict(l_thigh=-4, l_knee=2, r_thigh=18, r_knee=55, l_arm=0, r_arm=0)),
]

FACINGS = {"s": 0.0, "e": 90.0, "n": 180.0}   # rotation about Z; the mannequin faces -Y at 0

GREY = (0.55, 0.57, 0.62, 1)
DARK = (0.28, 0.30, 0.38, 1)     # left limbs
LIGHT = (0.80, 0.80, 0.84, 1)    # right limbs
SKIN = (0.86, 0.68, 0.55, 1)
CLOAK = (0.93, 0.94, 0.97, 1)
GEAR = (0.42, 0.44, 0.48, 1)
STRIPE = (1.0, 0.55, 0.24, 1)


def clear():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)


def empty(name, parent=None, loc=(0, 0, 0)):
    e = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(e)
    e.parent = parent
    e.location = loc
    return e


def box(name, size, loc, color, parent, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    o.parent = parent
    o.location = loc
    o.rotation_euler = tuple(r * DEG for r in rot)
    o.color = color
    bevel(o, 0.25)
    return o


def ball(name, radius, loc, color, parent, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=(0, 0, 0), segments=24, ring_count=12)
    o = bpy.context.active_object
    o.name = name
    o.parent = parent
    o.location = loc
    o.scale = scale
    o.color = color
    bpy.ops.object.shade_smooth()
    return o


def limb(name, length, radius, color, parent):
    """A capsule hanging down from its parent's origin (the joint)."""
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=length, location=(0, 0, 0), vertices=16)
    o = bpy.context.active_object
    o.name = name
    o.parent = parent
    o.location = (0, 0, -length / 2)
    o.color = color
    bpy.ops.object.shade_smooth()
    return o


def bevel(o, width):
    m = o.modifiers.new("bevel", "BEVEL")
    m.width = width * min(o.scale)
    m.segments = 3


# --------------------------------------------------------------- mannequin
def build(soldier):
    """Chunky ~3-heads-tall soldier, feet at the origin, facing -Y. Returns (root, joints)."""
    root = empty("root")
    body = empty("body", root, (0, 0, 0))
    hip_z, thigh, shin = 0.30, 0.15, 0.14
    j = {}

    pelvis = empty("pelvis", body, (0, 0, hip_z))
    box("hips", (0.30, 0.20, 0.10), (0, 0, 0.02), GREY, pelvis)
    box("torso", (0.34, 0.24, 0.30), (0, 0, 0.21), GREY, pelvis)
    box("vest", (0.30, 0.06, 0.22), (0, -0.13, 0.21), GEAR, pelvis)
    head = empty("head", pelvis, (0, 0, 0.50))
    ball("helmet", 0.19, (0, 0.02, 0.07), GREY, head, (1, 1, 0.92))
    # orange stripe: a thin slice of a slightly bigger helmet, front to back over the top
    ball("stripe", 0.196, (0, 0.02, 0.07), STRIPE, head, (0.22, 1, 0.93))
    box("face", (0.19, 0.10, 0.15), (0, -0.15, -0.06), SKIN, head)
    box("visor up", (0.26, 0.08, 0.05), (0, -0.12, 0.17), (1.0, 0.8, 0.3, 1), head, (-40, 0, 0))

    for side, sx, col in (("l", 1, DARK), ("r", -1, LIGHT)):
        # the soldier's left is +X when he faces -Y (toward the camera)
        hip = empty(f"{side}_thigh", pelvis, (0.085 * sx, 0, 0))
        limb(f"{side}_thigh_mesh", thigh, 0.065, col, hip)
        knee = empty(f"{side}_knee", hip, (0, 0, -thigh))
        limb(f"{side}_shin_mesh", shin, 0.06, col, knee)
        box(f"{side}_boot", (0.12, 0.17, 0.07), (0, -0.03, -shin - 0.01), col, knee)
        j[f"{side}_thigh"], j[f"{side}_knee"] = hip, knee

        shoulder = empty(f"{side}_arm", pelvis, (0.21 * sx, 0, 0.32))
        limb(f"{side}_upper_arm", 0.13, 0.055, col, shoulder)
        elbow = empty(f"{side}_elbow", shoulder, (0, 0, -0.13))
        elbow.rotation_euler = (-35 * DEG, 0, 0)
        limb(f"{side}_forearm", 0.11, 0.05, col, elbow)
        ball(f"{side}_hand", 0.05, (0, 0, -0.12), col, elbow)
        j[f"{side}_arm"], j[f"{side}_hand"] = shoulder, elbow

    if soldier == "warden":
        # long cloak, but only to the knees so the steps still read from behind
        box("cloak", (0.42, 0.03, 0.40), (0, 0.15, 0.13), CLOAK, pelvis, (10, 0, 0))
        # riot shield carried upright at his left side, rifle low in the right hand
        # broad face toward the front, beside his left leg, as in the concept's front view
        box("shield", (0.26, 0.05, 0.44), (0.27, -0.12, -0.06), GEAR, pelvis, (0, 0, -20))
        box("shield edge", (0.27, 0.055, 0.035), (0.27, -0.12, 0.16), STRIPE, pelvis, (0, 0, -20))
        box("rifle", (0.04, 0.34, 0.05), (0, -0.12, -0.10), (0.2, 0.2, 0.22, 1), j["r_hand"], (-40, 0, 0))
    elif soldier == "hunter":
        box("cloak", (0.40, 0.03, 0.22), (0, 0.14, 0.24), CLOAK, pelvis, (12, 0, 0))
        box("rifle", (0.04, 0.50, 0.05), (-0.03, -0.20, -0.08), (0.2, 0.2, 0.22, 1), j["r_hand"], (-55, 0, 25))
        box("canister", (0.07, 0.07, 0.11), (-0.18, 0.02, 0.0), (0.6, 1.0, 0.3, 1), pelvis)
    elif soldier == "engineer":
        box("cloak", (0.40, 0.03, 0.22), (0, 0.14, 0.24), CLOAK, pelvis, (12, 0, 0))
        box("backpack", (0.32, 0.18, 0.34), (0, 0.22, 0.24), GEAR, pelvis)
        box("arm folded", (0.05, 0.05, 0.30), (0.10, 0.26, 0.52), (0.35, 0.36, 0.4, 1), pelvis, (15, 0, 0))
        box("wrench", (0.05, 0.05, 0.40), (0, -0.02, 0.10), (0.5, 0.52, 0.55, 1), j["r_hand"], (150, 0, 0))
    return root, body, j


def pose(body, joints, offset, angles):
    body.location.z = offset
    for side in ("l", "r"):
        # swing: + = forward; the mannequin faces -Y, so forward is a negative X rotation
        joints[f"{side}_thigh"].rotation_euler = (-angles.get(f"{side}_thigh", 0) * DEG, 0, 0)
        joints[f"{side}_knee"].rotation_euler = (angles.get(f"{side}_knee", 0) * DEG, 0, 0)
        joints[f"{side}_arm"].rotation_euler = (-angles.get(f"{side}_arm", 0) * DEG, 0, 0)


# ------------------------------------------------------------------ render
def setup_render(size):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.resolution_x = scene.render.resolution_y = size
    scene.render.film_transparent = False
    shading = scene.display.shading
    shading.light = "STUDIO"
    shading.color_type = "OBJECT"
    shading.show_object_outline = True
    shading.object_outline_color = (0.17, 0.13, 0.25)
    shading.show_shadows = False
    shading.background_type = "VIEWPORT"
    shading.background_color = (0.93, 0.93, 0.93)
    scene.view_settings.view_transform = "Standard"

    cam_data = bpy.data.cameras.new("cam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 1.6
    cam = bpy.data.objects.new("cam", cam_data)
    scene.collection.objects.link(cam)
    elev = 40 * DEG
    dist = 10
    cam.location = (0, -dist * math.cos(elev), dist * math.sin(elev) + 0.45)
    cam.rotation_euler = (90 * DEG - elev, 0, 0)
    scene.camera = cam

    # ground line, so the baseline and foot contacts read
    bpy.ops.mesh.primitive_circle_add(radius=0.28, fill_type="NGON", location=(0, 0, 0.001))
    shadow = bpy.context.active_object
    shadow.scale = (1, 0.55, 1)
    shadow.color = (0.78, 0.78, 0.8, 1)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--soldier", default="warden", choices=["warden", "hunter", "engineer"])
    ap.add_argument("--out", required=True)
    ap.add_argument("--size", type=int, default=512)
    args = ap.parse_args(argv)

    clear()
    setup_render(args.size)
    root, body, joints = build(args.soldier)
    os.makedirs(args.out, exist_ok=True)
    for facing, angle in FACINGS.items():
        root.rotation_euler = (0, 0, angle * DEG)
        for i, (offset, angles) in enumerate(WALK):
            pose(body, joints, offset, angles)
            bpy.context.view_layer.update()
            bpy.context.scene.render.filepath = os.path.join(args.out, f"{args.soldier}_walk_{facing}_{i + 1}.png")
            bpy.ops.render.render(write_still=True)
    print("rendered", args.soldier, "to", args.out)


main()
