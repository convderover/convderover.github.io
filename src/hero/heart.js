/*
 * Specimen 01 — interactive heart for the portfolio hero.
 * Three.js r187, bundled by tools/build.mjs into assets/js/hero3d.js.
 *
 * Ownership of animation (one owner per property):
 *   - this module: camera, model rotation, material weights, beat, scan plane,
 *     the ECG sweep time handed to the 2D strip (via onFrame).
 *   - CSS: poster/canvas cross-fade (.is-live class), HUD colours.
 *   - Motion (lab.js): DOM controls only.
 *
 * The model is an illustrative procedural sculpture (tools/blender/build_heart.py).
 * Beat timing follows the R-peaks of the public PTB-XL record 00009, lead II.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const MODES = ["anatomy", "signal", "recon"];

/* Camera presets: azimuth / elevation in radians, distance factor, target y. */
const VIEWS = {
  anatomy: { az: 0.32, el: 0.1, dist: 1.0, ty: 0.02, fov: 30 },
  signal: { az: -0.42, el: 0.04, dist: 0.9, ty: -0.04, fov: 30 },
  recon: { az: 0.86, el: 0.42, dist: 1.08, ty: 0.0, fov: 30 },
};

const PALETTES = {
  dark: {
    myo: "#eee3d3",
    artery: "#e3907a",
    vein: "#a3b7c2",
    apex: "#e0bca6",
    sheen: "#ffd2bd",
    coronary: "#ff6f4f",
    glass: "#e9e4da",
    chamber: "#8f8a80",
    pulse: "#ff6b4a",
    path: "#cfc9bd",
    recon: "#e9e4da",
    reconHot: "#ff6b4a",
    additive: false, // normal blending keeps canvas alpha correct over the page
  },
  light: {
    myo: "#f1e7d8",
    artery: "#d98269",
    vein: "#93aab7",
    apex: "#dcb39b",
    sheen: "#ff8a66",
    coronary: "#d8462a",
    glass: "#2b2a27",
    chamber: "#a39c90",
    pulse: "#d9482b",
    path: "#55524c",
    recon: "#2b2a27",
    reconHot: "#d9482b",
    additive: false,
  },
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/** Tiny tween helper: the render loop advances every tween, nothing else does. */
class Tween {
  constructor(value) {
    this.from = value;
    this.to = value;
    this.value = value;
    this.t = 1;
    this.duration = 1;
  }
  set(to, duration) {
    if (duration <= 0) {
      this.value = this.from = this.to = to;
      this.t = 1;
      return;
    }
    this.from = this.value;
    this.to = to;
    this.t = 0;
    this.duration = duration;
  }
  step(dt) {
    if (this.t >= 1) return false;
    this.t = Math.min(1, this.t + dt / this.duration);
    this.value = lerp(this.from, this.to, easeInOut(this.t));
    return true;
  }
}

function findPeaks(trace, rate = 100) {
  const max = Math.max(...trace);
  const peaks = [];
  for (let i = 2; i < trace.length - 2; i++) {
    const v = trace[i];
    if (v > max * 0.5 && v >= trace[i - 1] && v >= trace[i + 1] && v >= trace[i - 2] && v >= trace[i + 2]) {
      if (!peaks.length || i - peaks[peaks.length - 1] > rate * 0.25) peaks.push(i);
    }
  }
  return peaks.map((i) => i / rate);
}

function radialTexture(inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* ---------------------------------------------------------------- shaders */

const glassVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vPos;
  uniform float uBeat;
  void main(){
    vec3 p = position * (1.0 + uBeat * 0.018);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vPos = p;
    gl_Position = projectionMatrix * mv;
  }`;

const glassFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uBeat; uniform float uAdd;
  varying vec3 vN; varying vec3 vV; varying vec3 vPos;
  void main(){
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
    float iso = smoothstep(0.86, 1.0, abs(fract(vPos.y * 11.0) - 0.5) * 2.0) * 0.16;
    float a = (0.035 + f * 0.62 + iso * (0.4 + f)) * uOpacity * (1.0 + uBeat * 0.35);
    vec3 col = uColor * (0.35 + f * 1.25 + iso);
    gl_FragColor = vec4(col * mix(1.0, a, uAdd), mix(a, 1.0, uAdd) * mix(1.0, uOpacity, uAdd));
    if (uAdd < 0.5) gl_FragColor = vec4(col * 0.75, a);
  }`;

const pathVert = /* glsl */ `
  varying float vU;
  void main(){ vU = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const pathFrag = /* glsl */ `
  uniform vec3 uBase; uniform vec3 uPulse; uniform float uHead; uniform float uOpacity; uniform float uAdd;
  varying float vU;
  void main(){
    float d = vU - uHead;
    float glow = exp(-d * d * 260.0) + smoothstep(0.0, -0.35, d) * step(d, 0.0) * 0.35 * step(0.0, uHead) * step(uHead, 1.25);
    vec3 col = mix(uBase, uPulse, clamp(glow, 0.0, 1.0));
    float a = (0.55 + glow * 1.2) * uOpacity;
    gl_FragColor = vec4(col * mix(1.0, a, uAdd), mix(min(a, 1.0), 1.0, uAdd) * mix(1.0, uOpacity, uAdd));
  }`;

const pointsVert = /* glsl */ `
  attribute float aSeed;
  uniform float uSize; uniform float uReveal; uniform float uBand; uniform float uPixel; uniform float uOpacity;
  varying float vA; varying float vHot;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float below = smoothstep(uReveal + 0.02, uReveal - 0.06, position.y);
    float band = exp(-pow((position.y - uBand) * 9.0, 2.0));
    vHot = band;
    vA = (below * (0.35 + aSeed * 0.65) + band * 0.9) * uOpacity;
    gl_PointSize = uSize * uPixel * (0.6 + aSeed * 0.8 + band * 1.2) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;

const pointsFrag = /* glsl */ `
  uniform vec3 uColor; uniform vec3 uHot; uniform float uAdd;
  varying float vA; varying float vHot;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = vA * smoothstep(0.25, 0.0, d);
    vec3 col = mix(uColor, uHot, vHot);
    gl_FragColor = vec4(col * mix(1.0, a, uAdd), mix(a, 1.0, uAdd) * mix(1.0, vA, uAdd));
  }`;

const linesVert = /* glsl */ `
  uniform float uReveal; varying float vA; uniform float uOpacity;
  void main(){
    vA = smoothstep(uReveal + 0.02, uReveal - 0.1, position.y) * uOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const linesFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uAdd; varying float vA;
  void main(){ gl_FragColor = vec4(uColor * mix(1.0, vA, uAdd), mix(vA, 1.0, uAdd) * mix(1.0, vA, uAdd)); }`;

const planeFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uAdd; varying vec2 vUv;
  void main(){
    vec2 g = abs(fract(vUv * 18.0) - 0.5);
    float grid = smoothstep(0.47, 0.5, max(g.x, g.y));
    float edge = smoothstep(0.46, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float r = length(vUv - 0.5);
    float a = (grid * 0.22 + edge * 0.7 + 0.05) * smoothstep(0.72, 0.3, r) * uOpacity;
    gl_FragColor = vec4(uColor * mix(1.0, a, uAdd), mix(a, 1.0, uAdd) * mix(1.0, uOpacity, uAdd));
  }`;

const planeVert = /* glsl */ `
  varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/* ---------------------------------------------------------------- geometry */

/** Horizontal contour lines of a mesh (one LineSegments geometry). */
function contourSlices(geometry, levels) {
  const pos = geometry.attributes.position;
  const index = geometry.index;
  const count = index ? index.count : pos.count;
  const get = (i, v) => v.fromBufferAttribute(pos, index ? index.getX(i) : i);
  const a = new Vector3(), b = new Vector3(), c = new Vector3();
  const out = [];
  const cut = (p, q, y) => {
    const t = (y - p.y) / (q.y - p.y);
    out.push(p.x + (q.x - p.x) * t, y, p.z + (q.z - p.z) * t);
  };
  for (let i = 0; i < count; i += 3) {
    get(i, a); get(i + 1, b); get(i + 2, c);
    const lo = Math.min(a.y, b.y, c.y), hi = Math.max(a.y, b.y, c.y);
    for (const y of levels) {
      if (y < lo || y > hi) continue;
      const before = out.length;
      if ((a.y - y) * (b.y - y) < 0) cut(a, b, y);
      if ((b.y - y) * (c.y - y) < 0) cut(b, c, y);
      if ((c.y - y) * (a.y - y) < 0) cut(c, a, y);
      if (out.length - before !== 6) out.length = before;
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(out, 3));
  return g;
}

/** Bounding frame with tick marks: a "measured specimen" box. */
function specimenFrame(box) {
  const { min, max } = box;
  const v = [];
  const seg = (x1, y1, z1, x2, y2, z2) => v.push(x1, y1, z1, x2, y2, z2);
  const L = 0.14;
  for (const x of [min.x, max.x])
    for (const y of [min.y, max.y])
      for (const z of [min.z, max.z]) {
        const sx = x === min.x ? 1 : -1, sy = y === min.y ? 1 : -1, sz = z === min.z ? 1 : -1;
        seg(x, y, z, x + L * sx, y, z);
        seg(x, y, z, x, y + L * sy, z);
        seg(x, y, z, x, y, z + L * sz);
      }
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const y = min.y + ((max.y - min.y) * i) / steps;
    const t = i % 5 === 0 ? 0.07 : 0.035;
    seg(min.x, y, max.z, min.x - t, y, max.z);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(v, 3));
  return g;
}

/** Dequantize (KHR_mesh_quantization) into float attributes and bake the node transform. */
function bakeGeometry(mesh) {
  const src = mesh.geometry;
  const out = new BufferGeometry();
  for (const name of ["position", "normal", "color"]) {
    const a = src.attributes[name];
    if (!a) continue;
    const size = name === "color" ? Math.min(a.itemSize, 3) : a.itemSize;
    const arr = new Float32Array(a.count * size);
    const get = [(i) => a.getX(i), (i) => a.getY(i), (i) => a.getZ(i)];
    for (let i = 0; i < a.count; i++) for (let k = 0; k < size; k++) arr[i * size + k] = get[k](i);
    out.setAttribute(name, new BufferAttribute(arr, size));
  }
  if (src.index) out.setIndex(src.index.clone());
  out.applyMatrix4(mesh.matrixWorld);
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

/* ---------------------------------------------------------------- scene */

export function mountHeart(host, options = {}) {
  const {
    modelUrl,
    canvas,
    trace = [],
    reducedMotion = false,
    theme = "dark",
    onProgress = () => {},
    onReady = () => {},
    onError = () => {},
    onFrame = () => {},
    onTempo = () => {},
  } = options;

  const isCoarse = matchMedia("(pointer: coarse)").matches;
  const lowPower = isCoarse || (navigator.hardwareConcurrency || 8) <= 4;
  const maxDpr = isCoarse ? 1.5 : 2;
  let dpr = Math.min(devicePixelRatio || 1, maxDpr);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: !!options.preserveDrawingBuffer,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTex = pmrem.fromScene(room, 0.035).texture;
  room.dispose?.();
  pmrem.dispose();
  scene.environment = envTex;
  scene.environmentIntensity = 0.85;

  const camera = new PerspectiveCamera(30, 1, 0.1, 60);
  const key = new DirectionalLight(0xfff1e0, 2.4);
  key.position.set(-3, 4, 5);
  const rim = new DirectionalLight(0xfff4ea, 1.6);
  rim.position.set(4, 1.5, -4);
  const fill = new DirectionalLight(0xffb59c, 0.5);
  fill.position.set(2, -3, 3);
  scene.add(key, rim, fill);

  const root = new Group(); // rotation owned by drag/autorotate
  scene.add(root);

  let palette = PALETTES[theme] || PALETTES.dark;
  const colors = Object.fromEntries(
    Object.entries(PALETTES.dark).filter(([, v]) => typeof v === "string").map(([k]) => [k, new Color()]),
  );
  // Color.set() converts sRGB hex into the linear working space (ColorManagement).
  const applyPaletteColors = () => {
    for (const k of Object.keys(colors)) colors[k].set(palette[k]);
  };
  applyPaletteColors();

  /* ---- state */
  const weights = { anatomy: new Tween(1), signal: new Tween(0), recon: new Tween(0) };
  const cam = { az: new Tween(VIEWS.anatomy.az), el: new Tween(VIEWS.anatomy.el), dist: new Tween(1), ty: new Tween(VIEWS.anatomy.ty) };
  const scan = new Tween(-1.4);
  let mode = "anatomy";
  let paused = false;
  let visible = true;
  let destroyed = false;
  let raf = 0;
  let last = 0;
  let clock = 0; // seconds of animated time (stops when paused)
  let yaw = 0, pitch = 0, yawVel = 0, pitchVel = 0;
  let lastInteraction = -10;
  let baseDistance = 6.4;
  let tempo = 1; // playback rate multiplier for user-tapped rhythm
  const peaks = findPeaks(trace);
  const traceDuration = trace.length / 100 || 10;
  let ecgTime = 0;
  let frameTimes = [];
  let firstFrame = false;

  /* ---- materials */
  const uniformsBeat = { value: 0 };
  const solidMat = new MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.46,
    metalness: 0,
    clearcoat: 0.42,
    clearcoatRoughness: 0.38,
    sheen: 0.28,
    sheenRoughness: 0.6,
    sheenColor: colors.sheen.clone(),
  });
  const solidUniforms = {
    uMyo: { value: colors.myo }, uArt: { value: colors.artery }, uVen: { value: colors.vein }, uApex: { value: colors.apex }, uBeat: uniformsBeat,
  };
  solidMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, solidUniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uBeat;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed *= 1.0 + uBeat * 0.018;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uMyo; uniform vec3 uArt; uniform vec3 uVen; uniform vec3 uApex;")
      .replace(
        "#include <color_fragment>",
        `#if defined( USE_COLOR_ALPHA ) || defined( USE_COLOR )
           vec3 base = mix(uMyo, uApex, smoothstep(0.35, 1.0, vColor.b) * 0.55);
           base = mix(base, uArt, clamp(vColor.r, 0.0, 1.0) * 0.5);
           base = mix(base, uVen, clamp(vColor.g, 0.0, 1.0) * 0.6);
           diffuseColor.rgb *= base;
         #endif`,
      );
  };

  const coronaryMat = new MeshPhysicalMaterial({ color: colors.coronary, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25, emissive: colors.coronary, emissiveIntensity: 0.12 });

  const glassUniforms = { uColor: { value: colors.glass }, uOpacity: { value: 0 }, uBeat: uniformsBeat, uAdd: { value: 1 } };
  const glassMat = new ShaderMaterial({ uniforms: glassUniforms, vertexShader: glassVert, fragmentShader: glassFrag, transparent: true, depthWrite: false, blending: AdditiveBlending });

  const chamberMat = new MeshPhysicalMaterial({ color: colors.chamber, roughness: 0.35, transparent: true, opacity: 0, depthWrite: false, emissive: colors.chamber, emissiveIntensity: 0.25 });

  const pointsUniforms = { uColor: { value: colors.recon }, uHot: { value: colors.reconHot }, uSize: { value: 2.2 }, uReveal: { value: -2 }, uBand: { value: -2 }, uPixel: { value: dpr * 6 }, uOpacity: { value: 0 }, uAdd: { value: 1 } };
  const pointsMat = new ShaderMaterial({ uniforms: pointsUniforms, vertexShader: pointsVert, fragmentShader: pointsFrag, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const linesUniforms = { uColor: { value: colors.recon }, uReveal: pointsUniforms.uReveal, uOpacity: { value: 0 }, uAdd: { value: 1 } };
  const linesMat = new ShaderMaterial({ uniforms: linesUniforms, vertexShader: linesVert, fragmentShader: linesFrag, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const frameUniforms = { uColor: { value: colors.recon }, uReveal: { value: 99 }, uOpacity: { value: 0 }, uAdd: { value: 1 } };
  const frameMat = new ShaderMaterial({ uniforms: frameUniforms, vertexShader: linesVert, fragmentShader: linesFrag, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const planeUniforms = { uColor: { value: colors.recon }, uOpacity: { value: 0 }, uAdd: { value: 1 } };
  const planeMat = new ShaderMaterial({ uniforms: planeUniforms, vertexShader: planeVert, fragmentShader: planeFrag, transparent: true, depthWrite: false, side: DoubleSide, blending: AdditiveBlending });

  const pathMats = [];
  const shadowTex = radialTexture("rgba(0,0,0,0.42)", "rgba(0,0,0,0)");
  const shadowMat = new MeshPhysicalMaterial({ map: shadowTex, transparent: true, depthWrite: false, roughness: 1, opacity: 1 });

  const setBlending = () => {
    const add = palette.additive;
    for (const m of [glassMat, pointsMat, linesMat, frameMat, planeMat, ...pathMats]) {
      m.blending = add ? AdditiveBlending : NormalBlending;
      m.uniforms.uAdd.value = add ? 1 : 0;
      m.needsUpdate = true;
    }
    shadowMat.opacity = add ? 1 : 0.55;
  };

  /* ---- objects (filled after load) */
  let heartSolid, heartGlass, coronaries, chambers, points, slices, frame, scanPlane, shadow;
  const conduction = [];
  const nodeDots = [];

  /* ---- sizing */
  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fov = (camera.fov * Math.PI) / 180;
    const fitH = 1.42 / Math.tan(fov / 2);
    const fitW = 1.32 / (Math.tan(fov / 2) * camera.aspect);
    baseDistance = Math.max(fitH, fitW) * 1.12;
    camera.updateProjectionMatrix();
    pointsUniforms.uPixel.value = dpr * h * 0.006;
    requestRender();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  /* ---- loading */
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    modelUrl,
    async (gltf) => {
      if (destroyed) return;
      try {
        build(gltf.scene);
        resize();
        // KHR_parallel_shader_compile where available: do not block the main thread on linking
        const parallel = renderer.extensions.has("KHR_parallel_shader_compile");
        if (parallel) { try { await renderer.compileAsync(scene, camera); } catch {} }
        if (destroyed) return;
        renderFrame(performance.now(), true);
        firstFrame = true;
        onReady();
        start();
        idle(prewarm);
      } catch (err) {
        onError(err);
      }
    },
    (e) => {
      if (e.total) onProgress(e.loaded / e.total);
    },
    (err) => onError(err),
  );

  function build(gltfScene) {
    let heartGeo, corGeo, chamberGeo, paths = {};
    gltfScene.updateMatrixWorld(true);
    gltfScene.traverse((o) => {
      if (o.isMesh) {
        const n = o.name.toLowerCase();
        const g = bakeGeometry(o);
        if (n.startsWith("heart")) heartGeo = g;
        else if (n.startsWith("coronar")) corGeo = g;
        else if (n.startsWith("chamber")) chamberGeo = g;
        o.geometry.dispose();
        o.material?.dispose?.();
      }
      if (o.userData?.paths) {
        try { paths = JSON.parse(o.userData.paths); } catch { paths = {}; }
      }
    });
    if (!heartGeo) throw new Error("Heart mesh missing");
    if (!heartGeo.attributes.normal) heartGeo.computeVertexNormals();

    heartSolid = new Mesh(heartGeo, solidMat);
    heartSolid.renderOrder = 1;
    heartGlass = new Mesh(heartGeo, glassMat);
    heartGlass.renderOrder = 4;
    heartGlass.visible = false;
    root.add(heartSolid, heartGlass);

    if (corGeo) {
      coronaries = new Mesh(corGeo, coronaryMat);
      coronaries.renderOrder = 2;
      root.add(coronaries);
    }
    if (chamberGeo) {
      chambers = new Mesh(chamberGeo, chamberMat);
      chambers.visible = false;
      chambers.renderOrder = 2;
      root.add(chambers);
    }

    for (const [name, p] of Object.entries(paths)) {
      const curve = new CatmullRomCurve3(p.points.map((v) => new Vector3(v[0], v[1], v[2])));
      const main = name === "his" || name.endsWith("bundle");
      const geo = new TubeGeometry(curve, 64, main ? 0.024 : 0.016, 8, false);
      const mat = new ShaderMaterial({
        uniforms: { uBase: { value: colors.path }, uPulse: { value: colors.pulse }, uHead: { value: -1 }, uOpacity: { value: 0 }, uAdd: { value: 1 } },
        vertexShader: pathVert,
        fragmentShader: pathFrag,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      pathMats.push(mat);
      const mesh = new Mesh(geo, mat);
      mesh.visible = false;
      mesh.renderOrder = 5;
      root.add(mesh);
      conduction.push({ name, mesh, mat, timing: p.timing || [0, 0.1] });
    }
    // SA and AV nodes
    const start = paths.atrial?.points?.[0];
    const av = paths.his?.points?.[0];
    for (const pt of [start, av]) {
      if (!pt) continue;
      const dot = new Mesh(new SphereGeometry(0.045, 16, 12), new ShaderMaterial({
        uniforms: { uBase: { value: colors.pulse }, uPulse: { value: colors.pulse }, uHead: { value: 0 }, uOpacity: { value: 0 }, uAdd: { value: 1 } },
        vertexShader: pathVert, fragmentShader: pathFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
      }));
      pathMats.push(dot.material);
      dot.position.set(pt[0], pt[1], pt[2]);
      dot.visible = false;
      dot.renderOrder = 6;
      root.add(dot);
      nodeDots.push(dot);
    }

    heartBox = heartGeo.boundingBox.clone();
    scan.min = heartBox.min.y;
    scan.max = heartBox.max.y;
    const box = heartBox;

    // soft contact shadow, outside the rotating group
    shadow = new Mesh(new PlaneGeometry(2.8, 1.2), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = box.min.y - 0.12;
    scene.add(shadow);

    setBlending();
    setMode(mode, true);
  }


  /* Reconstruction geometry is built lazily (first use or idle time). */
  let heartBox = null;
  function ensureRecon() {
    if (points || !heartSolid) return;
    const heartGeo = heartSolid.geometry;
    // Reconstruction: surface samples + contour slices + measured frame + scan plane
    const sampler = new MeshSurfaceSampler(heartSolid).build();
    const n = lowPower ? 5200 : 9000;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const tmp = new Vector3();
    for (let i = 0; i < n; i++) {
      sampler.sample(tmp);
      pos.set([tmp.x, tmp.y, tmp.z], i * 3);
      seed[i] = Math.random();
    }
    const pg = new BufferGeometry();
    pg.setAttribute("position", new BufferAttribute(pos, 3));
    pg.setAttribute("aSeed", new BufferAttribute(seed, 1));
    points = new Points(pg, pointsMat);
    points.visible = false;
    points.renderOrder = 7;
    const box = heartBox.clone();
    const levels = [];
    const nLevels = 26;
    for (let i = 1; i < nLevels; i++) levels.push(box.min.y + ((box.max.y - box.min.y) * i) / nLevels);
    slices = new LineSegments(contourSlices(heartGeo, levels), linesMat);
    slices.visible = false;
    slices.renderOrder = 6;
    box.expandByScalar(0.06);
    frame = new LineSegments(specimenFrame(box), frameMat);
    frame.visible = false;
    const span = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 1.25;
    scanPlane = new Mesh(new PlaneGeometry(span * 0.86, span * 0.86), planeMat);
    scanPlane.rotation.x = -Math.PI / 2;
    scanPlane.visible = false;
    scanPlane.renderOrder = 3;
    root.add(points, slices, frame, scanPlane);
  }

  const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(() => !destroyed && fn(), { timeout: 4000 }) : setTimeout(() => !destroyed && fn(), 1500));
  /** Compile the signal/reconstruction shaders ahead of time so switching modes never stalls. */
  function prewarm() {
    ensureRecon();
    const extra = [heartGlass, chambers, points, slices, frame, scanPlane, ...conduction.map((c) => c.mesh), ...nodeDots].filter(Boolean);
    const was = extra.map((o) => o.visible);
    extra.forEach((o) => (o.visible = true));
    try {
      if (renderer.extensions.has("KHR_parallel_shader_compile")) renderer.compileAsync(scene, camera).catch(() => {});
      else renderer.compile(scene, camera);
    } catch {}
    extra.forEach((o, i) => (o.visible = was[i]));
  }

  /* ---- modes */
  function setMode(next, instant = false) {
    if (!MODES.includes(next)) return;
    mode = next;
    const d = instant || reducedMotion ? 0 : 1.1;
    const dc = instant || reducedMotion ? 0 : 1.45;
    for (const m of MODES) weights[m].set(m === next ? 1 : 0, d);
    const v = VIEWS[next];
    // keep the user's yaw continuity: tween relative preset, not absolute spin
    cam.az.set(v.az, dc);
    cam.el.set(v.el, dc);
    cam.dist.set(v.dist, dc);
    cam.ty.set(v.ty, dc);
    if (next === "recon") ensureRecon();
    if (next === "recon" && scan.min !== undefined) {
      bandClock = 0;
      scan.set(scan.min - 0.05, 0);
      scan.set(scan.max + 0.05, reducedMotion ? 0 : 3.2);
    }
    requestRender();
  }

  function reset() {
    yawVel = pitchVel = 0;
    const d = reducedMotion ? 0 : 1.2;
    yawTween.set(0, 0);
    yawTween.from = yaw;
    yawTween.value = yaw;
    yawTween.set(0, d);
    pitchTween.value = pitch;
    pitchTween.set(0, d);
    resetting = true;
    tempo = 1;
    onTempo(null);
    setMode(mode);
  }
  const yawTween = new Tween(0);
  const pitchTween = new Tween(0);
  let resetting = false;

  /* ---- interaction: horizontal drag rotates; vertical scroll stays native (touch-action: pan-y) */
  let drag = null;
  const taps = [];
  const onDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false, type: e.pointerType };
    resetting = false;
  };
  const onMove = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) {
      drag.moved = true;
      try { host.setPointerCapture(e.pointerId); } catch {}
      host.classList.add("is-dragging");
    }
    if (!drag.moved) return;
    drag.x = e.clientX;
    drag.y = e.clientY;
    const k = 0.0085;
    yaw += dx * k;
    yawVel = dx * k * 60;
    if (drag.type === "mouse" || drag.type === "pen") {
      pitch = clamp(pitch + dy * 0.005, -0.45, 0.55);
      pitchVel = dy * 0.005 * 60;
    }
    lastInteraction = clock;
    requestRender();
  };
  const onUp = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasTap = !drag.moved && performance.now() - drag.t < 320;
    host.classList.remove("is-dragging");
    drag = null;
    if (wasTap) registerTap(performance.now());
  };
  const onCancel = () => {
    drag = null;
    host.classList.remove("is-dragging");
  };
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onCancel);
  const onKey = (e) => {
    const step = e.shiftKey ? 0.6 : 0.26;
    if (e.key === "ArrowLeft") yaw -= step;
    else if (e.key === "ArrowRight") yaw += step;
    else if (e.key === "ArrowUp") pitch = clamp(pitch - 0.12, -0.45, 0.55);
    else if (e.key === "ArrowDown") pitch = clamp(pitch + 0.12, -0.45, 0.55);
    else return;
    e.preventDefault();
    lastInteraction = clock;
    resetting = false;
    requestRender();
  };
  host.addEventListener("keydown", onKey);

  /* Discovery: tap the specimen rhythmically to set the beat (tap tempo). */
  function registerTap(now) {
    taps.push(now);
    while (taps.length > 6) taps.shift();
    if (taps.length < 4) return;
    const iv = [];
    for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
    const recent = iv.slice(-3);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const sd = Math.sqrt(recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length);
    if (mean < 300 || mean > 1500 || sd / mean > 0.22) return;
    const bpm = Math.round(60000 / mean);
    const nativeBpm = peaks.length > 1 ? 60 / ((peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1)) : 60;
    tempo = clamp(bpm / nativeBpm, 0.5, 3);
    taps.length = 0;
    onTempo(bpm);
    lastInteraction = clock;
  }

  /* ---- beat from the public ECG */
  function beatState(t) {
    // t in trace seconds. Ventricular contraction peaks ~0.16 s after each R peak.
    let beat = 0, conductionT = -1;
    for (const r of peaks) {
      const s = t - (r + 0.12);
      if (s > -0.25 && s < 0.6) beat = Math.max(beat, Math.exp(-((s - 0.04) ** 2) / 0.012));
      const c = t - (r - 0.2);
      if (c >= 0 && c < 0.6) conductionT = c;
    }
    return { beat, conductionT };
  }

  /* ---- render loop */
  function requestRender() {
    if (!raf && !destroyed && firstFrame) raf = requestAnimationFrame(loop);
  }
  function start() {
    last = performance.now();
    requestRender();
  }
  const running = () => visible && !document.hidden && !destroyed;

  function loop(now) {
    raf = 0;
    if (!running()) return;
    const animate = !paused && !reducedMotion;
    const busy = renderFrame(now, animate);
    if (animate || busy) raf = requestAnimationFrame(loop);
  }

  function renderFrame(now, animate) {
    // real elapsed time (tweens, ECG clock) vs. clamped physics step (inertia)
    const real = Math.min(0.25, Math.max(0, (now - last) / 1000) || 0);
    const dt = Math.min(0.05, real);
    last = now;
    const advance = animate ? Math.min(real, 0.1) : 0;
    clock += advance;

    let busy = false;
    for (const t of Object.values(weights)) busy = t.step(reducedMotion ? 1 : real) || busy;
    for (const t of Object.values(cam)) busy = t.step(reducedMotion ? 1 : real) || busy;
    busy = scan.step(reducedMotion ? 1 : advance) || busy;

    // rotation: inertia, auto-rotate after idle, or reset tween
    if (resetting) {
      busy = yawTween.step(real) || busy;
      busy = pitchTween.step(real) || busy;
      yaw = yawTween.value;
      pitch = pitchTween.value;
      if (yawTween.t >= 1 && pitchTween.t >= 1) resetting = false;
    } else if (!drag) {
      if (Math.abs(yawVel) > 0.001 || Math.abs(pitchVel) > 0.001) {
        yaw += yawVel * dt;
        pitch = clamp(pitch + pitchVel * dt, -0.45, 0.55);
        const decay = Math.exp(-dt * 4.5);
        yawVel *= decay;
        pitchVel *= decay;
        busy = true;
      }
      if (animate && clock - lastInteraction > 2.5) yaw += advance * 0.16;
    }
    root.rotation.set(pitch, yaw, 0, "XYZ");

    // camera from tweened spherical preset
    const az = cam.az.value, el = cam.el.value, dist = cam.dist.value * baseDistance, ty = cam.ty.value;
    camera.position.set(Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(0, ty, 0);

    // ECG clock and heartbeat
    ecgTime = (ecgTime + advance * tempo) % traceDuration;
    const { beat, conductionT } = reducedMotion ? { beat: 0, conductionT: 0.24 } : beatState(ecgTime);
    uniformsBeat.value = beat * weights.anatomy.value + beat * 0.6 * weights.signal.value;

    const wa = weights.anatomy.value, ws = weights.signal.value, wr = weights.recon.value;
    if (heartSolid) {
      heartSolid.visible = wa > 0.003;
      solidMat.opacity = wa;
      const fading = wa < 0.999;
      if (solidMat.transparent !== fading) {
        solidMat.transparent = fading;
        solidMat.needsUpdate = true;
      }
      solidMat.depthWrite = wa > 0.5;
      if (coronaries) {
        coronaries.visible = wa > 0.01;
        coronaryMat.opacity = clamp(wa, 0, 1);
        const cf = coronaryMat.opacity < 0.999;
        if (coronaryMat.transparent !== cf) {
          coronaryMat.transparent = cf;
          coronaryMat.needsUpdate = true;
        }
        coronaryMat.emissiveIntensity = 0.1 + beat * 0.5 * wa;
      }
      heartGlass.visible = ws + wr * 0.35 > 0.003;
      glassUniforms.uOpacity.value = ws + wr * 0.16;
      if (chambers) {
        chambers.visible = ws > 0.01;
        chamberMat.opacity = ws * (palette.additive ? 0.16 : 0.22);
        chamberMat.emissiveIntensity = 0.2 + beat * 0.6;
      }
      for (const c of conduction) {
        c.mesh.visible = ws > 0.01;
        c.mat.uniforms.uOpacity.value = ws;
        const [t0, t1] = c.timing;
        c.mat.uniforms.uHead.value = conductionT < 0 ? -1 : (conductionT - t0) / Math.max(0.01, t1 - t0);
      }
      for (const d of nodeDots) {
        d.visible = ws > 0.01;
        d.material.uniforms.uOpacity.value = ws * (0.5 + (conductionT >= 0 && conductionT < 0.12 ? 0.8 : 0));
      }
      if (points) points.visible = slices.visible = frame.visible = scanPlane.visible = wr > 0.01;
      pointsUniforms.uOpacity.value = wr;
      linesUniforms.uOpacity.value = wr * 0.62;
      frameUniforms.uOpacity.value = wr * 0.7;
      // scan plane: sweeps once on entry (reveals the reconstruction), then breathes slowly
      const sweeping = scan.t < 1;
      const reveal = sweeping ? scan.value : scan.max + 0.05;
      if (!sweeping) bandClock += advance;
      const band = sweeping ? scan.value : scan.min + (scan.max - scan.min) * (0.5 + 0.5 * Math.cos(bandClock * 0.55));
      pointsUniforms.uReveal.value = reveal;
      pointsUniforms.uBand.value = band;
      if (scanPlane) scanPlane.position.y = band;
      planeUniforms.uOpacity.value = wr * 0.35;
      bandY = band;
      shadow.material.opacity = (palette.additive ? 1 : 0.55) * (wa * 0.9 + 0.25);
    }

    renderer.render(scene, camera);
    onFrame({ ecgTime, tempo, beat, mode, paused, bandY, yaw, pitch, animate });

    // adaptive resolution
    if (animate && dt > 0) {
      frameTimes.push(real);
      if (frameTimes.length >= 90) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        frameTimes = [];
        if (avg > 1 / 40 && dpr > 1) {
          dpr = Math.max(1, dpr * 0.8);
          resize();
        }
      }
    }
    return busy;
  }
  let bandY = 0;
  let bandClock = 0;

  /* ---- visibility */
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) {
      last = performance.now();
      requestRender();
    }
  });
  io.observe(host);
  const onVis = () => {
    if (!document.hidden) {
      last = performance.now();
      requestRender();
    }
  };
  document.addEventListener("visibilitychange", onVis);

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    onError(new Error("WebGL context lost"));
  });

  /* ---- public API */
  return {
    setMode: (m) => setMode(m),
    getMode: () => mode,
    setPaused(p) {
      paused = !!p;
      last = performance.now();
      requestRender();
    },
    isPaused: () => paused,
    reset,
    setTheme(name) {
      palette = PALETTES[name] || PALETTES.dark;
      applyPaletteColors();
      solidMat.sheenColor.copy(colors.sheen);
      coronaryMat.color.copy(colors.coronary);
      coronaryMat.emissive.copy(colors.coronary);
      chamberMat.color.copy(colors.chamber);
      chamberMat.emissive.copy(colors.chamber);
      setBlending();
      requestRender();
    },
    rotateBy(d) {
      yaw += d;
      lastInteraction = clock;
      requestRender();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onCancel);
      host.removeEventListener("keydown", onKey);
      const geos = new Set(), mats = new Set();
      scene.traverse((o) => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) mats.add(o.material);
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => {
        m.map?.dispose?.();
        m.dispose();
      });
      envTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    },
  };
}
