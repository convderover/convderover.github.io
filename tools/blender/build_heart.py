"""Procedural, stylised heart for the portfolio hero.

Run with Blender's Python module (bpy 5.x) or inside Blender:
    python tools/blender/build_heart.py --out assets/models/heart-raw.glb [--preview preview.png]

The geometry is an ILLUSTRATIVE sculpture, not patient anatomy. It is built from
simple primitives so every proportion is documented here:

1. Myocardium: metaball ellipsoids (ventricles, atria, auricles) with negative
   capsules carving the interventricular and atrioventricular grooves.
2. Great vessels: bevelled curves (aorta + arch branches, pulmonary trunk and
   arteries, venae cavae, pulmonary veins).
3. Union: joined and voxel-remeshed into a single watertight surface, then
   Laplacian-smoothed (fillets at the junctions) and decimated for the web.
4. Region weights (myocardium / arterial / venous) are stored as vertex colours
   so the web shader can recolour the model per theme.
5. Coronary arteries: tapered tubes snapped to the surface with a BVH tree.
6. Chambers: four smoothed internal volumes for the transparent "signal" view.
7. Conduction paths (SA node -> AV node -> His -> bundle branches -> Purkinje)
   are exported as node extras (JSON point lists) for the pulse animation.

All parts share one pivot at the visual centre of the heart and are named so
three.js can address them: Heart, Coronaries, Chambers, Conduction.
"""

import argparse
import json
import math
import sys

import bpy  # must be imported first when running as a Python module (bpy wheel)
import bmesh
from mathutils import Matrix, Quaternion, Vector
from mathutils.bvhtree import BVHTree

# ---------------------------------------------------------------- helpers


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    return scene


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def catmull_rom(points, samples_per_segment=10):
    """Centripetal-ish Catmull-Rom through control points (list of tuples)."""
    pts = [Vector(p) for p in points]
    if len(pts) < 2:
        return pts
    ext = [pts[0] + (pts[0] - pts[1])] + pts + [pts[-1] + (pts[-1] - pts[-2])]
    out = []
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        for s in range(samples_per_segment):
            t = s / samples_per_segment
            t2, t3 = t * t, t * t * t
            out.append(
                0.5
                * (
                    (2 * p1)
                    + (-p0 + p2) * t
                    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
                )
            )
    out.append(pts[-1])
    return out


def look_rotation(direction):
    """Quaternion rotating +X onto direction (metaball capsules lie on X)."""
    d = Vector(direction).normalized()
    return Vector((1, 0, 0)).rotation_difference(d)


def evaluated_mesh(obj, name):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    obj_eval = obj.evaluated_get(depsgraph)
    me = bpy.data.meshes.new_from_object(obj_eval, preserve_all_data_layers=True, depsgraph=depsgraph)
    me.name = name
    return me


def mesh_object(name, me):
    obj = bpy.data.objects.new(name, me)
    return link(obj)


def apply_modifiers(obj, name):
    me = evaluated_mesh(obj, name)
    old = obj.data
    obj.modifiers.clear()
    obj.data = me
    if old.users == 0:
        bpy.data.meshes.remove(old)
    return obj


