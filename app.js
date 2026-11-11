/* Portfolio v4 "quiet paper" — rendering, language, theme, filters, dialogs.
 * Facts come from data.js; short first-person copy from design-data.js. */
(() => {
  "use strict";
  const DATA = window.PORTFOLIO_DATA;
  const COPY = window.PORTFOLIO_COPY;
  if (!DATA || !COPY) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = "convderover@gmail.com";
  const FEATURED = window.PORTFOLIO_FEATURED || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const state = { lang: "es", filter: "all", caseId: null };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const T = () => COPY[state.lang];
  const isEs = () => state.lang === "es";
  const L = (p, key) => p[key + (isEs() ? "Es" : "En")];
  const ui = () => DATA.ui[state.lang];
  const linkAttrs = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "");
  const year = (p) => (L(p, "year").match(/\d{4}/) || [""])[0];

  /* Motion (184 KB) is not needed for first paint: injected after `load`. */
  let motion = window.Motion;
  function loadMotion() {
    if (window.Motion || $("script[data-motion]")) return;
    const sc = document.createElement("script");
    sc.src = "assets/vendor/motion-14.12.0.js";
    sc.async = true;
    sc.dataset.motion = "";
    sc.onload = () => { motion = window.Motion; document.dispatchEvent(new CustomEvent("portfolio:motion")); arm(); };
    document.head.append(sc);
  }
  const animate = (el, kf, opts = {}) => (!el || reduced.matches || !motion?.animate ? null : motion.animate(el, kf, { duration: 0.5, ease: [0.22, 1, 0.36, 1], ...opts }));

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3600);
  }

  /* ---- theme */
  function setTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    $('meta[name="color-scheme"]').content = theme;
    $('meta[name="theme-color"]').content = theme === "light" ? "#faf8f5" : "#121211";
    if (persist) store.set("theme", theme);
    syncThemeLabel();
    document.dispatchEvent(new CustomEvent("portfolio:theme", { detail: { theme } }));
  }
  function syncThemeLabel() {
    const label = document.documentElement.dataset.theme === "light" ? T().themeToDark : T().themeToLight;
    $("#theme-toggle").setAttribute("aria-label", label);
    $("#theme-toggle").title = label;
  }

  /* ---- static text */
  function applyStatic() {
    const t = T();
    document.documentElement.lang = state.lang;
    document.title = t.pageTitle;
    $('meta[name="description"]').content = t.metaDesc;
    $$("[data-i18n]").forEach((el) => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-aria]").forEach((el) => { const v = t[el.dataset.i18nAria]; if (typeof v === "string") el.setAttribute("aria-label", v); });
    $$("[data-i18n-alt]").forEach((el) => { const v = t[el.dataset.i18nAlt]; if (typeof v === "string") el.alt = v; });
    const lb = $("#lang-toggle");
    lb.querySelector("span").textContent = t.langLabel;
    lb.setAttribute("aria-label", `${t.langLabel} · ${t.langAria}`);
    const cv = $("#header-cv");
    cv.href = t.cvHref;
    cv.setAttribute("download", t.cvFile);
    syncThemeLabel();
  }

  /* ---- work */
  const featuredIds = Object.keys(FEATURED);
  function renderFeatures() {
    const t = T();
    $("#featured-cases").innerHTML = featuredIds
      .map((id, i) => {
        const p = DATA.projects.find((x) => x.id === id);
        const fact = isEs() ? FEATURED[id].fact : FEATURED[id].factEn;
        const primary = (p.links || []).find((l) => l.role === "primary");
        const visual = p.id === "kick-biomechanics"
          ? `<button type="button" class="feature-image" data-zoom aria-label="${esc(t.enlarge)}: ${esc(L(p, "name"))}"><img src="${esc(p.image.src)}" width="${p.image.width}" height="${p.image.height}" alt="${esc(isEs() ? p.image.altEs : p.image.altEn)}" loading="lazy" decoding="async"></button>`
          : `<div class="case-demo" data-demo="${esc(p.id)}"></div>`;
        return `<article class="feature case reveal${i % 2 ? " is-flipped" : ""}" id="project-${esc(p.id)}" data-project-id="${esc(p.id)}" data-step="0" aria-labelledby="f-${esc(p.id)}">
          <div class="feature-visual">${visual}</div>
          <div class="feature-body">
            <p class="feature-meta">${esc(year(p))} · ${esc(L(p, "categoryLabel").split(/[,&·]/)[0].trim())}</p>
            <h3 class="feature-name" id="f-${esc(p.id)}">${esc(L(p, "name"))}</h3>
            <p class="feature-brief">${esc(L(p, "brief"))}</p>
            <p class="fact"><strong>${esc(fact[0])}</strong><span>${esc(fact[1])}</span></p>
            <p class="feature-links"><button type="button" class="link-strong link-btn" data-open-case="${esc(p.id)}">${esc(t.openCase)}</button>${primary ? `<a href="${esc(primary.url)}"${linkAttrs(primary.url)}>${esc((isEs() ? primary.labelEs : primary.labelEn).replace(/\s*↗$/, ""))}</a>` : ""}</p>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderFilters() {
    const t = T();
    $("#project-filters").innerHTML = ["all", "clinical", "vision", "devtools"]
      .map((id) => `<button type="button" class="filter" data-filter="${id}" aria-pressed="${state.filter === id}">${esc(t.filters[id])}</button>`)
      .join("");
  }
  function renderArchive() {
    $("#archive-grid").innerHTML = DATA.projects
      .filter((p) => !featuredIds.includes(p.id))
      .sort((a, b) => (a.id === "convity") - (b.id === "convity"))
      .map((p) => `<li data-project-id="${esc(p.id)}" data-categories="${esc(p.categories.join(" "))}"><button type="button" class="row" data-open-case="${esc(p.id)}"><span class="row-name">${esc(L(p, "name"))}</span><span class="row-text">${esc(L(p, "brief"))}</span><span class="row-meta">${esc(year(p))}</span></button></li>`)
      .join("");
  }
  function applyFilter() {
    let shown = 0;
    $$("#archive-grid li").forEach((li) => {
      li.hidden = !(state.filter === "all" || li.dataset.categories.split(" ").includes(state.filter));
      if (!li.hidden) shown++;
    });
    $("#empty-state").hidden = shown > 0;
    $$("#project-filters .filter").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === state.filter)));
  }

  function galleryHtml(p) {
    if (!p.gallery?.length) return "";
    const t = T();
    const first = p.gallery[0];
    return `<div class="gallery" data-gallery="${esc(p.id)}">
      <div class="gallery-frame${p.mediaTheme === "scientific-light" ? " is-light" : ""}"><img src="${esc(first.src)}" width="${first.width}" height="${first.height}" alt="${esc(isEs() ? first.altEs : first.altEn)}" loading="lazy" decoding="async"><button type="button" class="zoom-btn" data-zoom>${esc(t.enlarge)}</button></div>
      <div class="gallery-tabs" role="group" aria-label="${esc(t.captures)}">${p.gallery.map((g, i) => `<button type="button" class="filter" data-gallery-item="${esc(g.id)}" aria-pressed="${i === 0}">${esc(isEs() ? g.labelEs : g.labelEn)}</button>`).join("")}</div>
    </div>`;
  }
  function selectGallery(btn) {
    const wrap = btn.closest("[data-gallery]");
    const p = DATA.projects.find((x) => x.id === wrap.dataset.gallery);
    const g = p.gallery.find((x) => x.id === btn.dataset.galleryItem);
    $$("[data-gallery-item]", wrap).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const img = $("img", wrap);
    Object.assign(img, { src: g.src, width: g.width, height: g.height, alt: isEs() ? g.altEs : g.altEn });
  }

  /* ---- dialogs */
  function showDialog(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    animate(dlg, { opacity: [0, 1], y: [10, 0] }, { duration: 0.3 });
  }
  function wireDialogs() {
    $$("dialog.sheet").forEach((dlg) =>
      dlg.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) dlg.close();
        else if (e.target === dlg) {
          const r = dlg.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
        }
      }),
    );
  }
  function openZoom(src, caption) {
    $("#zoom-img").src = src;
    $("#zoom-img").alt = caption || "";
    $("#zoom-caption").textContent = caption || "";
    showDialog($("#zoom-dialog"));
  }
  function openCase(id) {
    const p = DATA.projects.find((x) => x.id === id);
    if (!p) return;
    state.caseId = id;
    const t = T();
    $("#case-kicker").textContent = `${L(p, "categoryLabel")} · ${L(p, "year")}`;
    let media = "";
    if (p.gallery?.length) media = galleryHtml(p);
    else if (p.image) media = `<figure class="case-media"><img src="${esc(p.image.src)}" width="${p.image.width}" height="${p.image.height}" alt="${esc(isEs() ? p.image.altEs : p.image.altEn)}" loading="lazy"></figure>`;
    else if (p.svgKey && DATA.schematics[p.svgKey]) media = `<figure class="case-media">${DATA.schematics[p.svgKey]}</figure>`;
    const links = (p.links || []).map((l) => `<a href="${esc(l.url)}"${linkAttrs(l.url)}>${esc(isEs() ? l.labelEs : l.labelEn)}</a>`).join("");
    $("#case-body").innerHTML = `
      <header><h2 class="case-title" id="case-title" tabindex="-1">${esc(L(p, "name"))}</h2><p class="case-sub">${esc(L(p, "subtitle"))}</p></header>
      ${media}
      <p class="case-summary">${esc(L(p, "summary"))}</p>
      <p class="case-kpis">${(L(p, "kpis") || []).map((k) => `<span>${esc(k)}</span>`).join("")}</p>
      <h3>${esc(t.caseHighlights)}</h3>
      <ul class="case-list">${(L(p, "bullets") || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <h3>${esc(t.caseStack)}</h3>
      <p class="case-tags">${esc((L(p, "tags") || []).join(" · "))}</p>
      ${L(p, "note") ? `<p class="case-note">${esc(L(p, "note"))}</p>` : ""}
      ${links ? `<h3>${esc(t.caseLinks)}</h3><p class="case-links">${links}</p>` : ""}`;
    $("#case-body").scrollTop = 0;
    showDialog($("#case-dialog"));
    $("#case-title").focus({ preventScroll: true });
  }
  function stepCase(d) {
    const ids = DATA.projects.map((p) => p.id);
    openCase(ids[(ids.indexOf(state.caseId) + d + ids.length) % ids.length]);
  }

  /* ---- research */
  function renderResearch() {
    const t = T();
    const r = ui().researchSection;
    $("#paper").innerHTML = `
      <p class="feature-meta">${esc(t.paperRole)}</p>
      <h3 class="paper-title">${esc(t.paperShort)}</h3>
      <p class="paper-full" lang="en">${esc(DATA.ui.es.researchSection.preprintTitle)}</p>
      <p class="paper-links"><a class="link-strong" href="https://doi.org/10.51224/SportRxiv.1131" target="_blank" rel="noopener noreferrer">DOI 10.51224/SportRxiv.1131</a><button type="button" class="link-btn" data-copy="10.51224/SportRxiv.1131">${esc(t.copyDoi)}</button><a href="https://doi.org/10.5281/zenodo.23439408" target="_blank" rel="noopener noreferrer">Zenodo</a><a href="https://github.com/convderover/broadcast-kick-biomechanics" target="_blank" rel="noopener noreferrer">GitHub</a><button type="button" class="link-btn" data-open-case="kick-biomechanics">${esc(t.openCase)}</button></p>
      <details class="fold"><summary>${esc(t.paperAbstract)}</summary><p>${esc(r.preprintSummary)}</p><ul class="case-list">${r.preprintHighlights.map((h) => `<li><strong>${esc(h.k)}</strong> — ${esc(h.v)}</li>`).join("")}</ul></details>`;
    $("#trials").innerHTML = `<h3>${esc(t.trialsTitle)}</h3><div class="rows">${r.trials
      .map((tr) => `<a class="row" href="${esc(tr.url)}" target="_blank" rel="noopener noreferrer" title="${esc(tr.desc)}"><span class="row-name">${esc(tr.name)}</span><span class="row-text">${esc(tr.scope)}</span><span class="row-meta">${esc(tr.nct)}</span></a>`)
      .join("")}</div>`;
  }

  /* ---- about */
  function renderAbout() {
    const t = T();
    $("#bio").innerHTML = t.bio.map((p) => `<p>${esc(p)}</p>`).join("");
    $("#chronology").innerHTML = ui().experienceSection.items
      .map((it) => `<details class="row-fold"><summary class="row"><span class="row-name">${esc(it.role)}</span><span class="row-text">${esc(it.org.split(/[·(]/)[0].trim())}</span><span class="row-meta">${it.current ? `<em>${esc(t.current)}</em>` : esc(it.period.replace(/([a-zA-Z]{3})[a-z]*\s/g, "$1 "))}</span></summary><p>${esc(it.desc)}</p></details>`)
      .join("");
    const c = ui().credentialsSection;
    $("#degrees").innerHTML =
      c.education.filter((e) => e.primary).map((e) => `<div class="row is-static"><span class="row-name">${esc(e.degree)}</span><span class="row-text">${esc(e.school)} · ${esc((e.badge.match(/[^·(]*\d[,.]\d+\s*\/\s*10/) || [e.badge])[0].trim())}</span><span class="row-meta">${esc(e.period)}</span></div>`).join("") +
      `<div class="row is-static"><span class="row-name">${esc(t.languages)}</span><span class="row-text">${esc(c.languagesLine)}</span><span class="row-meta"></span></div>`;
    $("#certs").innerHTML = `<details class="fold"><summary>${esc(t.certsTitle(c.certs.length))}</summary><ul class="case-list">${c.certs
      .map((x) => `<li>${esc(x.title)} <span class="muted">— ${esc(x.issuer)}, ${esc(x.date)}</span>${x.url ? ` <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(t.verify)}</a>` : ""}</li>`)
      .join("")}</ul></details>`;
    $("#toolbox").innerHTML = `<details class="fold"><summary>${esc(t.stackTitle)}</summary><dl class="stack">${ui().stackSection.groups
      .map((g) => `<div><dt>${esc(g.title)}</dt><dd>${esc([...g.core, ...g.extra].join(", "))}</dd></div>`)
      .join("")}</dl></details>`;
  }

  function renderCredits() {
    const list = window.PORTFOLIO_CREDITS?.[state.lang] || [];
    $("#credits-body").innerHTML = `<dl class="stack">${list.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><p class="case-links"><a href="assets/img/GRAINIENT-ATTRIBUTION.md">Grainient</a><a href="assets/vendor/MOTION-LICENSE.md">Motion · MIT</a><a href="assets/fonts/OFL.txt">Inter · OFL</a><a href="assets/fonts/OFL-InstrumentSerif.txt">Instrument Serif · OFL</a><a href="cardiocloud/ATTRIBUTION.md">CardioCloud</a></p>`;
  }

  async function copyText(text, okMsg) {
    try { await navigator.clipboard.writeText(text); toast(okMsg); return true; } catch { return false; }
  }

  /* ---- events */
  function initEvents() {
    $("#theme-toggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => { if (!store.get("theme")) setTheme(e.matches ? "dark" : "light", false); });
    document.addEventListener("click", async (e) => {
      const f = e.target.closest("[data-filter]");
      if (f) { state.filter = f.dataset.filter; applyFilter(); return; }
      const open = e.target.closest("[data-open-case]");
      if (open) return openCase(open.dataset.openCase);
      const tab = e.target.closest("[data-gallery-item]");
      if (tab) return selectGallery(tab);
      const zoom = e.target.closest("[data-zoom]");
      if (zoom) { const img = (zoom.matches(".feature-image") ? zoom : zoom.parentElement).querySelector("img"); if (img) openZoom(img.currentSrc || img.src, img.alt); return; }
      const step = e.target.closest("[data-case-step]");
      if (step) return stepCase(Number(step.dataset.caseStep));
      const cp = e.target.closest("[data-copy]");
      if (cp) return void copyText(cp.dataset.copy, T().doiCopied);
      if (e.target.closest("[data-open-credits]")) { e.preventDefault(); showDialog($("#credits-dialog")); }
    });
    $("#case-dialog").addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") stepCase(1);
      else if (e.key === "ArrowLeft") stepCase(-1);
    });
    $("#copy-email").addEventListener("click", async () => { if (!(await copyText(EMAIL, T().copied))) location.href = `mailto:${EMAIL}`; });

    const header = $("#site-header");
    const bar = $(".reading-progress span");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-scrolled", scrollY > 8);
        const h = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const links = $$("#primary-nav a");
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => (a.getAttribute("href") === `#${en.target.id}` ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    }), { rootMargin: "-40% 0px -55% 0px" });
    [$("#top"), $("#work"), $("#research"), $("#about"), $("#contact")].forEach((s) => io.observe(s));
  }

  /* ---- reveal (Motion owns opacity/transform of armed elements) */
  let revealIO;
  function arm() {
    if (reduced.matches || !motion?.animate) return;
    revealIO?.disconnect();
    revealIO = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      revealIO.unobserve(en.target);
      en.target.classList.remove("is-armed");
      animate(en.target, { opacity: [0, 1], y: [16, 0] }, { duration: 0.7 });
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    $$(".reveal").forEach((el) => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = "1";
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
      el.classList.add("is-armed");
      revealIO.observe(el);
    });
  }

  function renderAll() {
    applyStatic();
    renderFeatures();
    renderFilters();
    renderArchive();
    applyFilter();
    renderResearch();
    renderAbout();
    renderCredits();
    document.dispatchEvent(new CustomEvent("portfolio:render", { detail: { lang: state.lang } }));
    arm();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const urlLang = new URLSearchParams(location.search).get("lang");
    const saved = store.get("portfolio-lang");
    state.lang = urlLang === "en" || urlLang === "es" ? urlLang : saved === "en" ? "en" : "es";
    wireDialogs();
    initEvents();
    renderAll();
    $("#lang-toggle").addEventListener("click", () => {
      state.lang = isEs() ? "en" : "es";
      store.set("portfolio-lang", state.lang);
      const url = new URL(location.href);
      state.lang === "en" ? url.searchParams.set("lang", "en") : url.searchParams.delete("lang");
      history.replaceState(null, "", url);
      const keep = scrollY;
      renderAll();
      scrollTo(0, keep);
      if ($("#case-dialog").open && state.caseId) openCase(state.caseId);
    });
    window.PortfolioApp = { toast, openCase, getLang: () => state.lang, T };
    if (document.readyState === "complete") loadMotion();
    else addEventListener("load", () => (window.requestIdleCallback ? requestIdleCallback(loadMotion, { timeout: 1500 }) : setTimeout(loadMotion, 300)), { once: true });
  });
})();
