/* Interactive biomedical portfolio. Motion is self-hosted; all demos run locally.
 * ECG: existing public PTB-XL trace. Echo/pose/particles: illustrative geometry.
 */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let lang = "es",
    cleanup = [],
    hero,
    secretMode = "orbit";
  const t = (es, en) => (lang === "es" ? es : en);
  const motion = (el, values, options = {}) => {
    if (!el || reduced.matches || !window.Motion?.animate) return;
    return window.Motion.animate(el, values, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      ...options,
    });
  };
  const labels = {
    playground: ["Abrir playground", "Open playground"],
    scroll: ["Explorar el trabajo", "Explore the work"],
    archive: ["Explorar otros 8 proyectos", "Explore 8 more projects"],
    methodology: ["Resumen y metodología", "Summary & methodology"],
    allCredentials: [
      "Explorar formación adicional",
      "Explore further training",
    ],
    playHint: [
      "Toca el universo. Tiene memoria de unos segundos.",
      "Touch the universe. It remembers for a few seconds.",
    ],
  };
  function translate() {
    $("#interactive-lab").setAttribute(
      "aria-label",
      t("Laboratorio interactivo", "Interactive laboratory"),
    );
    $("#nav-cv-link").setAttribute(
      "aria-label",
      t("Descargar CV en español", "Download English résumé"),
    );
    $("#playground-canvas").setAttribute(
      "aria-label",
      t(
        "Constelación interactiva: toca para crear ondas",
        "Interactive constellation: tap to create ripples",
      ),
    );

    $$("[data-i18n]").forEach((el) => {
      const a = labels[el.dataset.i18n];
      if (a) el.textContent = a[lang === "es" ? 0 : 1];
    });
    $("#playground-title").textContent = t(
      "Un pequeño universo.",
      "A small universe.",
    );
    $("[data-close-playground]").setAttribute(
      "aria-label",
      t("Cerrar playground", "Close playground"),
    );
    $$("[data-universe]").forEach(
      (b, i) =>
        (b.textContent = (
          lang === "es"
            ? ["Órbitas", "Corazón", "Señal"]
            : ["Orbits", "Heart", "Signal"]
        )[i]),
    );
  }
  function media(p, isEs) {
    const tr = (a, b) => (isEs ? a : b);
    if (p.id === "cardiocloud")
      return `<div class="mini-lab ecg-demo"><div class="mini-chrome"><span><i class="live-dot"></i> SIGNAL EXPLORER</span><span>PTB-XL / 00009 / II</span></div><div class="ecg-display"><canvas class="ecg-canvas" role="img" aria-label="${tr("ECG público, derivación II", "Public ECG, lead II")}"></canvas><span class="signal-axis">II <small>×1</small></span><span class="signal-duration">10 s</span></div><div class="ecg-tools"><div class="segmented" role="group" aria-label="${tr("Ganancia de la señal", "Signal gain")}"><button type="button" data-gain="1" aria-pressed="true">×1</button><button type="button" data-gain="2" aria-pressed="false">×2</button></div><button type="button" class="lab-small-btn" data-ecg-pause aria-pressed="false">${tr("Pausar", "Pause")} ||</button><span class="mini-note">${tr("Señal pública · visualización local", "Public signal · local visualisation")}</span></div><div class="workflow-steps" role="group" aria-label="${tr("Explorar el flujo", "Explore the workflow")}"><button type="button" data-flow="0" aria-pressed="true">01 <span>${tr("Señal", "Signal")}</span></button><button type="button" data-flow="1" aria-pressed="false">02 <span>${tr("Modelo", "Model")}</span></button><button type="button" data-flow="2" aria-pressed="false">03 <span>${tr("Revisión", "Review")}</span></button></div><p class="flow-description" aria-live="polite">${tr("Explora una señal real del conjunto público PTB-XL.", "Explore a real signal from the public PTB-XL dataset.")}</p></div>`;
    if (p.id === "ecocardia")
      return `<div class="mini-lab eco-demo"><div class="mini-chrome"><span><i class="live-dot"></i> LOCAL INTELLIGENCE</span><span>ON-PREMISE</span></div><div class="eco-diagram"><svg viewBox="0 0 520 220" role="img" aria-label="DICOM → modelos IA → revisión"><defs><linearGradient id="eco-gradient"><stop stop-color="#67e8c5"/><stop offset="1" stop-color="#54bcec"/></linearGradient></defs><path class="eco-link" d="M108 110H412"/><path class="eco-link-pulse" d="M108 110H412"/><g class="eco-visual-node" data-node="0"><rect x="22" y="62" width="118" height="96" rx="18"/><path d="M58 88h40v35H58zM66 81h25M73 129h16"/><text x="81" y="145">DICOM</text></g><g class="eco-visual-node" data-node="1"><rect x="201" y="45" width="118" height="130" rx="25"/><circle cx="260" cy="100" r="24"/><path d="M236 100h48M260 76v48M243 83l34 34M243 117l34-34"/><text x="260" y="151">AI MODELS</text></g><g class="eco-visual-node" data-node="2"><rect x="380" y="62" width="118" height="96" rx="18"/><path d="m416 103 10 10 20-23"/><text x="439" y="145">REVIEW</text></g></svg><span class="diagram-caption">DICOM → AI → HUMAN</span></div><div class="workflow-steps" role="group" aria-label="${tr("Explorar arquitectura", "Explore architecture")}"><button type="button" data-eco="0" aria-pressed="true">01 <span>${tr("Imagen", "Image")}</span></button><button type="button" data-eco="1" aria-pressed="false">02 <span>${tr("Modelos", "Models")}</span></button><button type="button" data-eco="2" aria-pressed="false">03 <span>${tr("Contexto", "Context")}</span></button></div><p class="flow-description" aria-live="polite">${tr("DICOM y Orthanc organizan la imagen dentro de la red hospitalaria.", "DICOM and Orthanc organise imaging inside the hospital network.")}</p></div>`;
    if (p.id === "convity")
      return `<div class="mini-lab convity-demo"><div class="mini-chrome"><span><i class="live-dot"></i> CODE, MADE VISIBLE</span><span>STATIC / LOCAL</span></div><div class="convity-example"><div class="code-preview"><span>formatName.js</span><pre><code>function formatName(name) {\n  return name.trim();\n}</code></pre></div><div class="cfg-preview"><svg viewBox="0 0 250 190" role="img" aria-label="${tr("Grafo de flujo del código", "Code control-flow graph")}"></svg></div></div><div class="ecg-tools"><div class="segmented" role="group" aria-label="${tr("Versión del código", "Code version")}"><button type="button" data-code="before" aria-pressed="true">${tr("Antes", "Before")}</button><button type="button" data-code="after" aria-pressed="false">${tr("Después", "After")}</button></div><span class="mini-note">${tr("Ejemplo ilustrativo · sin ejecutar código", "Illustrative example · no code execution")}</span></div><p class="flow-description" aria-live="polite">${tr("Una función. Una ruta. Pulsa «Después» y sigue el cambio.", "One function. One path. Press “After” to follow the change.")}</p></div>`;
    return "";
  }
  window.PortfolioLab = { media };

  // One scheduler for every visible canvas; no work for off-screen or paused scenes.
  const scenes = new Set();
  let raf = 0,
    last = 0;
  function tick(now) {
    raf = 0;
    if (document.hidden) return;
    if (now - last > 32) {
      last = now;
      scenes.forEach((s) => {
        if (s.visible && !s.paused) s.draw(now / 1000);
      });
    }
    if ([...scenes].some((s) => s.visible && !s.paused && !reduced.matches))
      raf = requestAnimationFrame(tick);
  }
  function wake() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const s = [...scenes].find((s) => s.el === e.target);
        if (s) {
          s.visible = e.isIntersecting;
          if (s.visible) {
            s.draw(performance.now() / 1000);
            wake();
          }
        }
      }),
    { rootMargin: "80px" },
  );
  function scene(el, draw) {
    const s = { el, draw, visible: false, paused: false };
    scenes.add(s);
    observer.observe(el);
    const resize = new ResizeObserver(() => {
      if (s.visible) draw(performance.now() / 1000);
    });
    resize.observe(el);
    const dispose = () => {
      observer.unobserve(el);
      resize.disconnect();
      scenes.delete(s);
    };
    dispose.state = s;
    return dispose;
  }
  document.addEventListener("visibilitychange", wake);
  reduced.addEventListener("change", () => {
    scenes.forEach((s) => s.draw(performance.now() / 1000));
    wake();
  });
  function size(canvas) {
    const r = canvas.getBoundingClientRect(),
      d = Math.min(devicePixelRatio || 1, 1.75);
    if (r.width < 1 || r.height < 1) return null;
    const w = Math.round(r.width * d),
      h = Math.round(r.height * d);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return { w, h, d };
  }
  function grid(c, w, h, step = 28) {
    c.strokeStyle = "rgba(112,210,192,.07)";
    c.lineWidth = 1;
    c.beginPath();
    for (let x = 0; x < w; x += step) {
      c.moveTo(x, 0);
      c.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      c.moveTo(0, y);
      c.lineTo(w, y);
    }
    c.stroke();
  }
  function trace(c, w, h, time, gain = 1, sweep = true) {
    const arr = window.CARDIOCLOUD_TRACE || [];
    if (!arr.length) return;
    c.clearRect(0, 0, w, h);
    grid(c, w, h, 22);
    c.strokeStyle = "#80f4d2";
    c.lineWidth = 1.5;
    c.shadowColor = "#52cba6";
    c.shadowBlur = 6;
    c.beginPath();
    for (let i = 0; i < arr.length; i++) {
      let x = (i / (arr.length - 1)) * w,
        y = h * 0.52 - arr[i] * h * 0.55 * gain;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
    c.shadowBlur = 0;
    if (sweep && !reduced.matches) {
      const x = ((time * 0.09) % 1) * w;
      const g = c.createLinearGradient(x - 60, 0, x, 0);
      g.addColorStop(0, "rgba(126,244,211,0)");
      g.addColorStop(1, "rgba(126,244,211,.10)");
      c.fillStyle = g;
      c.fillRect(x - 60, 0, 60, h);
      c.fillStyle = "#baffeb";
      c.fillRect(x, 0, 1, h);
    }
  }

  function initProjects() {
    const ecg = $(".ecg-demo");
    if (ecg) {
      let gain = 1,
        paused = false,
        frozen = 0;
      const cv = $("canvas", ecg),
        c = cv.getContext("2d");
      const draw = (time) => {
        const z = size(cv);
        if (z) trace(c, z.w, z.h, paused ? frozen : time, gain, !paused);
      };
      const job = scene(cv, draw);
      cleanup.push(job);
      $$("[data-gain]", ecg).forEach(
        (b) =>
          (b.onclick = () => {
            gain = +b.dataset.gain;
        $(".signal-axis small", ecg).textContent = "×" + gain;
            $$("[data-gain]", ecg).forEach((x) =>
              x.setAttribute("aria-pressed", String(x === b)),
            );
            draw(performance.now() / 1000);
          }),
      );
      $("[data-ecg-pause]", ecg).onclick = (e) => {
        paused = !paused;
        frozen = performance.now() / 1000;
        job.state.paused = paused;
        draw(frozen);
        if (!paused) wake();
        e.currentTarget.setAttribute("aria-pressed", String(paused));
        e.currentTarget.textContent = paused
          ? t("Reanudar ▶", "Resume ▶")
          : t("Pausar ||", "Pause ||");
      };
      const text = [
        t(
          "Explora una señal real del conjunto público PTB-XL.",
          "Explore a real signal from the public PTB-XL dataset.",
        ),
        t(
          "El modelo del caso documentado obtuvo 0.918 Macro AUROC. Esta vista no ejecuta inferencia.",
          "The documented model achieved 0.918 Macro AUROC. This view does not run inference.",
        ),
        t(
          "La aplicación documentada persiste la revisión humana en DynamoDB. Abre el caso para ver la evidencia.",
          "The documented application persists human review in DynamoDB. Open the case to see the evidence.",
        ),
      ];
      wireSteps(ecg, "data-flow", text);
    }
    const eco = $(".eco-demo");
    if (eco) {
      wireSteps(
        eco,
        "data-eco",
        [
          t(
            "DICOM y Orthanc organizan la imagen dentro de la red hospitalaria.",
            "DICOM and Orthanc organise imaging inside the hospital network.",
          ),
          t(
            "Modelos de visión procesan las vistas. El cálculo permanece en infraestructura local.",
            "Vision models process the views. Computation stays on local infrastructure.",
          ),
          t(
            "El resultado se presenta con contexto y trazabilidad para su interpretación profesional.",
            "Results are presented with context and traceability for professional interpretation.",
          ),
        ],
        (i) =>
          $$("[data-node]", eco).forEach((n, j) => {
            n.classList.toggle("is-selected", i === j);
            if (i === j) motion(n, { opacity: [0.5, 1] }, { duration: 0.5 });
          }),
      );
    }
    const conv = $(".convity-demo");
    if (conv) {
      const update = (after) => {
        const code = after
          ? 'function formatName(name) {\n  if (!name) return "Guest";\n  return name.trim();\n}'
          : "function formatName(name) {\n  return name.trim();\n}";
        $("code", conv).textContent = code;
        $(".code-preview", conv).classList.toggle("is-diff", after);
        const node = (x, y, w, text, cls = "") =>
          `<g class="cfg-node ${cls}"><rect x="${x}" y="${y}" width="${w}" height="28" rx="8"/><text x="${x + w / 2}" y="${y + 18}">${text}</text></g>`;
        $(".cfg-preview svg", conv).innerHTML = after
          ? `<path class="cfg-edge" d="M125 37v15M125 80v16M125 110H56v22M125 110h69v22"/>${node(83, 9, 84, "start")}${node(77, 52, 96, "!name ?", "new-node")}${node(11, 132, 91, '"Guest"', "new-node")}${node(149, 132, 91, "trim()")}<text x="68" y="106" class="cfg-caption">YES</text><text x="179" y="106" class="cfg-caption">NO</text>`
          : `<path class="cfg-edge" d="M125 65v45"/>${node(83, 37, 84, "start")}${node(75, 110, 100, "trim()")}`;
        $(".flow-description", conv).textContent = after
          ? t(
              "Un control nuevo. Dos rutas visibles. El código se analiza, no se ejecuta.",
              "One new check. Two visible paths. Code is analysed, never executed.",
            )
          : t(
              "Una función. Una ruta. Pulsa «Después» y sigue el cambio.",
              "One function. One path. Press “After” to follow the change.",
            );
        motion($(".cfg-preview svg", conv), { opacity: [0.3, 1], y: [8, 0] });
      };
      $$("[data-code]", conv).forEach(
        (b) =>
          (b.onclick = () => {
            $$("[data-code]", conv).forEach((x) =>
              x.setAttribute("aria-pressed", String(x === b)),
            );
            update(b.dataset.code === "after");
          }),
      );
      update(false);
    }
  }
  function wireSteps(root, attr, text, extra) {
    const buttons = $$(`[${attr}]`, root);
    const activate = (i) => {
      buttons.forEach((b, j) =>
        b.setAttribute("aria-pressed", String(i === j)),
      );
      const el = $(".flow-description", root);
      el.textContent = text[i];
      motion(el, { opacity: [0.35, 1], y: [4, 0] }, { duration: 0.3 });
      if (extra) extra(i);
    };
    buttons.forEach((b, i) => (b.onclick = () => activate(i)));
    activate(0);
  }

  class PointHeart {
    constructor(canvas) {
      this.canvas = canvas;
      this.rotation = 0;
      this.burst = 0;
      this.ok = false;
      try {
        this.gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        if (!this.gl) return;
        const gl = this.gl;
        const shader = (type, src) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw Error(gl.getShaderInfoLog(s));
          return s;
        };
        const vs = shader(
          gl.VERTEX_SHADER,
          `attribute vec3 pos;attribute float seed;uniform float time,angle,aspect,burst;varying float depth;varying float rnd;void main(){float beat=1.+.045*pow(max(0.,sin(time*7.54)),8.);vec3 p=pos*beat;float a=angle+.13*sin(time*.18);p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;p+=normalize(pos)*burst*(.3+seed);float z=p.z+3.5;gl_Position=vec4(p.x*2.3/aspect/z,p.y*2.3/z,0.,1.);gl_PointSize=(1.3+seed*1.5)*(4./z);depth=(p.z+1.)*.5;rnd=seed;}`,
        );
        const fs = shader(
          gl.FRAGMENT_SHADER,
          `precision mediump float;varying float depth;varying float rnd;void main(){float d=length(gl_PointCoord-.5);float a=(1.-smoothstep(.1,.5,d))*(.2+.65*depth);vec3 col=mix(vec3(.12,.55,.59),vec3(.66,1.,.84),depth);gl_FragColor=vec4(col,a);}`,
        );
        const p = gl.createProgram();
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
          throw Error("WebGL program");
        this.program = p;
        gl.useProgram(p);
        let points = [],
          seeds = [];
        let rand = 42;
        const random = () => {
          rand = (rand * 1664525 + 1013904223) >>> 0;
          return rand / 4294967296;
        };
        for (let i = 0; i < 6200; i++) {
          const a = random() * Math.PI * 2,
            r = Math.sqrt(random()),
            z = (random() - 0.5) * 0.85 * Math.sqrt(1 - r * r);
          points.push(
            Math.pow(Math.sin(a), 3) * r * 0.92,
            ((13 * Math.cos(a) -
              5 * Math.cos(2 * a) -
              2 * Math.cos(3 * a) -
              Math.cos(4 * a)) /
              17) *
              r +
              0.08,
            z,
          );
          seeds.push(random());
        }
        this.count = seeds.length;
        this.buffers = [];
        for (const [name, array, sz] of [
          ["pos", points, 3],
          ["seed", seeds, 1],
        ]) {
          const b = gl.createBuffer();
          this.buffers.push(b);
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(array),
            gl.STATIC_DRAW,
          );
          const loc = gl.getAttribLocation(p, name);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 0, 0);
        }
        this.u = {};
        for (const n of ["time", "angle", "aspect", "burst"])
          this.u[n] = gl.getUniformLocation(p, n);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        this.ok = true;
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          this.ok = false;
        });
        canvas.addEventListener("webglcontextrestored", () => {
          this.ok = false;
        });
      } catch {
        this.ok = false;
      }
    }
    draw(time) {
      if (!this.ok) return;
      const z = size(this.canvas);
      if (!z) return;
      const g = this.gl;
      g.viewport(0, 0, z.w, z.h);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.useProgram(this.program);
      g.uniform1f(this.u.time, reduced.matches ? 0 : time);
      g.uniform1f(this.u.angle, this.rotation);
      g.uniform1f(this.u.aspect, z.w / z.h);
      g.uniform1f(this.u.burst, this.burst);
      g.drawArrays(g.POINTS, 0, this.count);
      this.burst *= 0.92;
    }
    destroy() {
      if (this.gl) {
        this.buffers?.forEach((b) => this.gl.deleteBuffer(b));
        if (this.program) this.gl.deleteProgram(this.program);
      }
    }
  }
  function makeHero() {
    const host = $("#interactive-lab");
    host.innerHTML = `<div class="lab-topline"><span><i class="live-dot"></i> INTERACTIVE LAB</span><button type="button" class="lab-pause" aria-label="${t("Pausar animaciones", "Pause animations")}" aria-pressed="false">||</button></div><div class="lab-tabs" role="tablist" aria-label="${t("Experimentos visuales", "Visual experiments")}"><button role="tab" id="lab-tab-ecg" type="button" aria-selected="true" aria-controls="lab-stage" data-lab="ecg">01 <span>ECG</span></button><button role="tab" id="lab-tab-echo" type="button" aria-selected="false" aria-controls="lab-stage" data-lab="echo" tabindex="-1">02 <span>${t("Ecografía", "Echo")}</span></button><button role="tab" id="lab-tab-pose" type="button" aria-selected="false" aria-controls="lab-stage" data-lab="pose" tabindex="-1">03 <span>${t("Visión 3D", "3D vision")}</span></button></div><div class="lab-stage" id="lab-stage" role="tabpanel" aria-labelledby="lab-tab-ecg"><div class="lab-stage-corner tl">SIGNAL → INSIGHT</div><div class="lab-stage-corner tr">RM / 2026</div><canvas class="hero-particles" aria-hidden="true"></canvas><canvas class="hero-visual" role="img" aria-label="${t("Representación interactiva de señales y geometría", "Interactive signal and geometry representation")}"></canvas><div class="lab-crosshair" aria-hidden="true"></div><div class="lab-scene-label"><span class="lab-mode-label">POINT CLOUD / ECG</span><span class="lab-gesture">${t("Desliza para explorar", "Drag to explore")} ↔</span></div><canvas class="hero-trace" aria-hidden="true"></canvas></div><div class="lab-controls"><label><span class="lab-range-label">${t("Rotación", "Rotation")}</span><input type="range" min="-100" max="100" value="0" aria-label="${t("Rotación", "Rotation")}"></label><span class="lab-current-value">0°</span></div><div class="lab-bottomline"><span class="lab-provenance">${t("ECG público · geometría generativa", "Public ECG · generative geometry")}</span><a class="lab-project-link" href="#projects">CardioCloud ↗</a></div>`;
    let mode = "ecg",
      rotation = 0,
      cycle = 0.4,
      pose = 0.4,
      paused = false,
      frozen = 0;
    const cv = $(".hero-visual", host),
      ctx = cv.getContext("2d"),
      pc = $(".hero-particles", host),
      heart = new PointHeart(pc),
      tc = $(".hero-trace", host),
      tr = tc.getContext("2d");
    const draw = (time) => {
      if (!host.isConnected) return;
      time = paused ? frozen : reduced.matches ? 0 : time;
      const z = size(cv);
      if (!z) return;
      ctx.clearRect(0, 0, z.w, z.h);
      if (mode === "ecg") {
        pc.hidden = !heart.ok;
        if (heart.ok) {
          heart.rotation = rotation;
          heart.draw(time);
        } else drawHeart2D(ctx, z.w, z.h, time, rotation);
        drawOrbit(ctx, z.w, z.h, time);
      }
      if (mode === "echo") {
        pc.hidden = true;
        drawEcho(ctx, z.w, z.h, time, cycle);
      }
      if (mode === "pose") {
        pc.hidden = true;
        drawPose(ctx, z.w, z.h, time, rotation, pose);
      }
      const a = size(tc);
      if (a) trace(tr, a.w, a.h, time, 1, !paused);
    };
    const heroJob = scene(host, draw);
    cleanup.push(heroJob, () => heart.destroy());
    const range = $("input", host),
      text = $(".lab-range-label", host),
      val = $(".lab-current-value", host);
    const setMode = (m) => {
      mode = m;
      $$("[data-lab]", host).forEach((b) => {
        const active = b.dataset.lab === m;
        b.setAttribute("aria-selected", String(active));
        b.tabIndex = active ? 0 : -1;
      });
      $("#lab-stage").setAttribute("aria-labelledby", "lab-tab-" + m);
      $(".lab-mode-label", host).textContent =
        m === "ecg"
          ? "POINT CLOUD / ECG"
          : m === "echo"
            ? "ECHO / CONCEPTUAL A4C"
            : "POSE / SPATIAL RECONSTRUCTION";
      $(".lab-provenance", host).textContent =
        m === "ecg"
          ? t(
              "ECG público · geometría generativa",
              "Public ECG · generative geometry",
            )
          : t(
              "Demo visual ilustrativa · datos simulados",
              "Illustrative visual demo · simulated data",
            );
      text.textContent =
        m === "echo"
          ? t("Ciclo", "Cycle")
          : m === "pose"
            ? t("Ángulo de cámara", "Camera angle")
            : t("Rotación", "Rotation");
      range.setAttribute("aria-label", text.textContent);
      range.value =
        m === "echo"
          ? Math.round(cycle * 200 - 100)
          : Math.round((rotation / Math.PI) * 100);
      $(".lab-project-link", host).textContent =
        (m === "ecg"
          ? "CardioCloud"
          : m === "echo"
            ? "ECOCARDIA AI"
            : "Biomechanics") + " ↗";
      $(".lab-project-link", host).href =
        m === "ecg"
          ? "#projects"
          : m === "echo"
            ? "#project-ecocardia"
            : "#project-kick-biomechanics";
      tc.hidden = m !== "ecg";
      host.dataset.mode = m;
      motion(
        $("#lab-stage"),
        { opacity: [0.3, 1], scale: [0.98, 1] },
        { duration: 0.45 },
      );
      range.dispatchEvent(new Event("input"));
      draw(performance.now() / 1000);
    };
    $$("[data-lab]", host).forEach(
      (b) => (b.onclick = () => setMode(b.dataset.lab)),
    );
    $(".lab-tabs", host).onkeydown = (e) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const a = ["ecg", "echo", "pose"],
        i = a.indexOf(mode);
      setMode(
        a[
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? 2
              : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3
        ],
      );
      $('[aria-selected="true"]', host).focus();
    };
    range.oninput = () => {
      rotation = (+range.value / 100) * Math.PI;
      cycle = (+range.value + 100) / 200;
      val.textContent =
        mode === "echo"
          ? Math.round(cycle * 100) + "%"
          : Math.round((rotation / Math.PI) * 180) + "°";
      draw(performance.now() / 1000);
    };
    $(".lab-pause", host).onclick = (e) => {
      paused = !paused;
      frozen = performance.now() / 1000;
      heroJob.state.paused = paused;
      if (!paused) wake();
      e.currentTarget.setAttribute("aria-pressed", String(paused));
      e.currentTarget.setAttribute(
        "aria-label",
        paused
          ? t("Reanudar animaciones", "Resume animations")
          : t("Pausar animaciones", "Pause animations"),
      );
      e.currentTarget.textContent = paused ? "▶" : "||";
      draw(frozen);
    };
    let down = false,
      start = 0,
      base = 0;
    cv.addEventListener("pointerdown", (e) => {
      down = true;
      start = e.clientX;
      base = +range.value;
      cv.setPointerCapture(e.pointerId);
      heart.burst = 0.14;
    });
    cv.addEventListener("pointermove", (e) => {
      if (!down) return;
      range.value = Math.max(
        -100,
        Math.min(100, base + (e.clientX - start) * 0.6),
      );
      range.dispatchEvent(new Event("input"));
    });
    cv.addEventListener("pointerup", () => (down = false));
    cv.addEventListener("pointercancel", () => (down = false));
    hero = { setMode, burst: () => (heart.burst = 1.4) };
    draw(performance.now() / 1000);
  }
  function drawHeart2D(c, w, h, time, angle) {
    const scale = Math.min(w * 0.22, h * 0.38),
      beat = 1 + 0.035 * Math.sin(time * 7.5);
    for (let i = 0; i < 1400; i++) {
      const a = i * 2.39996,
        r = Math.sqrt((i % 211) / 211),
        x = Math.pow(Math.sin(a), 3),
        y =
          (13 * Math.cos(a) -
            5 * Math.cos(2 * a) -
            2 * Math.cos(3 * a) -
            Math.cos(4 * a)) /
          17;
      c.fillStyle = `rgba(125,244,207,${0.15 + r * 0.5})`;
      c.fillRect(
        w / 2 + x * r * scale * beat * Math.cos(angle * 0.3),
        h * 0.43 - y * r * scale * beat,
        1.5,
        1.5,
      );
    }
  }
  function drawOrbit(c, w, h, time) {
    c.strokeStyle = "rgba(119,223,202,.1)";
    c.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.ellipse(
        w / 2,
        h * 0.43,
        w * 0.3 + i * 9,
        h * 0.29 + i * 7,
        Math.PI * 0.06,
        0,
        Math.PI * 2,
      );
      c.stroke();
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2,
        x = w / 2 + Math.cos(a) * w * 0.39,
        y = h * 0.43 + Math.sin(a) * h * 0.37;
      c.fillStyle = "rgba(151,235,221,.24)";
      c.fillRect(x, y, 2, 2);
    }
  }
  let echoNoise;
  function drawEcho(c, w, h, time, phase) {
    if (!echoNoise) {
      echoNoise = document.createElement("canvas");
      echoNoise.width = 280;
      echoNoise.height = 240;
      const n = echoNoise.getContext("2d"),
        im = n.createImageData(280, 240);
      let r = 12;
      for (let i = 0; i < im.data.length; i += 4) {
        r = (r * 16807) % 2147483647;
        const v = r % 150;
        im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
        im.data[i + 3] = 255;
      }
      n.putImageData(im, 0, 0);
    }
    c.save();
    c.translate(w / 2, h * 0.06);
    const rad = h * 0.83;
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, rad, Math.PI * 0.24, Math.PI * 0.76);
    c.closePath();
    c.clip();
    c.fillStyle = "#081918";
    c.fillRect(-w / 2, 0, w, h);
    c.globalAlpha = 0.36;
    c.drawImage(echoNoise, -w / 2, -Math.sin(time * 0.7) * 8, w, h);
    c.globalAlpha = 1;
    const beat = Math.sin(time * 2.2 + phase * Math.PI * 2) * 0.05;
    for (let i = 0; i < 4; i++) {
      const x = (i % 2 ? 1 : -1) * rad * 0.19,
        y = rad * (i < 2 ? 0.53 : 0.79),
        rx = rad * (i < 2 ? 0.17 : 0.145) * (1 + beat),
        ry = rad * (i < 2 ? 0.24 : 0.14) * (1 - beat);
      const g = c.createRadialGradient(x, y, rx * 0.4, x, y, rx * 1.7);
      g.addColorStop(0, "#040b0c");
      g.addColorStop(0.65, "#091011");
      g.addColorStop(0.84, "#6f8a83");
      g.addColorStop(1, "#182b27");
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(
        x,
        y,
        rx * 1.35,
        ry * 1.2,
        i % 2 ? 0.18 : -0.18,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
    c.strokeStyle = "rgba(196,218,207,.5)";
    c.lineWidth = rad * 0.018;
    c.beginPath();
    c.moveTo(-rad * 0.11, rad * 0.3);
    c.quadraticCurveTo(-rad * 0.02, rad * 0.62, 0, rad * 0.94);
    c.stroke();
    c.restore();
    c.strokeStyle = "rgba(172,222,209,.2)";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(w / 2, h * 0.06);
    c.arc(w / 2, h * 0.06, rad, Math.PI * 0.24, Math.PI * 0.76);
    c.closePath();
    c.stroke();
    c.fillStyle = "#97b9b0";
    c.font = `${Math.max(10, w * 0.02)}px monospace`;
    c.fillText("A4C / CONCEPT", w * 0.06, h * 0.9);
  }
  function drawPose(c, w, h, time, angle, phase) {
    const a = angle * 0.55 + 0.35,
      kick = Math.sin(time * 1.4 + phase) * 0.5 + 0.5;
    const pts = [
      [0, -1.1, 0],
      [0, -0.78, 0],
      [-0.32, -0.65, 0],
      [0.32, -0.65, 0],
      [-0.52, -0.25, 0.2],
      [0.52, -0.2, -0.2],
      [-0.65, 0.1, 0.22],
      [0.7, 0.1, -0.3],
      [0, 0.05, 0],
      [-0.19, 0.1, 0],
      [0.19, 0.1, 0],
      [-0.27, 0.6, 0.03],
      [0.28 + kick * 0.4, 0.45, -kick * 0.4],
      [-0.3, 1.05, 0.1],
      [0.3 + kick * 0.65, 0.9 - kick * 0.75, -kick * 0.45],
    ];
    const project = ([x, y, z]) => {
      const X = x * Math.cos(a) - z * Math.sin(a),
        Z = x * Math.sin(a) + z * Math.cos(a),
        s = Math.min(w * 0.3, h * 0.33) * (3 / (3 + Z));
      return [w / 2 + X * s, h * 0.44 + y * s];
    };
    const screen = pts.map(project);
    grid(c, w, h, 40);
    const edges = [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [1, 8],
      [8, 9],
      [8, 10],
      [9, 11],
      [10, 12],
      [11, 13],
      [12, 14],
      [2, 3],
      [9, 10],
    ];
    edges.forEach(([a, b], i) => {
      c.strokeStyle = i % 3 ? "#72e2c4" : "#72bce2";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(...screen[a]);
      c.lineTo(...screen[b]);
      c.stroke();
    });
    screen.forEach(([x, y], i) => {
      c.fillStyle = "#0b2024";
      c.strokeStyle = i > 10 ? "#b4e1fb" : "#9cffde";
      c.beginPath();
      c.arc(x, y, 4, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    });
    c.strokeStyle = "rgba(123,207,193,.2)";
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.ellipse(
        w / 2,
        h * 0.87,
        w * 0.15 + i * 15,
        4 + i * 3,
        0,
        0,
        Math.PI * 2,
      );
      c.stroke();
    }
    c.fillStyle = "#86afa6";
    c.font = "11px monospace";
    c.fillText("15 LANDMARKS / GENERATIVE POSE", w * 0.07, h * 0.96);
  }

  function foldContent() {
    const title = $("#preprint-title"),
      abstract = $("#preprint-summary");
    let fullTitle = $("#preprint-full-title");
    if (!fullTitle) {
      fullTitle = document.createElement("p");
      fullTitle.id = "preprint-full-title";
      fullTitle.className = "full-paper-title";
      abstract.before(fullTitle);
    }
    fullTitle.textContent = title.textContent;
    title.textContent = t(
      "Biomecánica desde una cámara.",
      "Biomechanics from one camera.",
    );

    $$(".timeline-content").forEach((el) => {
      const desc = $(".timeline-desc", el);
      if (desc) {
        const d = document.createElement("details");
        d.className = "editorial-fold timeline-fold";
        d.innerHTML = `<summary>${t("Mi aportación", "My contribution")}<span aria-hidden="true">+</span></summary>`;
        desc.before(d);
        d.append(desc);
      }
    });
    $$(".stack-domain").forEach((el) => {
      const body = $(".stack-domain-body", el);
      if (!body) return;
      const d = document.createElement("details");
      d.className = "stack-disclosure";
      const head = $(".stack-domain-head", el);
      const summary = document.createElement("summary");
      summary.append(head);
      const plus = document.createElement("span");
      plus.className = "fold-plus";
      plus.textContent = "+";
      summary.append(plus);
      d.append(summary, body);
      el.append(d);
    });
    $$(".trial-ledger-item").forEach((el) => {
      const p = $(".trial-desc", el);
      if (p) {
        const d = document.createElement("details");
        d.className = "editorial-fold";
        d.innerHTML = `<summary>${t("Sobre el ensayo", "About the trial")}<span aria-hidden="true">+</span></summary>`;
        p.before(d);
        d.append(p);
      }
    });
    $$(".project-card").forEach((el) => {
      el.id = "project-" + el.dataset.projectId;
    });
    $$(".project-kpis").forEach((el) => {
      if (el.children.length > 1) {
        const d = document.createElement("details");
        d.className = "kpi-disclosure";
        d.innerHTML = `<summary>${t("Resultados y tecnología", "Results & technology")}<span aria-hidden="true">+</span></summary>`;
        el.before(d);
        d.append(el);
        const row = d.nextElementSibling;
        if (row?.classList.contains("tech-token-row")) d.append(row);
      }
    });
  }
  let updateSearchCount = () => {};
  document.addEventListener("portfolio:filtered", () => updateSearchCount());
  function projectSearch() {
    let bar = $(".project-search");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "project-search";
      $("#project-filters").before(bar);
    }
    bar.innerHTML = `<label><span aria-hidden="true">⌕</span><input type="search" placeholder="${t("Buscar una idea, proyecto o tecnología…", "Search an idea, project or technology…")}" aria-label="${t("Buscar proyectos", "Search projects")}"></label><span class="search-results" aria-live="polite"></span>`;
    let empty = $(".project-empty");
    if (!empty) {
      empty = document.createElement("p");
      empty.className = "project-empty";
      $("#project-filters").after(empty);
    }
    empty.textContent = t(
      "No hay coincidencias. Prueba otra búsqueda o cambia el filtro.",
      "No matches. Try another search or change the filter.",
    );
    updateSearchCount = () => {
      const q = $("input", bar).value.trim();
      const count = $$(".project-card").filter((c) => !c.hidden).length;
      empty.hidden = count > 0;
      $(".search-results", bar).textContent = q
        ? count + " " + t("resultados", "results")
        : "";
      $("#secondary-fold").hidden = !$$(
        "#secondary-projects-grid .project-card",
      ).some((c) => !c.hidden);
    };
    updateSearchCount();
    $("input", bar).oninput = () => {
      if ($("input", bar).value.trim()) $("#secondary-fold").open = true;
      document.dispatchEvent(new Event("portfolio:search"));
      updateSearchCount();
    };
  }
  function subtleMotion() {
    if (reduced.matches) return;
    const targets = $$(
      ".project-card,.publication-monograph,.clinical-trials-ledger,.timeline-entry,.stack-domain,.edu-degree-card,.cert-featured-row",
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            motion(
              e.target,
              { opacity: [0.55, 1], y: [20, 0] },
              { duration: 0.6 },
            );
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));
    cleanup.push(() => io.disconnect());
    $$(".project-card,.stack-domain,.channel-link").forEach((el) => {
      el.onpointermove = (e) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--pointer-x", e.clientX - r.left + "px");
        el.style.setProperty("--pointer-y", e.clientY - r.top + "px");
      };
      el.onpointerleave = () => {
        el.style.removeProperty("--pointer-x");
        el.style.removeProperty("--pointer-y");
      };
    });
  }
  function render() {
    cleanup.forEach((fn) => fn());
    cleanup = [];
    lang = document.documentElement.lang === "en" ? "en" : "es";
    makeHero();
    initProjects();
    foldContent();
    projectSearch();
    translate();
    $$("[data-universe]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.universe === secretMode)),
    );
    subtleMotion();
  }
  document.addEventListener("portfolio:render", render);

  // A small, opt-in particle playground. Tap waves and three visual modes.
  document.addEventListener("DOMContentLoaded", () => {
    const dlg = $("#playground-dialog"),
      canvas = $("#playground-canvas"),
      c = canvas.getContext("2d");
    let ripples = [],
      visible = false;
    const open = () => {
      if (dlg.open) return;
      dlg.showModal();
      visible = true;
      canvas.focus();
      playScene.visible = true;
      playScene.draw(performance.now() / 1000);
      wake();
      motion(dlg, { opacity: [0, 1], scale: [0.97, 1] }, { duration: 0.35 });
    };
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-playground]")) open();
    });
    $("[data-close-playground]").onclick = () => dlg.close();
    dlg.addEventListener("close", () => {
      visible = false;
      playScene.visible = false;
      ripples = [];
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) {
        const r = dlg.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          dlg.close();
      }
    });
    const draw = (time) => {
      if (!visible) return;
      const z = size(canvas);
      if (!z) return;
      const { w, h } = z;
      c.clearRect(0, 0, w, h);
      grid(c, w, h, 48);
      ripples = ripples.filter((p) => time - p.time < 3);
      for (let i = 0; i < 650; i++) {
        const seed = i * 2.39996,
          r = Math.sqrt(i / 650);
        let x, y;
        if (secretMode === "heart") {
          x =
            w / 2 +
            Math.pow(Math.sin(seed), 3) * r * Math.min(w * 0.32, h * 0.38);
          y =
            h / 2 -
            ((13 * Math.cos(seed) -
              5 * Math.cos(2 * seed) -
              2 * Math.cos(3 * seed) -
              Math.cos(4 * seed)) /
              17) *
              r *
              Math.min(w * 0.32, h * 0.38);
        } else if (secretMode === "wave") {
          x = (i / 650) * w;
          y =
            h / 2 + Math.sin(i * 0.04 + time) * Math.sin(i * 0.007) * h * 0.26;
        } else {
          x = w / 2 + Math.cos(seed + time * 0.06) * r * w * 0.42;
          y = h / 2 + Math.sin(seed + time * 0.06) * r * h * 0.4;
        }
        for (const p of ripples) {
          const dx = x - p.x,
            dy = y - p.y,
            d = Math.hypot(dx, dy),
            wave = (time - p.time) * 200;
          if (Math.abs(d - wave) < 70) {
            const push =
              Math.sin(((d - wave) / 70) * Math.PI) *
              (1 - (time - p.time) / 3) *
              22;
            x += (dx / (d || 1)) * push;
            y += (dy / (d || 1)) * push;
          }
        }
        c.fillStyle = i % 5 ? "rgba(130,240,207,.65)" : "rgba(127,197,255,.8)";
        c.beginPath();
        c.arc(x, y, 1.2 + (i % 3) * 0.35, 0, Math.PI * 2);
        c.fill();
      }
      ripples.forEach((p) => {
        c.strokeStyle = `rgba(135,242,207,${(1 - (time - p.time) / 3) * 0.22})`;
        c.beginPath();
        c.arc(p.x, p.y, (time - p.time) * 200, 0, Math.PI * 2);
        c.stroke();
      });
    };
    const playScene = { el: canvas, visible: false, paused: false, draw };
    scenes.add(playScene);
    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      ripples.push({
        x: ((e.clientX - r.left) * canvas.width) / r.width,
        y: ((e.clientY - r.top) * canvas.height) / r.height,
        time: performance.now() / 1000,
      });
      draw(performance.now() / 1000);
      wake();
    });
    $$("[data-universe]").forEach(
      (b) =>
        (b.onclick = () => {
          secretMode = b.dataset.universe;
          $$("[data-universe]").forEach((x) =>
            x.setAttribute("aria-pressed", String(x === b)),
          );
          draw(performance.now() / 1000);
        }),
    );
    let typed = "",
      brandTaps = 0,
      tapTimer;
    document.addEventListener("keydown", (e) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.target.matches("input,textarea,[contenteditable]")
      )
        return;
      typed = (typed + e.key.toLowerCase()).slice(-3);
      if (typed === "lab") open();
    });
    $(".brand-mark").addEventListener("click", () => {
      clearTimeout(tapTimer);
      if (++brandTaps === 5) {
        brandTaps = 0;
        hero?.burst();
        toast(
          t(
            "Has encontrado el pulso. Prueba a escribir LAB.",
            "You found the pulse. Try typing LAB.",
          ),
        );
      }
      tapTimer = setTimeout(() => (brandTaps = 0), 1400);
    });
    const toastEl = $("#lab-toast");
    let toastTimer;
    function toast(s) {
      toastEl.textContent = s;
      toastEl.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(
        () => toastEl.classList.remove("is-visible"),
        4200,
      );
    }
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - innerHeight;
          $(".reading-progress").style.transform =
            `scaleX(${h > 0 ? scrollY / h : 0})`;
          ticking = false;
        });
      },
      { passive: true },
    );
    document.addEventListener("click", (e) => {
      const a = e.target.closest(".lab-project-link");
      if (a && a.hash.includes("kick")) $("#secondary-fold").open = true;
    });
  });
})();
