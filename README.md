# Roberto Martín Gutiérrez — Biomedical AI, Computer Vision & Software

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-convderover.github.io-0b7a5b?style=flat-square)](https://convderover.github.io/)
[![English Version](https://img.shields.io/badge/English_Edition-%3Flang%3Den-6ff0c4?style=flat-square)](https://convderover.github.io/?lang=en)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0004--5724--3502-061110?style=flat-square)](https://orcid.org/0009-0004-5724-3502)

Bilingual (**Spanish / English**) portfolio of **Roberto Martín Gutiérrez** — Biomedical Engineer (MSc, University of Valladolid) and Research Engineer in Healthcare AI & Computational Cardiology (**ICICOR · Hospital Clínico Universitario de Valladolid**).

![Portfolio v4 — quiet paper](docs/portfolio-v4-preview.png)

## Live URLs

- Portfolio (ES): https://convderover.github.io/
- Portfolio (EN): https://convderover.github.io/?lang=en
- CardioCloud case study (`v2-public`): https://convderover.github.io/cardiocloud/

## v4 · "Quiet paper" (November 2026)

A radical simplification: warm paper, one ink, one accent (arterial vermilion), hairlines instead of cards, first-person copy and far less text. Informed by widely used minimalist personal sites on GitHub (BartoszJarocki/cv, pacocoursey/paco, antfu/antfu.me, bchiang7/v4, alshedivat/al-folio): one calm column, projects as a list, neutral palette, restrained motion. No code was copied from them.

- **Hero:** "Hola, soy Roberto", one sentence, and the illustrative 3D heart floating on the page (Anatomy / Signal / Reconstruction, drag or arrow keys, pause, reset). It beats to the public PTB-XL ECG shown below it.
- **Selected work:** three pieces only — CardioCloud, ECOCARDIA and the broadcast-kick biomechanics study — each with one sentence and one fact.
- **More projects:** the other eight (Convity included) as a plain list; each row opens the full record.
- **Research, about, contact:** preprint with DOI, clinical trials, a short bio next to the portrait, experience and education as rows, certificates and technologies folded away, and one email link.
- **After hours:** type `lab` or use the footer link; tap the heart in rhythm, tap the portrait three times, type `ecg`.

## Architecture

Static HTML/CSS/JS served directly by GitHub Pages. **No build step is needed to deploy**: the only bundled file (`assets/js/hero3d.js`) is committed.

| File | Role |
| --- | --- |
| `index.html` | Semantic structure; static text carries `data-i18n` keys |
| `site.css` | Design system (light-first, dark theme), all sections |
| `data.js` | Original bilingual records (projects, results, links) — the single source for facts |
| `design-data.js` | Short first-person copy, featured facts, credits |
| `app.js` | Language, theme, navigation, filters, cases, dialogs |
| `lab.js` | Specimen bootstrap (lazy 3D, posters, ECG strip), case demos, playground, discoveries |
| `src/hero/heart.js` | Three.js r187 scene (source of `assets/js/hero3d.js`) |
| `cardiocloud/v3.css` | Visual bridge for the CardioCloud page; its evidence is unchanged |

### 3D asset pipeline

1. `tools/blender/build_heart.py` — Blender 5.3 (`bpy`) script: metaball myocardium with carved grooves, bevelled-curve great vessels, voxel-remesh union, Laplacian smoothing, decimation, region weights as vertex colours, BVH-snapped coronary tubes, internal chambers, conduction paths as node extras. Exports `assets/models/heart-source.glb`.
2. `npm run build:model` — glTF-Transform: weld, reorder, quantize, **meshopt** → `assets/models/heart.glb` (987 KB → 216 KB).
3. `npm run build` — esbuild bundles three.js (WebGLRenderer, GLTFLoader, meshopt decoder, RoomEnvironment, MeshSurfaceSampler) into `assets/js/hero3d.js` (≈672 KB, ≈174 KB gzip), loaded lazily after first paint.
4. `node tools/render-poster.cjs` (with the local server running) renders the poster images from the live scene (`assets/img/heart-*.webp`, light and dark variants). They are the first frame, the loading state and the no-WebGL fallback for all three modes.

```bash
npm install                    # dev tools only (three, esbuild, glTF-Transform, fonts)
python3 -m venv .venv && .venv/bin/pip install bpy==5.3.0
.venv/bin/python tools/blender/build_heart.py --out assets/models/heart-source.glb
npm run build:model && npm run build
npm run serve                  # http://127.0.0.1:8090
```

### Performance & accessibility

- One WebGL context. Rendering stops off screen, in hidden tabs and when paused; geometries, materials and textures are disposed on teardown. DPR is capped (1.5 touch / 2 desktop) and lowered automatically if frames are slow. Reconstruction geometry and shaders are prepared lazily / in idle time.
- Motion (MIT, self-hosted) loads after `load`; each animated property has one owner (Motion: DOM entries and control thumbs; three.js loop: camera, materials, beat; CSS: poster/canvas cross-fade).
- `prefers-reduced-motion`: static 3D frame, no auto-rotation, no entry animations.
- Lighthouse was measured for v3 in a GPU-less container (84 mobile performance with the poster, accessibility 100). v4 ships less CSS and markup but has not been re-measured; real-device figures remain to be measured.

## Data honesty

The heart is an illustrative sculpture, labelled as such; it is not patient anatomy. Echo, pose and particle visuals are illustrative and run no inference. Scientific values (0.918 Macro AUROC, per-class AUROC, preprint figures, trial IDs, grades) are reproduced from the existing sources in `data.js`, `cardiocloud/README.md` and `cardiocloud/evidence/`.

## Credits

three.js (MIT) · Motion 14.12.0 ([MIT](assets/vendor/MOTION-LICENSE.md)) · Inter, Instrument Serif, JetBrains Mono ([OFL](assets/fonts/)) · Grainient Freebies as low-frequency decorative texture ([attribution and license](assets/img/GRAINIENT-ATTRIBUTION.md); previews only, not high-resolution originals) · PTB-XL v1.0.3 (Wagner et al., PhysioNet, CC BY 4.0). No MetalForge code is included. No Tripo-generated model is included.

### Tripo

`tripo-cli` 0.11.2 was installed and checked with `tripo doctor`, and API access was enabled, but no generation was run: the decision was not to spend credits. The heart is entirely procedural (Blender script in this repository). If a Tripo asset is ever wanted, it can go through the same Blender/glTF-Transform steps and replace `assets/models/heart.glb`.