def tube_mesh(name, points, radii, bevel_res=4, caps=True):
    """Bevelled poly curve -> mesh. radii is one value per point."""
    cu = bpy.data.curves.new(name + "_curve", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 1.0
    cu.bevel_resolution = bevel_res
    cu.use_fill_caps = caps
    cu.twist_mode = "MINIMUM"
    spline = cu.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for p, co, r in zip(spline.points, points, radii):
        p.co = (co.x, co.y, co.z, 1.0)
        p.radius = r
    obj = link(bpy.data.objects.new(name + "_tmp", cu))
    me = evaluated_mesh(obj, name)
    bpy.data.objects.remove(obj)
    bpy.data.curves.remove(cu)
    return me


def join_meshes(name, meshes):
    bm = bmesh.new()
    for me in meshes:
        bm.from_mesh(me)
    out = bpy.data.meshes.new(name)
    bm.to_mesh(out)
    bm.free()
    return out


# ---------------------------------------------------------------- anatomy
# Blender coordinates, anterior view looks along +Y. Patient left = +X. Up = +Z.

LONG_AXIS = Vector((0.40, -0.28, -0.87)).normalized()  # base -> apex
RV_AXIS = Vector((0.26, -0.30, -0.92)).normalized()
K = 1 / 0.64  # metaball field -> visible surface (stiffness 2, threshold 0.6), measured empirically


def axis_quat(axis=LONG_AXIS):
    """Quaternion aligning the element's local +Z with a given axis."""
    return Vector((0, 0, 1)).rotation_difference(axis)


def semi(x, y, z):
    """Desired visible semi-axes -> metaball ellipsoid size."""
    return (x * K, y * K, z * K)


MYOCARDIUM = [
    # type, centre, radius, size (x,y,z), rotation, stiffness, negative
    ("ELLIPSOID", (0.30, 0.10, -0.46), 1.0, semi(0.74, 0.72, 1.16), axis_quat(), 2.0, False),  # LV, forms the apex
    ("ELLIPSOID", (-0.30, -0.28, -0.28), 1.0, semi(0.66, 0.46, 0.96), axis_quat(RV_AXIS), 2.0, False),  # RV, anterior
    ("ELLIPSOID", (0.0, 0.06, 0.26), 1.0, semi(0.86, 0.70, 0.46), Quaternion(), 1.7, False),  # base mass
    ("ELLIPSOID", (-0.86, 0.10, 0.42), 1.0, semi(0.46, 0.46, 0.50), Quaternion(), 2.0, False),  # RA
    ("ELLIPSOID", (0.30, 0.62, 0.50), 1.0, semi(0.52, 0.40, 0.40), Quaternion(), 2.0, False),  # LA (posterior)
    ("ELLIPSOID", (-0.62, -0.46, 0.66), 1.0, semi(0.26, 0.17, 0.15), Quaternion((0, 1, 0), 0.5), 2.0, False),  # right auricle
    ("ELLIPSOID", (0.80, -0.22, 0.48), 1.0, semi(0.22, 0.14, 0.13), Quaternion((0, 1, 0), -0.6), 2.0, False),  # left auricle
]

GROOVES = [
    # negative capsules: anterior interventricular groove + atrioventricular (coronary) sulcus
    ((0.02, -0.84, 0.20), (0.36, -0.84, -0.60), 0.085),
    ((0.36, -0.84, -0.60), (0.66, -0.56, -1.30), 0.07),
    ((-0.72, -0.62, 0.22), (-0.06, -0.86, 0.30), 0.075),
    ((0.22, -0.74, 0.32), (0.94, -0.34, 0.20), 0.07),
]

VESSELS = {
    # name: (control points, start radius, end radius, region)
    "aorta": ([(0.00, 0.02, 0.36), (-0.06, -0.12, 0.98), (0.04, -0.06, 1.44), (0.34, 0.20, 1.66), (0.68, 0.50, 1.50), (0.80, 0.72, 0.92), (0.78, 0.78, 0.10)], 0.25, 0.21, "artery"),
    "brachiocephalic": ([(0.16, 0.04, 1.62), (0.06, 0.00, 1.94), (-0.04, -0.02, 2.14)], 0.09, 0.08, "artery"),
    "carotid": ([(0.38, 0.22, 1.70), (0.40, 0.22, 1.98), (0.40, 0.23, 2.16)], 0.07, 0.065, "artery"),
    "subclavian": ([(0.58, 0.40, 1.64), (0.74, 0.46, 1.90), (0.86, 0.50, 2.06)], 0.075, 0.07, "artery"),
    "pulmonary": ([(-0.08, -0.64, 0.34), (0.08, -0.66, 0.80), (0.28, -0.46, 1.08), (0.40, -0.22, 1.16)], 0.24, 0.21, "pulmonary"),
    "pa_left": ([(0.38, -0.22, 1.14), (0.70, -0.08, 1.12), (0.96, 0.06, 1.04)], 0.15, 0.13, "pulmonary"),
    "pa_right": ([(0.36, -0.14, 1.14), (0.06, 0.34, 1.16), (-0.30, 0.50, 1.10), (-0.56, 0.52, 1.04)], 0.14, 0.12, "pulmonary"),
    "svc": ([(-0.86, 0.10, 0.58), (-0.88, 0.10, 1.18), (-0.88, 0.10, 1.58)], 0.19, 0.18, "vein"),
    "ivc": ([(-0.76, 0.26, -0.02), (-0.80, 0.30, -0.44), (-0.82, 0.32, -0.68)], 0.19, 0.18, "vein"),
    "pv_left_sup": ([(0.46, 0.80, 0.62), (0.80, 0.98, 0.70), (1.02, 1.04, 0.74)], 0.085, 0.08, "artery"),
    "pv_left_inf": ([(0.48, 0.82, 0.40), (0.84, 1.00, 0.34), (1.04, 1.06, 0.30)], 0.085, 0.08, "artery"),
    "pv_right_sup": ([(0.12, 0.84, 0.62), (-0.18, 1.02, 0.70), (-0.38, 1.08, 0.74)], 0.085, 0.08, "artery"),
    "pv_right_inf": ([(0.14, 0.86, 0.40), (-0.16, 1.04, 0.34), (-0.36, 1.10, 0.30)], 0.085, 0.08, "artery"),
}

CORONARIES = {
    # control points near the surface; snapped with a BVH afterwards
    "lad": [(0.04, -0.92, 0.32), (0.16, -0.98, -0.10), (0.36, -0.90, -0.62), (0.56, -0.70, -1.12), (0.70, -0.44, -1.44)],
    "diagonal": [(0.22, -0.96, -0.20), (0.56, -0.82, -0.46), (0.86, -0.56, -0.78)],
    "circumflex": [(0.22, -0.76, 0.34), (0.62, -0.60, 0.26), (0.98, -0.26, 0.14), (1.10, 0.20, 0.00), (0.92, 0.60, -0.16)],
    "obtuse_marginal": [(1.06, -0.10, 0.08), (1.14, -0.06, -0.44), (1.02, 0.00, -0.94)],
    "rca": [(-0.16, -0.88, 0.32), (-0.60, -0.78, 0.18), (-1.00, -0.46, 0.00), (-1.12, 0.02, -0.16), (-0.90, 0.46, -0.36)],
    "acute_marginal": [(-0.98, -0.54, -0.04), (-0.90, -0.62, -0.52), (-0.66, -0.66, -0.98)],
}

CHAMBERS = [
    ("lv", "ELLIPSOID", (0.30, 0.12, -0.44), 1.0, semi(0.46, 0.44, 0.86), axis_quat()),
    ("rv", "ELLIPSOID", (-0.32, -0.26, -0.24), 1.0, semi(0.42, 0.26, 0.70), axis_quat(RV_AXIS)),
    ("la", "ELLIPSOID", (0.30, 0.62, 0.52), 1.0, semi(0.34, 0.26, 0.26), Quaternion()),
    ("ra", "ELLIPSOID", (-0.86, 0.10, 0.44), 1.0, semi(0.30, 0.30, 0.34), Quaternion()),
]

CONDUCTION = {
    # SA node at the SVC/RA junction -> internodal paths -> AV node -> His -> branches -> Purkinje
    "atrial": [(-0.82, -0.12, 0.86), (-0.70, -0.24, 0.62), (-0.42, -0.20, 0.40), (-0.16, -0.12, 0.26)],
    "bachmann": [(-0.82, -0.12, 0.86), (-0.30, 0.14, 0.80), (0.18, 0.46, 0.74), (0.52, 0.62, 0.62)],
    "his": [(-0.16, -0.12, 0.26), (-0.06, -0.16, 0.08), (0.04, -0.22, -0.12)],
    "left_bundle": [(0.04, -0.22, -0.12), (0.18, -0.20, -0.48), (0.36, -0.26, -0.92), (0.56, -0.30, -1.24)],
    "right_bundle": [(0.04, -0.22, -0.12), (-0.08, -0.36, -0.48), (-0.02, -0.46, -0.86), (0.24, -0.50, -1.14)],
    "purkinje_l1": [(0.56, -0.30, -1.24), (0.86, -0.12, -0.98), (1.02, 0.08, -0.52)],
    "purkinje_l2": [(0.56, -0.30, -1.24), (0.66, 0.14, -0.96), (0.74, 0.40, -0.48)],
    "purkinje_r1": [(0.24, -0.50, -1.14), (-0.26, -0.64, -0.84), (-0.62, -0.62, -0.40)],
    "purkinje_r2": [(0.24, -0.50, -1.14), (-0.06, -0.70, -0.64), (-0.26, -0.78, -0.16)],
}

# Timing (seconds after the beat trigger) for the pulse animation, mirrored in JS.
CONDUCTION_TIMING = {
    "atrial": [0.00, 0.08], "bachmann": [0.00, 0.09], "his": [0.08, 0.16],
    "left_bundle": [0.16, 0.22], "right_bundle": [0.16, 0.23],
    "purkinje_l1": [0.22, 0.30], "purkinje_l2": [0.22, 0.29],
    "purkinje_r1": [0.23, 0.31], "purkinje_r2": [0.23, 0.30],
}


# ---------------------------------------------------------------- build steps


def build_metaball(name, elements, resolution):
    mb = bpy.data.metaballs.new(name)
    mb.resolution = resolution
    mb.render_resolution = resolution
    mb.threshold = 0.6
    obj = link(bpy.data.objects.new(name, mb))
    for el_type, co, radius, size, rot, stiffness, negative in elements:
        el = mb.elements.new()
        el.type = el_type
        el.co = co
        el.radius = radius
        el.stiffness = stiffness
        el.use_negative = negative
        if size is not None:
            el.size_x, el.size_y, el.size_z = size
        if rot is not None:
            el.rotation = rot
    return obj


def build_myocardium():
    elements = list(MYOCARDIUM)
    for a, b, r in GROOVES:
        a, b = Vector(a), Vector(b)
        mid = (a + b) / 2
        half = (b - a).length / 2
        elements.append(("CAPSULE", tuple(mid), r, (half, 1, 1), look_rotation(b - a), 1.4, True))
    obj = build_metaball("Myo", elements, 0.035)
    me = evaluated_mesh(obj, "myo_raw")
    bpy.data.objects.remove(obj)
    return me


def build_vessels():
    meshes, centrelines = [], {}
    for name, (ctrl, r0, r1, region) in VESSELS.items():
        pts = catmull_rom(ctrl, 12)
        n = len(pts)
        radii = [r0 + (r1 - r0) * (i / (n - 1)) for i in range(n)]
        meshes.append(tube_mesh(name, pts, radii, bevel_res=5))
        centrelines[name] = (pts, radii, region)
    return meshes, centrelines


def remesh_union(name, meshes, voxel=0.02, smooth_iter=8, target_faces=26000):
    me = join_meshes(name + "_joined", meshes)
    obj = mesh_object(name, me)
    rm = obj.modifiers.new("remesh", "REMESH")
    rm.mode = "VOXEL"
    rm.voxel_size = voxel
    rm.use_smooth_shade = True
    apply_modifiers(obj, name + "_remeshed")
    sm = obj.modifiers.new("smooth", "LAPLACIANSMOOTH")
    sm.iterations = smooth_iter
    sm.lambda_factor = 0.55
    sm.use_volume_preserve = True
    sm.use_normalized = True
    apply_modifiers(obj, name + "_smoothed")
    faces = len(obj.data.polygons)
    if faces > target_faces:
        dec = obj.modifiers.new("decimate", "DECIMATE")
        dec.decimate_type = "COLLAPSE"
        dec.ratio = target_faces / faces
        dec.use_collapse_triangulate = True
        apply_modifiers(obj, name)
    obj.data.name = name
    obj.data.shade_smooth()
    return obj


def segment_distance(p, a, b):
    ab = b - a
    t = max(0.0, min(1.0, (p - a).dot(ab) / max(ab.length_squared, 1e-9)))
    return (a + ab * t - p).length


def paint_regions(obj, centrelines):
    """COLOR_0: R = arterial, G = venous/pulmonary, B = apex gradient, A = 1."""
    me = obj.data
    attr = me.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    zs = [v.co.z for v in me.vertices]
    zmin, zmax = min(zs), max(zs)
    for v in me.vertices:
        p = v.co
        art = ven = 0.0
        for pts, radii, region in centrelines.values():
            best = min(segment_distance(p, pts[i], pts[i + 1]) - radii[i] for i in range(len(pts) - 1))
            w = max(0.0, min(1.0, 1.0 - best / 0.09))
            w = w * w * (3 - 2 * w)
            if region == "artery":
                art = max(art, w)
            else:
                ven = max(ven, w)
        apex = 1.0 - (p.z - zmin) / max(zmax - zmin, 1e-6)
        attr.data[v.index].color = (art, ven, apex, 1.0)
    me.color_attributes.active_color = attr
    me.color_attributes.render_color_index = 0


def build_coronaries(heart_obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    bvh = BVHTree.FromObject(heart_obj, depsgraph)
    meshes = []
    for name, ctrl in CORONARIES.items():
        pts = catmull_rom(ctrl, 14)
        snapped = []
        for p in pts:
            loc, normal, _i, _d = bvh.find_nearest(p)
            snapped.append(loc + normal * 0.022 if loc is not None else p)
        # resample + relax so the tube follows the surface without kinks
        relaxed = list(snapped)
        for _ in range(3):
            relaxed = [relaxed[0]] + [(relaxed[i - 1] + relaxed[i] * 2 + relaxed[i + 1]) / 4 for i in range(1, len(relaxed) - 1)] + [relaxed[-1]]
            out = []
            for p in relaxed:
                loc, normal, _i, _d = bvh.find_nearest(p)
                out.append(loc + normal * 0.022 if loc is not None else p)
            relaxed = out
        n = len(relaxed)
        main = name in ("lad", "circumflex", "rca")
        r0, r1 = (0.034, 0.016) if main else (0.024, 0.012)
        radii = [r0 + (r1 - r0) * (i / (n - 1)) ** 0.8 for i in range(n)]
        meshes.append(tube_mesh("cor_" + name, relaxed, radii, bevel_res=2))
    me = join_meshes("Coronaries", meshes)
    for m in meshes:
        bpy.data.meshes.remove(m)
    obj = mesh_object("Coronaries", me)
    obj.data.shade_smooth()
    return obj


def build_chambers():
    elements = [(t, co, r, size, rot, 2.0, False) for _n, t, co, r, size, rot in CHAMBERS]
    obj = build_metaball("Cham", elements, 0.05)
    me = evaluated_mesh(obj, "cham_raw")
    bpy.data.objects.remove(obj)
    return remesh_union("Chambers", [me], voxel=0.035, smooth_iter=6, target_faces=2600)


def build_conduction_empty():
    empty = link(bpy.data.objects.new("Conduction", None))
    empty.empty_display_type = "PLAIN_AXES"
    paths = {}
    for name, ctrl in CONDUCTION.items():
        paths[name] = {"points": [list(map(lambda x: round(x, 4), c)) for c in ctrl], "timing": CONDUCTION_TIMING[name]}
    empty["paths"] = json.dumps(paths)
    return empty, paths


def recentre(objects, target_height=2.3):
    """Move pivot to the heart's visual centre and scale to a known height."""
    heart = objects[0]
    co = [heart.matrix_world @ v.co for v in heart.data.vertices]
    mn = Vector((min(c.x for c in co), min(c.y for c in co), min(c.z for c in co)))
    mx = Vector((max(c.x for c in co), max(c.y for c in co), max(c.z for c in co)))
    # visual centre: bias toward the ventricles so rotation feels balanced
    centre = (mn + mx) / 2
    centre.z = mn.z + (mx.z - mn.z) * 0.44
    scale = target_height / (mx.z - mn.z)
    m = Matrix.Diagonal((scale, scale, scale, 1.0)) @ Matrix.Translation(-centre)
    for obj in objects:
        if obj.type == "MESH":
            obj.data.transform(m)
            obj.data.update()
    return m, scale


def stats(obj):
    me = obj.data
    me.calc_loop_triangles()
    return {"name": obj.name, "verts": len(me.vertices), "tris": len(me.loop_triangles)}


def materials(heart, coronaries, chambers):
    def mat(name, color, rough=0.5):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = rough
        return m

    heart.data.materials.append(mat("Myocardium", (0.86, 0.82, 0.75, 1), 0.42))
    coronaries.data.materials.append(mat("Coronary", (0.85, 0.30, 0.22, 1), 0.35))
    chambers.data.materials.append(mat("Chamber", (0.30, 0.85, 0.66, 1), 0.3))


def preview(path, objects, view="front"):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.film_transparent = False
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.03, 0.06, 0.06, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0
    scene.world = world
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 70
    cam = link(bpy.data.objects.new("Cam", cam_data))
    cam.location = (0.0, -8.6, 0.4) if view == "front" else (5.6, -6.0, 2.2)
    cam.rotation_euler = Vector((0, 0, 0)).to_track_quat("Z", "Y").to_euler()
    direction = Vector((0, 0, 0)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    for loc, energy, size in (((-4, -5, 5), 900, 3), ((5, -2, 2), 400, 2), ((0, 6, 3), 600, 2)):
        ld = bpy.data.lights.new("L", "AREA")
        ld.energy = energy
        ld.size = size
        lo = link(bpy.data.objects.new("L", ld))
        lo.location = loc
        lo.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--preview")
    ap.add_argument("--faces", type=int, default=19000)
    ap.add_argument("--view", default="front")
    ap.add_argument("--samples", type=int, default=48)
    args = ap.parse_args(argv)

    reset_scene()
    myo = build_myocardium()
    vessel_meshes, centrelines = build_vessels()
    heart = remesh_union("Heart", [myo] + vessel_meshes, voxel=0.02, smooth_iter=10, target_faces=args.faces)
    for m in [myo] + vessel_meshes:
        if m.users == 0:
            bpy.data.meshes.remove(m)
    paint_regions(heart, centrelines)
    coronaries = build_coronaries(heart)
    chambers = build_chambers()
    conduction, paths = build_conduction_empty()

    m, scale = recentre([heart, coronaries, chambers])
    for p in paths.values():
        p["points"] = [[round(c, 4) for c in (m @ Vector(pt))] for pt in p["points"]]
    conduction["paths"] = json.dumps(paths)
    conduction["note"] = "Illustrative conduction pathway for animation. Not patient anatomy."
    heart["note"] = "Illustrative procedural heart sculpture (Blender). Not derived from patient data."

    materials(heart, coronaries, chambers)
    report = [stats(o) for o in (heart, coronaries, chambers)]
    print("PARTS", json.dumps(report))

    bpy.ops.export_scene.gltf(
        filepath=args.out,
        export_format="GLB",
        export_extras=True,
        export_yup=True,
        export_apply=True,
        export_normals=True,
        export_texcoords=False,
        export_vertex_color="ACTIVE",
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
    )
    print("EXPORTED", args.out)
    if args.preview:
        bpy.context.scene.cycles.samples = args.samples
        preview(args.preview, [heart, coronaries, chambers], args.view)
        print("PREVIEW", args.preview)


if __name__ == "__main__":
    main()
