// Bundles the 3D hero (three.js r187, tree-shaken) into a single committed ES module.
// GitHub Pages serves the output directly; no build step is required at deploy time.
import { build } from "esbuild";
import { statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";

const outfile = "assets/js/hero3d.js";
await build({
  entryPoints: ["src/hero/index.js"],
  bundle: true,
  format: "esm",
  minify: true,
  target: ["es2020", "safari15"],
  outfile,
  legalComments: "eof",
  banner: { js: "/* Hero 3D module · three.js r187 (MIT) · built by tools/build.mjs */" },
});
const size = statSync(outfile).size;
const gz = gzipSync(readFileSync(outfile)).length;
console.log(`${outfile}: ${(size / 1024).toFixed(1)} KB (${(gz / 1024).toFixed(1)} KB gzip)`);
