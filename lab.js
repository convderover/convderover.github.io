/* Portfolio v3 — interactive layer.
 * - Specimen 01: lazy-loads the three.js heart (assets/js/hero3d.js) over a poster.
 * - Case demos: CardioCloud signal room, ECOCARDIA imaging room, Convity code room.
 * - Playground (after-hours lab) and small discoveries.
 * Data honesty: the ECG is the public PTB-XL record 00009 (lead II, 100 Hz).
 * Echo, pose, particles and the heart model are illustrative; no inference runs here.
 */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const TRACE = () => window.CARDIOCLOUD_TRACE || [];
  const RATE = 100;
  const lang = () => (document.documentElement.lang === "en" ? "en" : "es");
  const C = () => window.PORTFOLIO_COPY[lang()];
  const tr = (es, en) => (lang() === "es" ? es : en);
  const M = () => window.Motion;
  const animate = (el, kf, o = {}) => (el && !reduced.matches && M()?.animate ? M().animate(el, kf, { duration: 0.45, ease: [0.22, 1, 0.36, 1], ...o }) : null);
  const toast = (m) => window.PortfolioApp?.toast(m);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ------------------------------------------------------------ palette from CSS */
  let pal = {};
  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    pal = { accent: v("--accent"), accent2: v("--accent-2"), signal: v("--signal"), ink: v("--ink"), ink2: v("--ink-2"), ink3: v("--ink-3"), line: v("--line"), line2: v("--line-2"), bg: v("--bg"), surface: v("--surface"), light: document.documentElement.dataset.theme === "light" };
  }

  /* ------------------------------------------------------------ 2D scheduler */
  const scenes = new Set();
  let raf = 0, lastTick = 0;
  function tick(now) {
    raf = 0;
    if (document.hidden) return;
    if (now - lastTick >= 31) {
      lastTick = now;
      scenes.forEach((s) => s.visible && !s.paused && s.draw(now / 1000));
    }
    if (!reduced.matches && [...scenes].some((s) => s.visible && !s.paused && s.animated !== false)) raf = requestAnimationFrame(tick);
  }
  const wake = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); };
  const sceneIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    for (const s of scenes) if (s.el === e.target) {
      s.visible = e.isIntersecting;
      if (s.visible) { s.draw(performance.now() / 1000); wake(); }
    }
  }), { rootMargin: "60px" });
  function scene(el, draw, opts = {}) {
    const s = { el, draw, visible: false, paused: false, ...opts };
    scenes.add(s);
    sceneIO.observe(el);
    const ro = new ResizeObserver(() => s.visible && draw(performance.now() / 1000));
    ro.observe(el);
    s.dispose = () => { sceneIO.unobserve(el); ro.disconnect(); scenes.delete(s); };
    return s;
  }
  document.addEventListener("visibilitychange", wake);
  reduced.addEventListener?.("change", () => { scenes.forEach((s) => s.draw(performance.now() / 1000)); wake(); });

  function fit(canvas, maxDpr = 2) {
    const r = canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    const d = Math.min(devicePixelRatio || 1, maxDpr);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    return { w, h, d };
  }

  /* ------------------------------------------------------------ ECG drawing */
  const peaksCache = { arr: null, peaks: [] };
  function rPeaks() {
    const a = TRACE();
    if (peaksCache.arr === a) return peaksCache.peaks;
    const max = Math.max(...a);
    const pk = [];
    for (let i = 2; i < a.length - 2; i++) if (a[i] > max * 0.5 && a[i] >= a[i - 1] && a[i] >= a[i + 1] && a[i] >= a[i - 2] && a[i] >= a[i + 2] && (!pk.length || i - pk[pk.length - 1] > 25)) pk.push(i);
    peaksCache.arr = a;
    peaksCache.peaks = pk;
    return pk;
  }
  const nativeBpm = () => { const p = rPeaks(); return p.length > 1 ? Math.round((60 * RATE) / ((p[p.length - 1] - p[0]) / (p.length - 1))) : 60; };

  /** Monitor-style strip: whole 10 s trace, sweep cursor erases ahead of itself. */
  function drawStrip(canvas, t, { sweep = true } = {}) {
    const z = fit(canvas);
    if (!z) return;
    const { w, h, d } = z;
    const c = canvas.getContext("2d");
    const a = TRACE();
    c.clearRect(0, 0, w, h);
    if (!a.length) return;
    c.strokeStyle = pal.line;
    c.lineWidth = 1;
    c.beginPath();
    for (let s = 0; s <= 10; s++) { const x = Math.round((s / 10) * (w - 1)) + 0.5; c.moveTo(x, h - 6 * d); c.lineTo(x, h); }
    c.stroke();
    const min = -0.2, max = 0.7;
    const y = (v) => h - 8 * d - ((v - min) / (max - min)) * (h - 14 * d);
    const cursor = sweep ? Math.floor(((t % 10) / 10) * a.length) : a.length;
    const gap = Math.round(a.length * 0.035);
    const seg = (from, to, alpha) => {
      if (to <= from) return;
      c.globalAlpha = alpha;
      c.beginPath();
      for (let i = from; i < to; i++) { const x = (i / (a.length - 1)) * w; i === from ? c.moveTo(x, y(a[i])) : c.lineTo(x, y(a[i])); }
      c.stroke();
    };
    c.lineJoin = c.lineCap = "round";
    c.strokeStyle = pal.accent;
    c.lineWidth = 1.5 * d;
    seg(0, cursor, 1);
    seg(Math.min(a.length, cursor + gap), a.length, 0.28);
    c.globalAlpha = 1;
    if (sweep) {
      const x = (cursor / (a.length - 1)) * w;
      c.fillStyle = pal.signal;
      c.beginPath();
      c.arc(x, y(a[Math.min(cursor, a.length - 1)]), 2.6 * d, 0, Math.PI * 2);
      c.fill();
    }
  }

  /** Clinical ECG paper (25 mm/s look): minor 0.04 s, major 0.2 s. */
  function drawPaper(c, w, h, cols, light) {
    const minor = light ? "rgba(207,69,39,.10)" : "rgba(111,240,196,.055)";
    const major = light ? "rgba(207,69,39,.22)" : "rgba(111,240,196,.12)";
    const step = w / cols;
    for (let k = 0; k < 2; k++) {
      c.strokeStyle = k ? major : minor;
      c.lineWidth = 1;
      c.beginPath();
      const s = k ? step * 5 : step;
      for (let x = 0; x <= w + 1; x += s) { c.moveTo(Math.round(x) + 0.5, 0); c.lineTo(Math.round(x) + 0.5, h); }
      for (let yy = h; yy >= -1; yy -= s) { c.moveTo(0, Math.round(yy) + 0.5); c.lineTo(w, Math.round(yy) + 0.5); }
      c.stroke();
    }
  }

  /* ------------------------------------------------------------ segmented thumb (Motion owns x/width) */
  function placeThumb(seg, instant) {
    const thumb = $(".segmented-thumb", seg);
    const btn = $('button[aria-pressed="true"]', seg);
    if (!thumb || !btn) return;
    seg.classList.add("has-thumb");
    const x = btn.offsetLeft - 4, width = btn.offsetWidth;
    if (instant || reduced.matches || !M()?.animate) {
      thumb.style.transform = `translateX(${x}px)`;
      thumb.style.width = `${width}px`;
    } else M().animate(thumb, { x, width }, { type: "spring", stiffness: 420, damping: 36 });
  }
  function thumbify(seg) {
    if (!$(".segmented-thumb", seg)) return;
    placeThumb(seg, true);
    new ResizeObserver(() => placeThumb(seg, true)).observe(seg);
  }

  /* ============================================================ SPECIMEN 01 */
  const spec = { ctrl: null, mode: "anatomy", paused: false, tempo: 1, bpm: null, t: 0, stripScene: null, live: false };
  function initSpecimen() {
    const fig = $("#specimen");
    if (!fig) return;
    const stage = $("#specimen-stage", fig);
    const strip = $(".ecg-strip-canvas", fig);
    const status = $(".specimen-status", fig);
    const seg = $(".segmented", fig);
    const pauseBtn = $('[data-specimen="pause"]', fig);
    const resetBtn = $('[data-specimen="reset"]', fig);
    const readAz = $('[data-readout="az"]', fig);
    const readMode = $('[data-readout="mode"]', fig);
    const bpmEl = $("[data-bpm]", fig);
    thumbify(seg);

    const setLegend = () => { $("[data-legend]", fig).textContent = C().legends[spec.mode]; };
    const setBpm = () => { bpmEl.textContent = spec.bpm ? C().tempo(spec.bpm) : C().bpm(nativeBpm()); };
    const setMode = (m) => {
      spec.mode = m;
      fig.dataset.mode = m;
      $$("button[data-mode]", seg).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
      placeThumb(seg);
      setLegend();
      readMode.textContent = { anatomy: "A·01", signal: "S·02", recon: "R·03" }[m];
      spec.ctrl?.setMode(m);
      if (!spec.live) {
        // static fallback: the same three states, rendered offline from the scene
        const poster = $(".specimen-poster", fig);
        poster.src = { anatomy: "assets/img/heart-poster.webp", signal: "assets/img/heart-signal.webp", recon: "assets/img/heart-recon.webp" }[m];
      }
      animate($("[data-legend]", fig), { opacity: [0, 1], x: [-6, 0] }, { duration: 0.4 });
    };
    seg.addEventListener("click", (e) => { const b = e.target.closest("button[data-mode]"); if (b) setMode(b.dataset.mode); });
    seg.addEventListener("keydown", (e) => {
      const btns = $$("button[data-mode]", seg);
      const i = btns.indexOf(document.activeElement);
      if (i < 0 || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
      n.focus();
      setMode(n.dataset.mode);
    });
    const syncPause = () => {
      pauseBtn.setAttribute("aria-pressed", String(spec.paused));
      pauseBtn.setAttribute("aria-label", spec.paused ? C().resumeAria : C().pauseAria);
      if (spec.stripScene) spec.stripScene.paused = spec.paused;
      if (!spec.paused) wake();
    };
    pauseBtn.addEventListener("click", () => {
      spec.paused = !spec.paused;
      spec.ctrl?.setPaused(spec.paused);
      syncPause();
    });
    resetBtn.addEventListener("click", () => {
      spec.bpm = null;
      spec.tempo = 1;
      setBpm();
      if (spec.ctrl) spec.ctrl.reset();
      animate(resetBtn.querySelector("svg"), { rotate: [0, -360] }, { duration: 0.6 });
    });

    // ECG strip owned by the fallback scheduler until the 3D loop takes over.
    let last = performance.now() / 1000;
    spec.stripScene = scene(strip, (now) => {
      const dt = Math.min(0.1, now - last);
      last = now;
      if (!spec.paused && !reduced.matches) spec.t = (spec.t + dt * spec.tempo) % 10;
      drawStrip(strip, spec.t, { sweep: !reduced.matches });
    });

    // Static fallback tap-tempo (the 3D module has its own detector once live).
    const taps = [];
    stage.addEventListener("pointerup", (e) => {
      if (spec.live) return;
      taps.push(e.timeStamp);
      if (taps.length > 5) taps.shift();
      if (taps.length < 4) return;
      const iv = taps.slice(1).map((t, i) => t - taps[i]).slice(-3);
      const mean = iv.reduce((a, b) => a + b, 0) / iv.length;
      const sd = Math.sqrt(iv.reduce((a, b) => a + (b - mean) ** 2, 0) / iv.length);
      if (mean > 300 && mean < 1500 && sd / mean < 0.22) {
        taps.length = 0;
        onTempo(Math.round(60000 / mean));
      }
    });
    function onTempo(bpm) {
      spec.bpm = bpm;
      spec.tempo = bpm ? bpm / nativeBpm() : 1;
      setBpm();
      if (bpm) {
        toast(C().tempoToast(bpm));
        discover("pulse");
      }
    }

    stage.addEventListener("pointerdown", () => fig.classList.add("was-dragged"), { once: true });
    setLegend();
    setBpm();
    document.addEventListener("portfolio:render", () => {
      setLegend();
      setBpm();
      syncPause();
      if (fig.classList.contains("is-static")) status.textContent = C().specFallback;
      requestAnimationFrame(() => placeThumb(seg, true));
    });
    document.addEventListener("portfolio:theme", (e) => {
      readPalette();
      spec.ctrl?.setTheme(e.detail.theme);
      drawStrip(strip, spec.t, { sweep: !reduced.matches });
    });

    // ---- lazy 3D
    const canWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        const ok = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
        c.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
        return ok;
      } catch { return false; }
    })();
    const saveData = navigator.connection?.saveData === true;
    const goStatic = (msg) => {
      fig.classList.remove("is-loading");
      fig.classList.add("is-static");
      status.textContent = msg || C().specFallback;
    };
    if (!canWebGL || saveData) { goStatic(); return; }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      fig.classList.add("is-loading");
      status.textContent = `${C().specLoading} · 0%`;
      import("./assets/js/hero3d.js")
        .then(({ mountHeart }) => {
          spec.ctrl = mountHeart(stage, {
            canvas: $(".specimen-canvas", fig),
            modelUrl: "assets/models/heart.glb",
            trace: TRACE(),
            reducedMotion: reduced.matches,
            theme: document.documentElement.dataset.theme,
            onProgress: (p) => { status.textContent = `${C().specLoading} · ${Math.round(p * 100)}%`; },
            onReady: () => {
              spec.live = true;
              spec.stripScene?.dispose();
              spec.stripScene = null;
              fig.classList.remove("is-loading");
              fig.classList.add("is-live");
              status.textContent = "";
              spec.ctrl.setMode(spec.mode);
              if (spec.paused) spec.ctrl.setPaused(true);
              drawStrip(strip, spec.t, { sweep: !reduced.matches });
            },
            onError: (err) => {
              console.warn("[specimen] 3D unavailable:", err?.message || err);
              spec.live = false;
              fig.classList.remove("is-live");
              if (!spec.stripScene) spec.stripScene = scene(strip, (now) => drawStrip(strip, now % 10, { sweep: !reduced.matches }));
              goStatic();
            },
            onFrame: (f) => {
              spec.t = f.ecgTime;
              drawStrip(strip, f.ecgTime, { sweep: !reduced.matches });
              const now = performance.now();
              if (now - (onFrameT || 0) > 180) {
                onFrameT = now;
                const deg = ((((f.yaw * 180) / Math.PI + 18) % 360) + 360) % 360;
                readAz.textContent = `AZ ${String(Math.round(deg)).padStart(3, "0")}°`;
              }
            },
            onTempo: (bpm) => onTempo(bpm),
          });
        })
        .catch((err) => {
          console.warn("[specimen] module failed:", err);
          goStatic();
        });
    };
    let onFrameT = 0;
    const io = new IntersectionObserver((en) => {
      if (en.some((e) => e.isIntersecting)) {
        io.disconnect();
        const go = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 200));
        if (document.readyState === "complete") go();
        else addEventListener("load", go, { once: true });
      }
    }, { rootMargin: "200px" });
    io.observe(stage);
  }

  /* ============================================================ CASE DEMOS */
  let demoCleanup = [];
  function steps(root, labels, onSelect) {
    const wrap = $(".steps", root);
    wrap.innerHTML = labels.map((l, i) => `<button type="button" aria-pressed="${i === 0}" data-step="${i}"><span class="mono">0${i + 1}</span><span>${l}</span></button>`).join("");
    const select = (i, focus) => {
      $$("button", wrap).forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
      if (focus) $$("button", wrap)[i].focus();
      onSelect(i);
    };
    wrap.addEventListener("click", (e) => { const b = e.target.closest("[data-step]"); if (b) select(+b.dataset.step); });
    wrap.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const cur = $$("button", wrap).findIndex((b) => b.getAttribute("aria-pressed") === "true");
      e.preventDefault();
      select((cur + (e.key === "ArrowRight" ? 1 : labels.length - 1)) % labels.length, true);
    });
    select(0);
  }

  /* ---- CardioCloud: signal room */
  function mountCardioCloud(host) {
    const card = host.closest(".case");
    host.innerHTML = `
      <div class="demo-chrome mono"><span class="live"><span class="live-dot" aria-hidden="true"></span>SIGNAL EXPLORER</span><span>PTB-XL · 00009 · II</span></div>
      <div class="demo-stage">
        <canvas class="cc-canvas" role="img" aria-label="${tr("ECG público PTB-XL 00009, derivación II, 10 segundos", "Public PTB-XL 00009 ECG, lead II, 10 seconds")}"></canvas>
        <div class="cc-overlay cc-model" aria-hidden="true"><div class="cc-model-card">
          <div class="cc-head"><strong>0.918</strong><span class="mono">Macro AUROC · test n = ${tr("2.158", "2,158")}</span></div>
          ${[["NORM", 0.937], ["STTC", 0.929], ["CD", 0.917], ["HYP", 0.904], ["MI", 0.902]].map(([k, v]) => `<div class="cc-row"><span class="mono">${k}</span><span class="cc-bar"><i style="width:${((v - 0.8) / 0.2) * 100}%"></i></span><b>${v.toFixed(3)}</b></div>`).join("")}
          <p class="cc-source mono">${tr("Eje 0,80–1,00 · informe de evaluación original", "Axis 0.80–1.00 · original evaluation report")}</p>
        </div></div>
        <div class="cc-overlay cc-review" aria-hidden="true"><div class="cc-review-card"><ol class="cc-flow">
          <li class="is-ok"><span class="dot">1</span><span><b>SageMaker CPU</b> · ${tr("inferencia real en AWS", "real inference on AWS")}</span></li>
          <li class="is-warn"><span class="dot">2</span><span><b>Bedrock</b> · ${tr("salida rechazada por la validación", "output rejected by validation")}</span></li>
          <li class="is-ok"><span class="dot">3</span><span><b>${tr("Fallback determinista", "Deterministic fallback")}</b> · ${tr("etiquetado", "labelled")}</span></li>
          <li class="is-ok"><span class="dot">4</span><span><b>${tr("Revisión humana", "Human review")}</b> · needs_review → DynamoDB</span></li>
        </ol></div></div>
      </div>
      <div class="steps" role="group" aria-label="${tr("Recorrido del caso", "Case walkthrough")}"></div>
      <p class="step-note" aria-live="polite"></p>
      <div class="demo-foot">
        <div class="segmented compact gain" role="group" aria-label="${tr("Ganancia", "Gain")}"><button type="button" data-gain="1" aria-pressed="true">×1</button><button type="button" data-gain="2" aria-pressed="false">×2</button></div>
        <button type="button" class="icon-btn" data-cc-pause aria-pressed="false" aria-label="${tr("Pausar barrido", "Pause sweep")}"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
        <span class="demo-note mono">${tr("Señal pública · sin inferencia en esta vista", "Public signal · no inference in this view")}</span>
      </div>`;
    const canvas = $(".cc-canvas", host);
    let gain = 1, paused = false, step = 0, t0 = 0, frozen = 0;
    const notes = [
      tr("Diez segundos reales del conjunto público PTB-XL. Cuadrícula de papel ECG: 0,04 s y 0,2 s.", "Ten real seconds from the public PTB-XL dataset. ECG paper grid: 0.04 s and 0.2 s."),
      tr("El modelo documentado obtuvo 0.918 de Macro AUROC en test independiente. Esta vista no ejecuta inferencia.", "The documented model reached 0.918 Macro AUROC on the held-out test. This view runs no inference."),
      tr("En AWS, la salida de Bedrock no pasó la validación: se mostró el fallback etiquetado y la revisión humana quedó registrada.", "On AWS, Bedrock's output failed validation: the labelled fallback was shown and human review was recorded."),
    ];
    const draw = (now) => {
      const z = fit(canvas);
      if (!z) return;
      const { w, h, d } = z;
      const c = canvas.getContext("2d");
      c.clearRect(0, 0, w, h);
      const a = TRACE();
      drawPaper(c, w, h, 250, pal.light);
      if (!a.length) return;
      const t = paused || reduced.matches ? frozen : now;
      const cursor = reduced.matches ? a.length : Math.floor((((t - t0) * 0.1) % 1) * a.length);
      const y = (v) => h * 0.6 - v * h * 0.34 * gain;
      c.lineJoin = c.lineCap = "round";
      c.strokeStyle = pal.light ? "#1d2a28" : "#a6ffe0";
      c.lineWidth = 1.6 * d;
      c.globalAlpha = step === 0 ? 1 : 0.35;
      c.beginPath();
      for (let i = 0; i < a.length; i++) { const x = (i / (a.length - 1)) * w; i ? c.lineTo(x, y(a[i])) : c.moveTo(x, y(a[i])); }
      c.stroke();
      if (step === 0 && !reduced.matches) {
        const x = (cursor / (a.length - 1)) * w;
        const g = c.createLinearGradient(x - 80 * d, 0, x, 0);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, pal.light ? "rgba(207,69,39,.10)" : "rgba(111,240,196,.12)");
        c.fillStyle = g;
        c.fillRect(x - 80 * d, 0, 80 * d, h);
        c.fillStyle = pal.signal;
        c.fillRect(x, 0, 1.5 * d, h);
      }
      c.globalAlpha = 1;
      c.fillStyle = pal.light ? "rgba(29,42,40,.7)" : "rgba(166,255,224,.7)";
      c.font = `${10 * d}px ${getComputedStyle(document.body).getPropertyValue("--font-mono") || "monospace"}`;
      c.fillText(`II · ×${gain} · 10 s`, 12 * d, 18 * d);
    };
    const s = scene(canvas, draw);
    demoCleanup.push(() => s.dispose());
    steps(host, C().demoSteps.cardiocloud, (i) => {
      step = i;
      card.dataset.step = String(i);
      $(".step-note", host).textContent = notes[i];
      s.animated = i === 0;
      draw(performance.now() / 1000);
      wake();
      if (i === 1) animate($$(".cc-bar i", host), { scaleX: [0, 1] }, { duration: 0.8, delay: M()?.stagger ? M().stagger(0.06) : 0 });
      if (i === 2) animate($$(".cc-flow li", host), { opacity: [0, 1], x: [-8, 0] }, { duration: 0.4, delay: M()?.stagger ? M().stagger(0.09) : 0 });
    });
    const gainSeg = $(".gain", host);
    gainSeg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-gain]");
      if (!b) return;
      gain = +b.dataset.gain;
      $$("[data-gain]", gainSeg).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw(performance.now() / 1000);
    });
    $("[data-cc-pause]", host).addEventListener("click", (e) => {
      paused = !paused;
      frozen = performance.now() / 1000;
      s.paused = paused;
      const b = e.currentTarget;
      b.setAttribute("aria-pressed", String(paused));
      b.setAttribute("aria-label", paused ? tr("Reanudar barrido", "Resume sweep") : tr("Pausar barrido", "Pause sweep"));
      draw(frozen);
      wake();
    });
  }

  /* ---- ECOCARDIA: imaging room (illustrative, no patient data) */
  let speckle;
  function speckleTex() {
    if (speckle) return speckle;
    speckle = document.createElement("canvas");
    speckle.width = 320;
    speckle.height = 240;
    const c = speckle.getContext("2d");
    const im = c.createImageData(320, 240);
    let r = 7;
    for (let i = 0; i < im.data.length; i += 4) {
      r = (r * 16807) % 2147483647;
      const v = (r % 1000) / 1000;
      const g = Math.pow(v, 2.4) * 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = g;
      im.data[i + 3] = 255;
    }
    c.putImageData(im, 0, 0);
    c.globalCompositeOperation = "source-over";
    c.filter = "blur(0.6px)";
    c.drawImage(speckle, 0, 0);
    return speckle;
  }
  function mountEcocardia(host) {
    const card = host.closest(".case");
    host.innerHTML = `
      <div class="demo-chrome mono"><span class="live"><span class="live-dot" aria-hidden="true"></span>LOCAL INTELLIGENCE</span><span>ON-PREMISE · LAN</span></div>
      <div class="demo-stage">
        <canvas class="eco-canvas" role="img" aria-label="${tr("Ecocardiograma apical de cuatro cámaras ilustrativo con capas de procesamiento", "Illustrative apical four-chamber echocardiogram with processing layers")}"></canvas>
        <div class="eco-hud" aria-hidden="true"><span class="mono">DICOM · A4C</span><span class="mono" data-eco-tag>${tr("ILUSTRATIVO", "ILLUSTRATIVE")}</span></div>
        <div class="eco-review" aria-hidden="true">
          <span class="mono">${tr("REVISIÓN PROFESIONAL", "PROFESSIONAL REVIEW")}</span>
          <strong>${tr("Decisión trazable", "Traceable decision")}</strong>
          <span class="verdict"><i></i>DERIVAR · NO DERIVAR</span>
          <span class="mono">MODEL_FROZEN · SHA ✓</span>
        </div>
      </div>
      <div class="steps" role="group" aria-label="${tr("Recorrido de la plataforma", "Platform walkthrough")}"></div>
      <p class="step-note" aria-live="polite"></p>
      <ol class="pipeline" aria-label="${tr("Flujo", "Pipeline")}"><li>DICOM / Orthanc</li><li>${tr("Vista", "View")}</li><li>${tr("Modelos", "Models")}</li><li>${tr("Decisión", "Decision")}</li><li>RAG ${tr("local", "local")}</li></ol>
      <p class="demo-note mono">${tr("Visualización ilustrativa · sin datos de pacientes · el cálculo real ocurre en la red del hospital", "Illustrative visual · no patient data · real computation stays on the hospital network")}</p>`;
    const canvas = $(".eco-canvas", host);
    let step = 0;
    const notes = [
      tr("La imagen llega por DICOM y Orthanc dentro de la red hospitalaria. Nada sale del centro.", "Images arrive through DICOM and Orthanc inside the hospital network. Nothing leaves the site."),
      tr("Se clasifica la vista y modelos calibrados (YOLO, 3D CNN, TimeSformer) segmentan y miden en milímetros.", "The view is classified; calibrated models (YOLO, 3D CNN, TimeSformer) segment and measure in millimetres."),
      tr("El resultado llega con contexto y trazabilidad (runtime congelado por hash). Decide un profesional.", "Results arrive with context and traceability (hash-frozen runtime). A professional decides."),
    ];
    const pipeOn = [[0, 1], [1, 2], [3, 4]];
    const draw = (now) => {
      const z = fit(canvas);
      if (!z) return;
      const { w, h, d } = z;
      const c = canvas.getContext("2d");
      const t = reduced.matches ? 0.6 : now;
      c.fillStyle = "#030807";
      c.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h * 0.06, R = h * 0.9;
      const a0 = Math.PI * 0.5 - 0.62, a1 = Math.PI * 0.5 + 0.62;
      c.save();
      c.beginPath();
      c.moveTo(ox, oy);
      c.arc(ox, oy, R, a0, a1);
      c.closePath();
      c.clip();
      c.globalAlpha = 0.5;
      c.drawImage(speckleTex(), 0, (Math.sin(t * 0.8) * 3 - 6) * d, w, h + 12 * d);
      c.globalAlpha = 1;
      // tissue bands
      const grad = c.createRadialGradient(ox, oy, R * 0.1, ox, oy, R);
      grad.addColorStop(0, "rgba(0,0,0,.55)");
      grad.addColorStop(0.35, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,.6)");
      c.fillStyle = grad;
      c.fillRect(0, 0, w, h);
      const beat = 0.5 + 0.5 * Math.sin(t * 2.4);
      const sc = R / 300;
      const chambers = [
        // x, y, rx, ry, rot  (LV, RV top; LA, RA bottom in A4C, apex up)
        [22, 118, 34, 58, -0.12, 1], [-30, 124, 28, 48, 0.16, 1], [22, 214, 28, 30, 0, 0], [-30, 212, 26, 30, 0, 0],
      ];
      const pts = chambers.map(([x, y, rx, ry, rot, v]) => {
        const k = v ? 1 - beat * 0.12 : 1 - (1 - beat) * 0.1;
        return { x: ox + x * sc, y: oy + y * sc, rx: rx * sc * k, ry: ry * sc * (v ? 1 - beat * 0.06 : k), rot };
      });
      // bright walls (myocardium echo) then dark blood pools
      c.fillStyle = "rgba(190,205,198,.18)";
      pts.forEach((p) => { c.beginPath(); c.ellipse(p.x, p.y, p.rx * 1.45, p.ry * 1.25, p.rot, 0, Math.PI * 2); c.fill(); });
      pts.forEach((p) => {
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(p.rx, p.ry));
        g.addColorStop(0, "rgba(2,6,6,.98)");
        g.addColorStop(0.8, "rgba(4,10,10,.92)");
        g.addColorStop(1, "rgba(4,10,10,0)");
        c.fillStyle = g;
        c.beginPath();
        c.ellipse(p.x, p.y, p.rx, p.ry, p.rot, 0, Math.PI * 2);
        c.fill();
      });
      // septum + valves
      c.strokeStyle = "rgba(220,232,226,.55)";
      c.lineWidth = 3 * d;
      c.beginPath();
      c.moveTo(ox - 4 * sc, oy + 60 * sc);
      c.quadraticCurveTo(ox - 2 * sc, oy + 150 * sc, ox - 4 * sc, oy + 240 * sc);
      c.stroke();
      c.lineWidth = 2 * d;
      const open = beat * 10 * sc;
      [[22, 172], [-30, 172]].forEach(([x, y]) => {
        c.beginPath();
        c.moveTo(ox + (x - 22) * sc, oy + y * sc);
        c.lineTo(ox + (x - 4) * sc, oy + y * sc + open);
        c.moveTo(ox + (x + 22) * sc, oy + y * sc);
        c.lineTo(ox + (x + 4) * sc, oy + y * sc + open);
        c.stroke();
      });
      c.restore();
      // sector outline + depth ticks
      c.strokeStyle = "rgba(168,201,189,.35)";
      c.lineWidth = 1 * d;
      c.beginPath();
      c.moveTo(ox, oy);
      c.arc(ox, oy, R, a0, a1);
      c.closePath();
      c.stroke();
      for (let k = 1; k < 6; k++) {
        const r = (R / 6) * k;
        c.beginPath();
        c.moveTo(ox + Math.cos(a0) * r, oy + Math.sin(a0) * r);
        c.lineTo(ox + Math.cos(a0) * r - 6 * d, oy + Math.sin(a0) * r);
        c.stroke();
      }
      // processing overlays
      if (step >= 1) {
        const lv = pts[0];
        c.strokeStyle = "#6ff0c4";
        c.lineWidth = 1.8 * d;
        c.setLineDash([]);
        c.beginPath();
        c.ellipse(lv.x, lv.y, lv.rx * 1.02, lv.ry * 1.02, lv.rot, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = "rgba(111,240,196,.12)";
        c.fill();
        // ROI box
        c.setLineDash([5 * d, 4 * d]);
        c.strokeStyle = "rgba(255,138,106,.9)";
        c.strokeRect(ox - 70 * sc, oy + 40 * sc, 140 * sc, 220 * sc);
        c.setLineDash([]);
        // caliper across septum
        const yC = oy + 120 * sc;
        c.strokeStyle = "#fff1d6";
        c.lineWidth = 1.4 * d;
        c.beginPath();
        c.moveTo(ox - 14 * sc, yC);
        c.lineTo(ox + 8 * sc, yC);
        c.moveTo(ox - 14 * sc, yC - 5 * d);
        c.lineTo(ox - 14 * sc, yC + 5 * d);
        c.moveTo(ox + 8 * sc, yC - 5 * d);
        c.lineTo(ox + 8 * sc, yC + 5 * d);
        c.stroke();
        c.font = `${10 * d}px monospace`;
        c.fillStyle = "#fff1d6";
        c.fillText(tr("HVI · mm", "LVH · mm"), ox + 14 * sc, yC + 4 * d);
        c.fillStyle = "rgba(255,138,106,.95)";
        c.fillText("ROI", ox - 68 * sc, oy + 36 * sc);
        c.fillStyle = "#6ff0c4";
        c.fillText(tr("VI", "LV"), lv.x - 6 * d, lv.y + 4 * d);
      }
      // ECG gating line at the bottom (real public trace, for timing context)
      const a = TRACE();
      if (a.length) {
        c.strokeStyle = "rgba(111,240,196,.65)";
        c.lineWidth = 1.2 * d;
        c.beginPath();
        const n = 300, off = Math.floor(((t * 30) % (a.length - n)));
        for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * w; const yy = h - 14 * d - a[off + i] * 22 * d; i ? c.lineTo(x, yy) : c.moveTo(x, yy); }
        c.stroke();
      }
    };
    const s = scene(canvas, draw);
    demoCleanup.push(() => s.dispose());
    steps(host, C().demoSteps.ecocardia, (i) => {
      step = i;
      card.dataset.step = String(i);
      $(".step-note", host).textContent = notes[i];
      $$(".pipeline li", host).forEach((li, j) => li.classList.toggle("is-on", pipeOn[i].includes(j)));
      draw(performance.now() / 1000);
    });
  }

  /* ---- Convity: code ↔ graph */
  function mountConvity(host) {
    host.innerHTML = `
      <div class="demo-chrome mono"><span class="live"><span class="live-dot" aria-hidden="true"></span>CODE, MADE VISIBLE</span><span>STATIC · LOCAL</span></div>
      <div class="cv-split">
        <div class="cv-code"><div class="cv-file mono"><span>formatName.js</span><span data-cv-ver></span></div><div class="cv-lines" role="list"></div></div>
        <div class="cv-graph"><svg viewBox="0 0 260 270" role="img" aria-label="${tr("Grafo de flujo de control", "Control-flow graph")}"></svg></div>
      </div>
      <div class="demo-foot">
        <div class="segmented compact" role="group" aria-label="${tr("Versión del código", "Code version")}"><button type="button" data-ver="before" aria-pressed="true">${tr("Antes", "Before")}</button><button type="button" data-ver="after" aria-pressed="false">${tr("Después", "After")}</button></div>
        <p class="cv-legend mono"><span><i class="k-new"></i>${tr("Nuevo", "New")}</span><span><i class="k-link"></i>${tr("Vinculado", "Linked")}</span></p>
      </div>
      <p class="step-note" aria-live="polite"></p>
      <p class="demo-note mono">${tr("Ejemplo ilustrativo · el código se analiza, no se ejecuta", "Illustrative example · code is analysed, never executed")}</p>`;
    const V = {
      before: {
        lines: [["function formatName(name) {", "start"], ["  return name.trim();", "trim"], ["}", "end"]],
        nodes: [["start", 80, 18, 100, "start"], ["trim", 70, 112, 120, "name.trim()"], ["end", 95, 206, 70, "end"]],
        edges: [["M130 46V112", ""], ["M130 140V206", ""]],
        labels: [],
        note: tr("Una función, una ruta. Toca una línea o un nodo para ver su relación.", "One function, one path. Tap a line or a node to see how they relate."),
      },
      after: {
        lines: [["function formatName(name) {", "start"], ['  if (!name) return "Guest";', "check", true], ["  return name.trim();", "trim"], ["}", "end"]],
        nodes: [["start", 80, 4, 100, "start"], ["check", 75, 70, 110, "!name ?", true], ["guest", 8, 146, 104, '"Guest"', true], ["trim", 148, 146, 104, "name.trim()"], ["end", 95, 228, 70, "end"]],
        edges: [["M130 32V70", ""], ["M130 98V118H60V146", "new"], ["M130 98V118H200V146", ""], ["M60 174V200H130V228", "new"], ["M200 174V200H130V228", ""]],
        labels: [[72, 114, tr("SÍ", "YES")], [188, 114, "NO"]],
        note: tr("Un control nuevo y dos rutas visibles: el cambio se entiende en el grafo, no entre líneas.", "One new check, two visible paths: the change reads in the graph, not between lines."),
      },
    };
    const lineMap = { check: ["check", "guest"] };
    const render = (ver) => {
      const v = V[ver];
      $("[data-cv-ver]", host).textContent = ver === "after" ? "+1 / −0" : "HEAD~1";
      $(".cv-lines", host).innerHTML = v.lines.map(([txt, node, isNew]) => `<button type="button" role="listitem" class="cv-line${isNew ? " is-added" : ""}" data-node="${node}">${txt.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</button>`).join("");
      const svg = $(".cv-graph svg", host);
      svg.innerHTML =
        v.edges.map(([dd, cls]) => `<path class="cfg-edge ${cls === "new" ? "is-new" : ""}" d="${dd}"/>`).join("") +
        v.labels.map(([x, y, tx]) => `<text class="cfg-label" x="${x}" y="${y}">${tx}</text>`).join("") +
        v.nodes.map(([id, x, y, w, label, isNew]) => `<g class="cfg-node${isNew ? " is-new" : ""}" data-node="${id}" tabindex="0" role="button" aria-label="${label}"><rect x="${x}" y="${y}" width="${w}" height="28" rx="8"/><text x="${x + w / 2}" y="${y + 15}">${label.replace(/"/g, "&quot;")}</text></g>`).join("");
      $(".step-note", host).textContent = v.note;
      animate(svg, { opacity: [0.2, 1], y: [8, 0] }, { duration: 0.5 });
      animate($$(".cv-line.is-added", host), { backgroundColor: ["rgba(11,122,91,.35)", "rgba(11,122,91,.1)"] }, { duration: 1.1 });
    };
    const link = (node) => {
      const nodes = lineMap[node] || [node];
      $$(".cv-line", host).forEach((l) => l.classList.toggle("is-linked", nodes.includes(l.dataset.node) || (node === "guest" && l.dataset.node === "check")));
      $$(".cfg-node", host).forEach((g) => g.classList.toggle("is-linked", nodes.includes(g.dataset.node)));
    };
    const clear = () => { $$(".is-linked", host).forEach((x) => x.classList.remove("is-linked")); };
    host.addEventListener("pointerover", (e) => { const t = e.target.closest("[data-node]"); if (t && e.pointerType === "mouse") link(t.dataset.node); });
    host.addEventListener("pointerout", (e) => { if (e.pointerType === "mouse" && !host.contains(e.relatedTarget?.closest?.("[data-node]"))) clear(); });
    host.addEventListener("focusin", (e) => { const t = e.target.closest("[data-node]"); if (t) link(t.dataset.node); });
    host.addEventListener("focusout", clear);
    host.addEventListener("click", (e) => {
      const t = e.target.closest("[data-node]");
      if (t) link(t.dataset.node);
      const b = e.target.closest("[data-ver]");
      if (b) {
        $$("[data-ver]", host).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        render(b.dataset.ver);
      }
    });
    host.addEventListener("keydown", (e) => {
      const g = e.target.closest(".cfg-node");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); link(g.dataset.node); }
    });
    render("before");
  }

  function mountDemos() {
    demoCleanup.forEach((f) => f());
    demoCleanup = [];
    const map = { cardiocloud: mountCardioCloud, ecocardia: mountEcocardia, convity: mountConvity };
    $$("[data-demo]").forEach((el) => map[el.dataset.demo]?.(el));
    $$(".case .segmented").forEach((s) => s.classList.add("no-thumb"));
  }

  /* ============================================================ DISCOVERIES */
  const DISCOVERIES = [
    { id: "pulse", es: ["Pulso propio", "Toca el corazón 3D cuatro veces, a ritmo."], en: ["Your own pulse", "Tap the 3D heart four times, in rhythm."] },
    { id: "vision", es: ["Visión por computador", "Toca tres veces el retrato de la sección de contacto."], en: ["Computer vision", "Tap the portrait in the contact section three times."] },
    { id: "monitor", es: ["Monitor", "Con teclado, escribe «ecg» en cualquier parte."], en: ["Monitor", "With a keyboard, type “ecg” anywhere."] },
    { id: "lab", es: ["Laboratorio", "Escribe «lab» o abre «Laboratorio» en el pie."], en: ["Lab", "Type “lab” or open “Lab” in the footer."] },
  ];
  const found = new Set((store.get("discoveries") || "").split(",").filter(Boolean));
  function discover(id) {
    if (found.has(id)) return;
    found.add(id);
    store.set("discoveries", [...found].join(","));
    renderDiscoveries();
  }
  function renderDiscoveries() {
    const box = $("#discoveries");
    if (!box) return;
    const l = lang();
    box.innerHTML = `<h3 class="mono">${C().discoveriesTitle} · ${found.size}/${DISCOVERIES.length}</h3><div class="discovery-list">${DISCOVERIES.map((d) => `<p class="discovery${found.has(d.id) ? " is-found" : ""}"><strong>${found.has(d.id) ? "✓ " : ""}${d[l][0]}</strong><span>${d[l][1]}</span></p>`).join("")}</div>`;
  }

  /* ---- Vision: Sobel edges + corner landmarks on the portrait, computed locally */
  function initVision() {
    const fig = $("#portrait");
    if (!fig) return;
    fig.tabIndex = 0;
    let clicks = [], running = false, on = false;
    const cap = $(".portrait-cv", fig);
    const trigger = async () => {
      if (running) return;
      if (on) {
        on = false;
        fig.classList.remove("is-vision");
        cap.textContent = "";
        return;
      }
      running = true;
      const img = $("img", fig);
      try { await img.decode(); } catch {}
      const W = 200, H = 250;
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const oc = off.getContext("2d", { willReadFrequently: true });
      const ir = img.naturalWidth / img.naturalHeight, tr_ = W / H;
      let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
      if (ir > tr_) { sw = sh * tr_; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / tr_; sy = (img.naturalHeight - sh) * 0.22; }
      oc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      const px = oc.getImageData(0, 0, W, H).data;
      const g = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) g[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
      const mag = new Float32Array(W * H), Ixx = new Float32Array(W * H), Iyy = new Float32Array(W * H), Ixy = new Float32Array(W * H);
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const gx = -g[i - W - 1] - 2 * g[i - 1] - g[i + W - 1] + g[i - W + 1] + 2 * g[i + 1] + g[i + W + 1];
        const gy = -g[i - W - 1] - 2 * g[i - W] - g[i - W + 1] + g[i + W - 1] + 2 * g[i + W] + g[i + W + 1];
        mag[i] = Math.hypot(gx, gy);
        Ixx[i] = gx * gx; Iyy[i] = gy * gy; Ixy[i] = gx * gy;
      }
      // Harris response on 5x5 windows, then non-maximum suppression
      const resp = [];
      for (let y = 6; y < H - 6; y += 2) for (let x = 6; x < W - 6; x += 2) {
        let a = 0, b = 0, c2 = 0;
        for (let v = -2; v <= 2; v++) for (let u = -2; u <= 2; u++) { const k = (y + v) * W + x + u; a += Ixx[k]; b += Iyy[k]; c2 += Ixy[k]; }
        const r = a * b - c2 * c2 - 0.05 * (a + b) ** 2;
        if (r > 0) resp.push([r, x, y]);
      }
      resp.sort((p, q) => q[0] - p[0]);
      const corners = [];
      for (const [, x, y] of resp) { if (corners.every(([cx, cy]) => Math.hypot(cx - x, cy - y) > 14)) corners.push([x, y]); if (corners.length >= 28) break; }
      const canvas = $(".edge-overlay", fig);
      const z = fit(canvas);
      if (!z) { running = false; return; }
      const c = canvas.getContext("2d");
      const sxk = z.w / W, syk = z.h / H;
      const maxM = Math.max(...mag) || 1;
      fig.classList.add("is-vision");
      cap.textContent = tr("Sobel + esquinas de Harris · en tu navegador", "Sobel + Harris corners · in your browser");
      discover("vision");
      on = true;
      const total = reduced.matches ? 1 : 26;
      let frame = 0;
      const step = () => {
        frame++;
        const upto = Math.floor((H * frame) / total);
        c.clearRect(0, 0, z.w, z.h);
        c.fillStyle = pal.light ? "#6ff0c4" : pal.accent;
        for (let y = 1; y < Math.min(upto, H - 1); y++) for (let x = 1; x < W - 1; x++) {
          const m = mag[y * W + x] / maxM;
          if (m > 0.16) { c.globalAlpha = Math.min(1, m * 1.8); c.fillRect(x * sxk, y * syk, sxk, syk); }
        }
        c.globalAlpha = 1;
        c.strokeStyle = "#ff8a6a";
        c.lineWidth = 1.2 * z.d;
        corners.filter(([, y]) => y < upto).forEach(([x, y]) => {
          const X = x * sxk, Y = y * syk, r = 4 * z.d;
          c.beginPath(); c.moveTo(X - r, Y); c.lineTo(X + r, Y); c.moveTo(X, Y - r); c.lineTo(X, Y + r); c.stroke();
        });
        if (upto < H) {
          c.fillStyle = "rgba(255,138,106,.8)";
          c.fillRect(0, upto * syk, z.w, 1.5 * z.d);
          requestAnimationFrame(step);
        } else running = false;
      };
      step();
    };
    const hit = (ts) => {
      clicks = clicks.filter((t) => ts - t < 900);
      clicks.push(ts);
      if (clicks.length >= 3) { clicks = []; trigger(); }
    };
    fig.addEventListener("click", (e) => hit(e.timeStamp));
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(e.timeStamp); } });
  }

  /* ---- Monitor: type "ecg" to turn the progress bar into a live ECG */
  let monitor = null;
  function toggleMonitor() {
    const root = document.documentElement;
    if (monitor) {
      monitor.dispose();
      monitor.canvas.remove();
      monitor = null;
      root.classList.remove("monitor-mode");
      return;
    }
    root.classList.add("monitor-mode");
    const canvas = document.createElement("canvas");
    canvas.className = "monitor-canvas";
    canvas.setAttribute("aria-hidden", "true");
    $(".reading-progress").append(canvas);
    const s = scene(canvas, (now) => {
      const z = fit(canvas);
      if (!z) return;
      const c = canvas.getContext("2d");
      const a = TRACE();
      c.clearRect(0, 0, z.w, z.h);
      if (!a.length) return;
      const n = 400, off = Math.floor((now * 100) % (a.length - 1));
      c.strokeStyle = pal.signal;
      c.lineWidth = 1.3 * z.d;
      c.beginPath();
      for (let i = 0; i < n; i++) { const v = a[(off + i) % a.length]; const x = (i / (n - 1)) * z.w; const y = z.h * 0.72 - v * z.h * 0.9; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
    });
    monitor = { canvas, dispose: () => s.dispose() };
    discover("monitor");
    toast(tr("Modo monitor: el ECG público late bajo la cabecera. Escribe «ecg» para quitarlo.", "Monitor mode: the public ECG now beats under the header. Type “ecg” to remove it."));
  }

  /* ============================================================ PLAYGROUND */
  function initPlayground() {
    const dlg = $("#playground");
    const canvas = $("#playground-canvas");
    let mode = "orbit", ripples = [], pointer = { x: 0.5, y: 0.5 };
    const open = () => {
      if (!dlg.open) {
        dlg.showModal();
        document.documentElement.classList.add("has-dialog");
        animate(dlg, { opacity: [0, 1], scale: [0.97, 1] }, { duration: 0.35 });
      }
      discover("lab");
      renderDiscoveries();
      play.visible = true;
      play.draw(performance.now() / 1000);
      wake();
      setTimeout(() => placeThumb($(".segmented", dlg), true), 0);
    };
    document.addEventListener("click", (e) => { if (e.target.closest("[data-open-playground]")) open(); });
    dlg.addEventListener("close", () => { play.visible = false; ripples = []; });
    const draw = (time) => {
      if (!dlg.open) return;
      const z = fit(canvas, 1.75);
      if (!z) return;
      const { w, h, d } = z;
      const c = canvas.getContext("2d");
      c.clearRect(0, 0, w, h);
      const tt = reduced.matches ? 0 : time;
      ripples = ripples.filter((p) => tt - p.t < 3);
      const N = 720, S = Math.min(w, h);
      const pts = [];
      for (let i = 0; i < N; i++) {
        const seed = i * 2.39996, r = Math.sqrt(i / N);
        let x, y, hot = 0;
        if (mode === "heart") {
          const beat = 1 + 0.05 * Math.pow(Math.max(0, Math.sin(tt * 6.4)), 6);
          x = w / 2 + Math.pow(Math.sin(seed), 3) * r * S * 0.36 * beat;
          y = h / 2 - ((13 * Math.cos(seed) - 5 * Math.cos(2 * seed) - 2 * Math.cos(3 * seed) - Math.cos(4 * seed)) / 17) * r * S * 0.36 * beat;
        } else if (mode === "wave") {
          const a = TRACE();
          const k = (i / N) * a.length;
          x = (i / N) * w;
          y = h * 0.6 - (a.length ? a[Math.floor((k + tt * 100) % a.length)] : 0) * h * 0.5 + Math.sin(i * 1.7) * 3 * d;
        } else if (mode === "scan") {
          // stacked contour slices of an ellipsoid, rotating; scan band sweeps vertically
          const slices = 16, per = N / slices;
          const si = Math.floor(i / per), u = ((i % per) / per) * Math.PI * 2;
          const v = si / (slices - 1) - 0.5;
          const rad = Math.sqrt(Math.max(0, 1 - (v * 2) ** 2)) * (1 - v * 0.35);
          const a = tt * 0.4;
          const X = Math.cos(u) * rad, Z = Math.sin(u) * rad * 0.8;
          const xr = X * Math.cos(a) - Z * Math.sin(a), zr = X * Math.sin(a) + Z * Math.cos(a);
          const pz = 3 / (3 + zr);
          x = w / 2 + xr * S * 0.3 * pz;
          y = h / 2 + v * S * 0.62 + zr * S * 0.06;
          const band = (Math.sin(tt * 0.8) * 0.5) * 1.0;
          hot = Math.exp(-(((v - band) * 9) ** 2));
        } else if (mode === "pose") {
          const kick = reduced.matches ? 0.4 : 0.5 + 0.5 * Math.sin(tt * 1.6);
          const J = [[0, -1.05], [0, -0.75], [-0.3, -0.62], [0.3, -0.62], [-0.48, -0.25], [0.5, -0.3], [-0.6, 0.08], [0.64, 0.02], [0, 0.05], [-0.18, 0.1], [0.18, 0.1], [-0.24, 0.58], [0.28 + kick * 0.36, 0.48 - kick * 0.2], [-0.28, 1.04], [0.3 + kick * 0.7, 0.92 - kick * 0.7]];
          const E = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [1, 8], [8, 9], [8, 10], [9, 11], [10, 12], [11, 13], [12, 14]];
          const e = E[i % E.length], f = (Math.floor(i / E.length) / (N / E.length));
          const look = (pointer.x - 0.5) * 0.3;
          const P = (j) => [J[j][0] + (j === 0 ? look : 0), J[j][1]];
          const [ax, ay] = P(e[0]), [bx, by] = P(e[1]);
          x = w / 2 + (ax + (bx - ax) * f) * S * 0.3;
          y = h * 0.5 + (ay + (by - ay) * f) * S * 0.3;
          hot = e[1] >= 12 ? 1 : 0;
        } else {
          x = w / 2 + Math.cos(seed + tt * 0.06) * r * w * 0.44;
          y = h / 2 + Math.sin(seed + tt * 0.06) * r * h * 0.42;
        }
        for (const p of ripples) {
          const dx = x - p.x, dy = y - p.y, dist = Math.hypot(dx, dy), wave = (tt - p.t) * 220 * d;
          if (Math.abs(dist - wave) < 70 * d) {
            const push = Math.sin(((dist - wave) / (70 * d)) * Math.PI) * (1 - (tt - p.t) / 3) * 22 * d;
            x += (dx / (dist || 1)) * push;
            y += (dy / (dist || 1)) * push;
          }
        }
        pts.push([x, y, hot, i]);
      }
      for (const [x, y, hot, i] of pts) {
        c.fillStyle = hot > 0.3 ? pal.signal : i % 5 ? pal.accent : pal.ink2;
        c.globalAlpha = 0.45 + hot * 0.5 + (i % 3) * 0.12;
        c.beginPath();
        c.arc(x, y, (1.1 + (i % 3) * 0.35 + hot * 0.9) * d, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      ripples.forEach((p) => {
        c.strokeStyle = pal.accent;
        c.globalAlpha = (1 - (tt - p.t) / 3) * 0.25;
        c.beginPath();
        c.arc(p.x, p.y, (tt - p.t) * 220 * d, 0, Math.PI * 2);
        c.stroke();
      });
      c.globalAlpha = 1;
    };
    const play = { el: canvas, visible: false, paused: false, draw, dispose() {} };
    scenes.add(play);
    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      ripples.push({ x: ((e.clientX - r.left) * canvas.width) / r.width, y: ((e.clientY - r.top) * canvas.height) / r.height, t: performance.now() / 1000 });
      wake();
    });
    canvas.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; });
    canvas.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      ripples.push({ x: canvas.width / 2, y: canvas.height / 2, t: performance.now() / 1000 });
      wake();
    });
    const seg = $(".segmented", dlg);
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-universe]");
      if (!b) return;
      mode = b.dataset.universe;
      $$("[data-universe]", seg).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw(performance.now() / 1000);
      wake();
    });

    // keyboard words: "lab" opens, "ecg" toggles the monitor
    let typed = "";
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.("input, textarea, [contenteditable]")) return;
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-3);
      if (typed === "lab") { typed = ""; open(); }
      if (typed === "ecg") { typed = ""; toggleMonitor(); }
    });
    // brand mark: five taps reveal the hint
    let taps = 0, tapTimer;
    $(".brand")?.addEventListener("click", () => {
      clearTimeout(tapTimer);
      if (++taps >= 5) {
        taps = 0;
        toast(tr(`Hay ${DISCOVERIES.length} descubrimientos escondidos. Abre el laboratorio desde el pie para verlos.`, `There are ${DISCOVERIES.length} hidden discoveries. Open the lab from the footer to see them.`));
      }
      tapTimer = setTimeout(() => (taps = 0), 1400);
    });
  }

  /* ============================================================ footer signature */
  function initSignature() {
    const path = $(".footer-signature path");
    if (!path || reduced.matches || !M()?.inView) return;
    M().inView(path, () => { animate(path, { strokeDashoffset: [1, 0] }, { duration: 2.2, ease: [0.65, 0, 0.35, 1] }); });
  }

  /* ============================================================ boot */
  document.addEventListener("portfolio:render", () => {
    readPalette();
    mountDemos();
    renderDiscoveries();
  });
  document.addEventListener("portfolio:theme", () => {
    readPalette();
    scenes.forEach((s) => s.visible && s.draw(performance.now() / 1000));
  });
  document.addEventListener("DOMContentLoaded", () => {
    readPalette();
    initSpecimen();
    initPlayground();
    initVision();
    initSignature();
    try {
      console.log("%c♥ Specimen lab", "color:#6ff0c4;font:600 14px monospace", "\nType “lab” for the playground or “ecg” for monitor mode. Source: github.com/convderover");
    } catch {}
  });
})();
