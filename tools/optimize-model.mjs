// Web preparation for the Blender export: weld, quantize and meshopt-compress.
// Input:  assets/models/heart-source.glb  (tools/blender/build_heart.py)
// Output: assets/models/heart.glb        (loaded by three.js with MeshoptDecoder)
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization, ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, prune, weld, quantize, meshopt, reorder } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import { statSync } from "node:fs";

const src = process.argv[2] || "assets/models/heart-source.glb";
const out = process.argv[3] || "assets/models/heart.glb";
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });
const doc = await io.read(src);
// Materials are replaced at runtime; keep them minimal but valid.
await doc.transform(
  dedup(),
  weld(),
  reorder({ encoder: MeshoptEncoder, target: "size" }),
  quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeColor: 8, quantizeTexcoord: 12 }),
  meshopt({ encoder: MeshoptEncoder, level: "high" }),
  prune({ keepExtras: true, keepLeaves: true }),
);
await io.write(out, doc);
const a = statSync(src).size, b = statSync(out).size;
console.log(`${src} ${(a / 1024).toFixed(0)} KB -> ${out} ${(b / 1024).toFixed(0)} KB`);
for (const n of doc.getRoot().listNodes()) console.log(" node", n.getName(), n.getMesh() ? "(mesh)" : "", Object.keys(n.getExtras() || {}).join(","));
