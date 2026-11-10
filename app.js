/* Portfolio v3 — rendering, language, theme, navigation, search, dialogs.
 * Content: data.js (records, results, links) + design-data.js (short copy).
 * Interactive demos and the 3D specimen live in lab.js. */
(() => {
  "use strict";
  const DATA = window.PORTFOLIO_DATA;
  const COPY = window.PORTFOLIO_COPY;
  if (!DATA || !COPY) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = "convderover@gmail.com";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const state = { lang: "es", filter: "all", query: "", caseId: null };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const T = () => COPY[state.lang];
  const isEs = () => state.lang === "es";
  const L = (p, key) => p[key + (isEs() ? "Es" : "En")];
  const ui = () => DATA.ui[state.lang];
  const ext = (url) => /^https?:/.test(url);
  const linkAttrs = (url) => (ext(url) ? ' target="_blank" rel="noopener noreferrer"' : "");
  const motion = window.Motion;
  const animate = (el, kf, opts = {}) => {
    if (!el || reduced.matches || !motion?.animate) return null;
    return motion.animate(el, kf, { duration: 0.5, ease: [0.22, 1, 0.36, 1], ...opts });
  };

  /* ------------------------------------------------------------ toast */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3800);
  }

  /* ------------------------------------------------------------ theme */
  function setTheme(theme, persist = true) {
    const root = document.documentElement;
    root.dataset.theme = theme;
    $('meta[name="color-scheme"]').content = theme;
    $('meta[name="theme-color"]').content = theme === "light" ? "#f2eee5" : "#061110";
    if (persist) store.set("theme", theme);
    syncThemeLabel();
    document.dispatchEvent(new CustomEvent("portfolio:theme", { detail: { theme } }));
  }
  function syncThemeLabel() {
    const btn = $("#theme-toggle");
    const t = T();
    const label = document.documentElement.dataset.theme === "light" ? t.themeToDark : t.themeToLight;
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  function initTheme() {
    $("#theme-toggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
    matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
      if (!store.get("theme")) setTheme(e.matches ? "light" : "dark", false);
    });
  }

  /* ------------------------------------------------------------ i18n */
  function applyStatic() {
    const t = T();
    document.documentElement.lang = state.lang;
    document.title = t.pageTitle;
    $('meta[name="description"]').content = t.metaDesc;
    $$("[data-i18n]").forEach((el) => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-html]").forEach((el) => { const v = t[el.dataset.i18nHtml]; if (typeof v === "string") el.innerHTML = v; });
    $$("[data-i18n-aria]").forEach((el) => { const v = t[el.dataset.i18nAria]; if (typeof v === "string") el.setAttribute("aria-label", v); });
    $$("[data-i18n-alt]").forEach((el) => { const v = t[el.dataset.i18nAlt]; if (typeof v === "string") el.alt = v; });
    $$("[data-i18n-placeholder]").forEach((el) => { const v = t[el.dataset.i18nPlaceholder]; if (typeof v === "string") el.placeholder = v; });
    const lb = $("#lang-toggle");
    lb.querySelector("span").textContent = t.langLabel;
    lb.setAttribute("aria-label", t.langAria);
    lb.title = t.langAria;
    lb.lang = isEs() ? "en" : "es";
    $$("#header-cv, [data-cv-link]").forEach((a) => { a.href = t.cvHref; a.setAttribute("download", t.cvFile); a.hreflang = state.lang; });
    const menu = $("#menu-toggle");
    menu.setAttribute("aria-label", menu.getAttribute("aria-expanded") === "true" ? t.menuClose : t.menuOpen);
    syncThemeLabel();
  }

  /* ------------------------------------------------------------ metrics */
  function renderMetrics() {
    $("#metrics").innerHTML = T().metrics
      .map((m) => `<div class="readout reveal"><p class="readout-value">${esc(m.value)}${m.unit ? `<small>${esc(m.unit)}</small>` : ""}</p><p class="readout-label">${esc(m.label)}</p><p class="readout-note mono">${esc(m.note)}</p></div>`)
      .join("");
  }

  /* ------------------------------------------------------------ projects */
  const projectText = (p) =>
    norm([p.nameEs, p.subtitleEs, p.subtitleEn, p.briefEs, p.briefEn, p.summaryEs, p.summaryEn, p.categoryLabelEs, p.categoryLabelEn, ...(p.tagsEs || []), ...(p.tagsEn || []), ...(p.kpisEs || []), ...(p.kpisEn || []), ...(p.bulletsEs || []), ...(p.bulletsEn || [])].join(" "));

  function renderFilters() {
    const t = T();
    const counts = { all: DATA.projects.length };
    DATA.projects.forEach((p) => p.categories.forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
    const order = ["all", "clinical", "vision", "devtools", "cloud"];
    $("#project-filters").innerHTML = order
      .map((id) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="${state.filter === id}">${esc(t.filters[id])}<span class="mono">${counts[id] || 0}</span></button>`)
      .join("");
  }

  function kpiHtml(p, n = 3) {
    return (L(p, "kpis") || []).slice(0, n).map((k) => `<span class="kpi">${esc(k)}</span>`).join("");
  }
  function linksHtml(p, roles = ["primary", "secondary"]) {
    return (p.links || [])
      .filter((l) => roles.includes(l.role))
      .map((l, i) => `<a class="pill-btn${l.role === "primary" && i === 0 ? " is-primary" : ""}" href="${esc(l.url)}"${linkAttrs(l.url)}>${esc(isEs() ? l.labelEs : l.labelEn)}</a>`)
      .join("");
  }
  function galleryHtml(p) {
    if (!p.gallery?.length) return "";
    const t = T();
    const light = p.mediaTheme === "scientific-light" ? " is-light" : "";
    const first = p.gallery[0];
    return `<div class="gallery" data-gallery="${esc(p.id)}">
      <div class="gallery-tabs" role="group" aria-label="${esc(t.captures)}">${p.gallery.map((g, i) => `<button type="button" data-gallery-item="${esc(g.id)}" aria-pressed="${i === 0}">${esc(isEs() ? g.labelEs : g.labelEn)}</button>`).join("")}</div>
      <div class="gallery-frame${light}"><img src="${esc(first.src)}" width="${first.width}" height="${first.height}" alt="${esc(isEs() ? first.altEs : first.altEn)}" loading="lazy" decoding="async"><button type="button" class="zoom-btn" data-zoom>${esc(t.enlarge)} ↗</button></div>
    </div>`;
  }

  function renderCases() {
    const t = T();
    const featured = DATA.projects.filter((p) => p.tier === "featured");
    $("#featured-cases").innerHTML = featured
      .map((p, i) => {
        const tags = (L(p, "tags") || []).slice(0, p.coreTagCount || 4);
        return `<article class="case case-${esc(p.id)} reveal${i === 2 ? " is-flipped" : ""}" id="project-${esc(p.id)}" data-project-id="${esc(p.id)}" data-categories="${esc(p.categories.join(" "))}" data-step="0" aria-labelledby="case-name-${esc(p.id)}">
          <div class="case-demo" data-demo="${esc(p.id)}"></div>
          <div class="case-body">
            <p class="case-meta mono"><span class="is-accent">${esc(L(p, "visibility"))}</span><span>${esc(L(p, "year"))}</span></p>
            <h3 class="case-name" id="case-name-${esc(p.id)}">${esc(L(p, "name"))}</h3>
            <p class="case-sub">${esc(L(p, "subtitle"))}</p>
            <p class="case-brief">${esc(L(p, "brief"))}</p>
            <div class="kpis">${kpiHtml(p)}</div>
            <p class="tech-line">${tags.map((x) => `<span>${esc(x)}</span>`).join("")}</p>
            <div class="case-actions">${linksHtml(p)}<button type="button" class="pill-btn" data-open-case="${esc(p.id)}">${esc(t.openCase)} +</button></div>
            ${p.gallery?.length ? `<details class="fold"><summary>${esc(t.captures)}</summary><div class="fold-body">${galleryHtml(p)}</div></details>` : ""}
            <details class="fold"><summary>${esc(t.caseHighlights)}</summary><div class="fold-body"><ul>${(L(p, "bullets") || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>${L(p, "note") ? `<p class="case-note">${esc(L(p, "note"))}</p>` : ""}</div></details>
          </div>
        </article>`;
      })
      .join("");
  }

  function plateArt(p) {
    const glyph = window.PORTFOLIO_GLYPHS?.[p.id];
    if (p.image) return `<img class="plate-photo" src="${esc(p.image.src)}" width="${p.image.width}" height="${p.image.height}" alt="" loading="lazy" decoding="async">`;
    return glyph || "";
  }
  function renderArchive() {
    const t = T();
    const items = DATA.projects.filter((p) => p.tier !== "featured");
    $("#archive-grid").innerHTML = items
      .map(
        (p) => `<li class="reveal" data-project-id="${esc(p.id)}" data-categories="${esc(p.categories.join(" "))}">
          <article class="plate">
            <div class="plate-art">${plateArt(p)}<span class="plate-tag mono">${esc(p.isPrivate ? t.privateNote.split(" · ")[0] : L(p, "visibility").split(" · ")[0])}</span></div>
            <div class="plate-body">
              <p class="plate-top mono"><span>${esc(L(p, "categoryLabel").split(/[·&,]/)[0].trim())}</span><span>${esc(L(p, "year").split(" · ")[0])}</span></p>
              <h4 class="plate-name"><button type="button" class="plate-link" data-open-case="${esc(p.id)}">${esc(L(p, "name"))}</button></h4>
              <p class="plate-brief">${esc(L(p, "brief"))}</p>
              <p class="plate-open" aria-hidden="true"><span>${esc(t.openCase)}</span><span>→</span></p>
            </div>
          </article>
        </li>`,
      )
      .join("");
  }

  function applyFilters() {
    const q = norm(state.query.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    let shown = 0;
    $$("[data-project-id]", $("#work")).forEach((el) => {
      if (!el.matches(".case, li")) return;
      const p = DATA.projects.find((x) => x.id === el.dataset.projectId);
      const okCat = state.filter === "all" || p.categories.includes(state.filter);
      const hay = projectText(p);
      const okQ = !terms.length || terms.every((w) => hay.includes(w));
      el.hidden = !(okCat && okQ);
      if (!el.hidden) shown++;
    });
    const archiveVisible = $$("#archive-grid li").some((li) => !li.hidden);
    $("#archive").hidden = !archiveVisible;
    $("#empty-state").hidden = shown > 0;
    $("#search-status").textContent = q || state.filter !== "all" ? T().results(shown) : "";
    $$("#project-filters .chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === state.filter)));
    document.dispatchEvent(new CustomEvent("portfolio:filtered"));
  }

  function initWork() {
    $("#project-filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b || b.dataset.filter === state.filter) return;
      state.filter = b.dataset.filter;
      const run = () => applyFilters();
      if (document.startViewTransition && !reduced.matches) document.startViewTransition(run);
      else run();
    });
    let debounce;
    $("#project-search").addEventListener("input", (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = e.target.value;
        applyFilters();
      }, 90);
    });
    document.addEventListener("click", (e) => {
      const open = e.target.closest("[data-open-case]");
      if (open) openCase(open.dataset.openCase, open);
      const tab = e.target.closest("[data-gallery-item]");
      if (tab) selectGallery(tab);
      const zoom = e.target.closest("[data-zoom]");
      if (zoom) {
        const img = zoom.parentElement.querySelector("img");
        if (img) openZoom(img.currentSrc || img.src, img.alt, img.alt);
      }
    });
  }

  function selectGallery(btn) {
    const wrap = btn.closest("[data-gallery]");
    const p = DATA.projects.find((x) => x.id === wrap.dataset.gallery);
    const g = p.gallery.find((x) => x.id === btn.dataset.galleryItem);
    $$("[data-gallery-item]", wrap).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const img = $("img", wrap);
    img.src = g.src;
    img.width = g.width;
    img.height = g.height;
    img.alt = isEs() ? g.altEs : g.altEn;
    animate(img, { opacity: [0.4, 1] }, { duration: 0.35 });
  }

  /* ------------------------------------------------------------ dialogs */
  function showDialog(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.classList.add("has-dialog");
    animate(dlg, { opacity: [0, 1], y: [14, 0] }, { duration: 0.35 });
  }
  function wireDialogs() {
    $$("dialog.sheet").forEach((dlg) => {
      dlg.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) dlg.close();
        else if (e.target === dlg) {
          const r = dlg.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
        }
      });
      dlg.addEventListener("close", () => {
        if (!$$("dialog[open]").length) document.documentElement.classList.remove("has-dialog");
      });
    });
  }

  function openZoom(src, caption, alt) {
    const dlg = $("#zoom-dialog");
    $("#zoom-img").src = src;
    $("#zoom-img").alt = alt || "";
    $("#zoom-caption").textContent = caption || "";
    showDialog(dlg);
  }

  function openCase(id, opener) {
    const p = DATA.projects.find((x) => x.id === id);
    if (!p) return;
    state.caseId = id;
    const t = T();
    const dlg = $("#case-dialog");
    $("#case-kicker").textContent = `${L(p, "categoryLabel")} · ${L(p, "year")}`;
    let media = "";
    if (p.gallery?.length) media = galleryHtml(p);
    else if (p.image) media = `<figure class="case-media${p.mediaTheme === "scientific-light" ? " is-light" : ""}"><img src="${esc(p.image.src)}" width="${p.image.width}" height="${p.image.height}" alt="${esc(isEs() ? p.image.altEs : p.image.altEn)}" loading="lazy"></figure>`;
    else if (p.svgKey && DATA.schematics[p.svgKey]) media = `<figure class="case-media">${DATA.schematics[p.svgKey]}</figure>`;
    const links = (p.links || []).map((l) => `<a class="pill-btn${l.role === "primary" ? " is-primary" : ""}" href="${esc(l.url)}"${linkAttrs(l.url)}>${esc(isEs() ? l.labelEs : l.labelEn)}</a>`).join("");
    $("#case-body").innerHTML = `
      <header class="case-head">
        <p class="mono" style="color:var(--accent)">${esc(L(p, "visibility"))}</p>
        <h2 class="case-title" id="case-title">${esc(L(p, "name"))}</h2>
        <p class="case-sub">${esc(L(p, "subtitle"))}</p>
      </header>
      ${media}
      <div class="kpis">${kpiHtml(p, 6)}</div>
      <div class="case-cols">
        <div class="case-section"><p class="case-summary">${esc(L(p, "summary"))}</p><h3 class="mono" style="margin-top:22px">${esc(t.caseHighlights)}</h3><ul>${(L(p, "bullets") || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
        <div class="case-section"><h3 class="mono">${esc(t.caseStack)}</h3><div class="tags">${(L(p, "tags") || []).map((x) => `<span>${esc(x)}</span>`).join("")}</div>${L(p, "note") ? `<p class="case-note" style="margin-top:18px">${esc(L(p, "note"))}</p>` : ""}${links ? `<h3 class="mono" style="margin-top:18px">${esc(t.caseLinks)}</h3><div class="case-actions">${links}</div>` : ""}</div>
      </div>`;
    $("#case-body").scrollTop = 0;
    if (!dlg.open) {
      dlg._opener = opener;
      showDialog(dlg);
    }
    $("#case-title").setAttribute("tabindex", "-1");
    $("#case-title").focus({ preventScroll: true });
  }
  function initCaseNav() {
    $("#case-dialog").addEventListener("click", (e) => {
      const b = e.target.closest("[data-case-step]");
      if (!b) return;
      const ids = DATA.projects.map((p) => p.id);
      const i = ids.indexOf(state.caseId);
      const next = ids[(i + Number(b.dataset.caseStep) + ids.length) % ids.length];
      openCase(next);
      animate($("#case-body"), { opacity: [0.3, 1], x: [Number(b.dataset.caseStep) * 16, 0] }, { duration: 0.35 });
    });
    $("#case-dialog").addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const btn = $(`[data-case-step="${e.key === "ArrowRight" ? 1 : -1}"]`, $("#case-dialog"));
        if (document.activeElement?.closest(".gallery-tabs")) return;
        btn.click();
      }
    });
  }

  /* ------------------------------------------------------------ research */
  function renderResearch() {
    const t = T();
    const r = ui().researchSection;
    const kick = DATA.projects.find((p) => p.id === "kick-biomechanics");
    const img = kick.gallery[0];
    $("#paper").innerHTML = `
      <p class="paper-kicker mono"><span>${esc(t.paperKicker)}</span><span class="role">${esc(t.paperRole)}</span></p>
      <h3 class="paper-title">${t.paperShort}</h3>
      <p class="paper-full" lang="en">${esc(DATA.ui.es.researchSection.preprintTitle)}</p>
      <figure class="paper-figure"><img src="${esc(img.src)}" width="${img.width}" height="${img.height}" alt="${esc(isEs() ? img.altEs : img.altEn)}" loading="lazy" decoding="async"><button type="button" class="zoom-btn" data-zoom>${esc(t.enlarge)} ↗</button><figcaption>${esc(t.paperFig)}</figcaption></figure>
      <div class="figures">${r.preprintHighlights.map((h) => `<div class="figure-cell"><strong>${esc(h.k)}</strong><span>${esc(h.v)}</span></div>`).join("")}</div>
      <div class="citation">
        <span class="doi"><a href="https://doi.org/10.51224/SportRxiv.1131" target="_blank" rel="noopener noreferrer">DOI 10.51224/SportRxiv.1131 ↗</a><button type="button" data-copy="10.51224/SportRxiv.1131">${esc(t.copyDoi)}</button></span>
        <a class="pill-btn" href="https://doi.org/10.5281/zenodo.23439408" target="_blank" rel="noopener noreferrer">Zenodo ↗</a>
        <a class="pill-btn" href="https://github.com/convderover/broadcast-kick-biomechanics" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a class="pill-btn" href="https://orcid.org/0009-0004-5724-3502" target="_blank" rel="noopener noreferrer">ORCID ↗</a>
      </div>
      <details class="fold"><summary>${esc(t.paperAbstract)}</summary><div class="fold-body"><p>${esc(r.preprintSummary)}</p><p class="mono" style="color:var(--ink-3)">${esc(r.preprintAuthors)}</p></div></details>`;

    const grants = [
      { id: "ecocardia", code: "ISCIII DTS25/00100" },
      { id: "emboendo", code: "ISCIII PI23/01072" },
      { id: "emboendo", code: "CaixaImpulse CI24-10743" },
    ];
    $("#trials").innerHTML = `
      <div class="ledger-block reveal">
        <p class="mono" style="color:var(--accent)">ICICOR · HCUV</p>
        <h3 id="trials-title">${esc(t.trialsTitle)}</h3>
        <p>${esc(t.trialsDeck)}</p>
        ${r.trials.map((tr) => `<div class="trial"><div class="trial-top"><strong>${esc(tr.name)}</strong><a class="nct" href="${esc(tr.url)}" target="_blank" rel="noopener noreferrer">${esc(tr.nct)} ↗</a></div><span class="trial-scope">${esc(tr.scope)}</span><details class="fold"><summary>${esc(t.trialAbout)}</summary><div class="fold-body"><p>${esc(tr.desc)}</p></div></details></div>`).join("")}
      </div>
      <div class="ledger-block reveal">
        <h3>${esc(t.grantsTitle)}</h3>
        ${grants.map((g) => { const p = DATA.projects.find((x) => x.id === g.id); return `<div class="grant"><button type="button" data-open-case="${esc(p.id)}">${esc(L(p, "name"))}</button><span class="mono">${esc(g.code)}</span></div>`; }).join("")}
      </div>`;
  }

  /* ------------------------------------------------------------ path */
  const MONTHS = { ene: 0, jan: 0, feb: 1, mar: 2, abr: 3, apr: 3, may: 4, jun: 5, jul: 6, ago: 7, aug: 7, sep: 8, oct: 9, nov: 10, dic: 11, dec: 11 };
  function parsePeriod(s) {
    const parts = norm(s).split(/[–-]/).map((x) => x.trim());
    const toN = (x) => {
      const m = x.match(/([a-z]{3})[a-z]*\s+(\d{4})/);
      return m ? Number(m[2]) * 12 + (MONTHS[m[1]] ?? 0) : null;
    };
    const now = 2026 * 12 + 10;
    return [toN(parts[0]), toN(parts[1] || "") ?? now];
  }
  function renderPath() {
    const t = T();
    const items = ui().experienceSection.items;
    const start = 2024 * 12, end = 2026 * 12 + 12;
    const pct = (n) => ((n - start) / (end - start)) * 100;
    const rows = [0, 1, 2, 1, 0];
    let ticks = "";
    for (let m = start; m <= end; m += 3) ticks += `<span class="ruler-tick${m % 12 === 0 ? " is-year" : ""}" style="left:${pct(m)}%"></span>${m % 12 === 0 && m < end ? `<span class="ruler-year mono" style="left:${pct(m + 6)}%">${m / 12}</span>` : ""}`;
    const spans = items
      .map((it, i) => {
        const [a, b] = parsePeriod(it.period);
        const acronym = it.org.match(/^([A-ZÁÉÍÓÚ]{3,})\b/);
        const paren = it.org.match(/\(([^)]+)\)/);
        const short = acronym ? acronym[1] : paren ? paren[1] : it.org.split(/[·(,]/)[0].trim();
        return `<button type="button" class="ruler-span${it.current ? " is-current" : ""}" data-role="${i}" style="left:${pct(a)}%;width:max(${pct(b + 1) - pct(a)}%, 64px);top:${8 + rows[i % rows.length] * 32}px" aria-label="${esc(it.role)} · ${esc(it.period)}"><span class="mono">${esc(short)}</span></button>`;
      })
      .join("");
    const now = pct(2026 * 12 + 10);
    $("#chronology").innerHTML = `
      <div class="ruler" aria-hidden="false"><div class="ruler-track">${ticks}${spans}<span class="ruler-now" style="left:${now}%"><span class="mono">${isEs() ? "HOY" : "NOW"}</span></span></div></div>
      <div class="roles">${items
        .map(
          (it, i) => `<details class="role reveal" data-role-item="${i}"${i === 0 ? " open" : ""}>
            <summary><span class="role-when mono"><span>${esc(it.period)}</span>${it.current ? `<span class="now">${esc(t.current)}</span>` : ""}</span><span class="role-title">${esc(it.role)}<span class="role-org">${esc(it.org)}</span></span><span class="role-toggle" aria-hidden="true">+</span></summary>
            <div class="role-body"><p class="mono">${esc(it.location)}</p><p>${esc(it.desc)}</p></div>
          </details>`,
        )
        .join("")}</div>`;
    $$(".ruler-span").forEach((b) =>
      b.addEventListener("click", () => {
        const d = $(`[data-role-item="${b.dataset.role}"]`);
        d.open = true;
        $$(".ruler-span").forEach((x) => x.classList.toggle("is-active", x === b));
        d.scrollIntoView({ block: "nearest", behavior: reduced.matches ? "auto" : "smooth" });
        d.classList.add("is-flash");
        setTimeout(() => d.classList.remove("is-flash"), 900);
        $("summary", d).focus({ preventScroll: true });
      }),
    );
  }

  /* ------------------------------------------------------------ stack */
  const ALIASES = { yolo: ["yolov8", "yolox", "yolo"], "claude code & subagents": ["claude code"], "rag local": ["rag local", "local rag", "rag"], "local rag": ["rag"], "lora fine-tuning": ["lora"], "orthanc dicomweb": ["orthanc", "dicomweb"], "tesseract ocr 5.5": ["tesseract"], "modulos redcap": ["redcap"], "redcap modules": ["redcap"], "3d cnn / 3d vae": ["3d cnn", "3d vae"], "espectrogramas mel": ["mel"], "mel spectrograms": ["mel"], "cfd transitorio": ["cfd"], "transient cfd": ["cfd"], "lidar & rgb-d": ["lidar", "rgb-d"], "dynamodb / athena": ["dynamodb", "athena"], "s3 / cloudfront": ["s3", "cloudfront"], "ecr / codebuild": ["ecr", "codebuild"], "cognito (pkce)": ["cognito", "pkce"], "lambda (vpc)": ["lambda"], "react / vite": ["react", "vite"], "typescript / js": ["typescript", "javascript"], "html5 / modern css": ["html"], "calibracion clinica": ["calibrad", "calibration"], "clinical calibration": ["calibrat"], "u-net": ["u-net"], "dicom / nifti": ["dicom", "nifti"], "monai / biomonai": ["monai"], "keras 3": ["keras 3"], "ros 2": ["ros 2"] };
  const STOP = new Set(["git", "github", "local", "modern", "css", "c", "c++", "fine-tuning"]);
  function toolTerms(label) {
    const key = norm(label);
    if (ALIASES[key]) return ALIASES[key];
    return [key, ...key.split(/[\/&()·,]+/).map((s) => s.trim())].filter((s) => s.length > 1 && !STOP.has(s));
  }
  const hasTerm = (hay, term) => {
    const e = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${e}`, "i").test(hay);
  };
  function toolMatches(label) {
    const terms = toolTerms(label);
    const projects = DATA.projects.filter((p) => terms.some((w) => hasTerm(projectText(p), w)));
    const roles = ui().experienceSection.items.map((it, i) => ({ it, i })).filter(({ it }) => terms.some((w) => hasTerm(norm(`${it.role} ${it.org} ${it.desc} ${it.location}`), w)));
    return { projects, roles };
  }
  function renderStack() {
    const groups = ui().stackSection.groups;
    $("#toolbox").innerHTML = groups
      .map((g, gi) => {
        const chip = (label, extra) => {
          const m = toolMatches(label);
          const n = m.projects.length + m.roles.length;
          return `<button type="button" class="tool${extra ? " is-extra" : ""}" data-tool="${esc(label)}" data-group="${gi}" aria-expanded="false" aria-controls="tool-links-${gi}">${esc(label)}${n ? `<span class="n">${n}</span>` : ""}</button>`;
        };
        return `<section class="tray reveal" aria-labelledby="tray-${gi}"><div class="tray-head"><h3 id="tray-${gi}">${esc(g.title)}</h3><span class="mono">${esc(g.index)}</span></div><div class="tools">${g.core.map((c) => chip(c, false)).join("")}${g.extra.map((c) => chip(c, true)).join("")}</div><div class="tool-links" id="tool-links-${gi}" hidden aria-live="polite"></div></section>`;
      })
      .join("");
  }
  function initStack() {
    $("#toolbox").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tool]");
      if (b) {
        const tray = b.closest(".tray");
        const panel = $(".tool-links", tray);
        const open = b.getAttribute("aria-expanded") !== "true";
        $$("[data-tool]", tray).forEach((x) => x.setAttribute("aria-expanded", "false"));
        if (!open) {
          panel.hidden = true;
          return;
        }
        b.setAttribute("aria-expanded", "true");
        const t = T();
        const m = toolMatches(b.dataset.tool);
        panel.innerHTML = m.projects.length || m.roles.length
          ? `<p class="mono">${esc(t.usedIn)} · ${esc(b.dataset.tool)}</p><div class="row">${m.projects.map((p) => `<button type="button" data-open-case="${esc(p.id)}">${esc(L(p, "name"))} ↗</button>`).join("")}${m.roles.map(({ it, i }) => `<button type="button" data-goto-role="${i}">${esc(it.org.split(/[·(]/)[0].trim())} · ${esc(it.period.split(/[–-]/)[0].trim())}</button>`).join("")}</div>`
          : `<p>${esc(t.notInPublic)}</p>`;
        panel.hidden = false;
        animate(panel, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 });
      }
      const r = e.target.closest("[data-goto-role]");
      if (r) {
        const d = $(`[data-role-item="${r.dataset.gotoRole}"]`);
        d.open = true;
        d.scrollIntoView({ block: "center", behavior: reduced.matches ? "auto" : "smooth" });
        d.classList.add("is-flash");
        setTimeout(() => d.classList.remove("is-flash"), 1200);
      }
    });
  }

  /* ------------------------------------------------------------ learning */
  function renderLearning() {
    const t = T();
    const c = ui().credentialsSection;
    const prim = c.education.filter((e) => e.primary);
    const sec = c.education.filter((e) => !e.primary);
    const grade = (b) => (b.match(/(\d+[,.]\d+)\s*\/\s*10/) || [])[1] || "";
    $("#degrees").innerHTML = `<h3 class="mono" style="color:var(--ink-3)">${esc(t.degreesTitle)}</h3>
      ${prim.map((e) => `<article class="degree reveal"><span class="degree-grade" aria-hidden="true">${esc(grade(e.badge))}</span><p class="mono">${esc(e.period)}</p><h3>${esc(e.degree)}</h3><p>${esc(e.school)}</p><p class="mono" style="color:var(--accent)">${esc(e.badge)}</p></article>`).join("")}
      <div class="minor-lines">${sec.map((e) => `<div><span><strong>${esc(e.degree)}</strong> · ${esc(e.school)}</span><span class="mono">${esc(e.badge.split("·")[0])}</span></div>`).join("")}<div><strong>${esc(t.languages)}</strong><span>${esc(c.languagesLine)}</span></div></div>`;
    const mono = (issuer) => (issuer.match(/\b(AWS|IBM)\b/) || [])[1] || issuer.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    const row = (x) => `<div class="cert"><span class="cert-mono" aria-hidden="true">${esc(mono(x.issuer))}</span><div><p class="cert-title">${esc(x.title)}</p><p class="cert-meta mono">${esc(x.issuer)} · ${esc(x.date)} · ${esc(x.kind)}</p></div>${x.url ? `<a class="verify" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(t.verify)} ↗</a>` : `<span class="done mono">✓</span>`}</div>`;
    const featured = c.certs.filter((x) => x.featured);
    const more = c.certs.filter((x) => !x.featured);
    $("#certs").innerHTML = `<h3 class="mono">${esc(t.certsTitle)}</h3>${featured.map(row).join("")}<details class="fold"><summary>${esc(t.moreLearning(more.length))}</summary><div class="fold-body">${more.map(row).join("")}</div></details>`;
  }

  /* ------------------------------------------------------------ contact & credits */
  function renderContact() {
    const ch = ui().contactSection.channels;
    const kinds = ["LinkedIn", "GitHub", "ORCID", "Case study"];
    $("#channels").innerHTML = ch
      .map((c, i) => `<li><a class="channel" href="${esc(c.url)}"${c.external ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="mono">${esc(kinds[i] || "")}</span><strong>${esc(c.title.split("·").slice(1).join("·").trim() || c.title)}</strong><span>${esc(c.meta)}</span></a></li>`)
      .join("");
  }
  function renderCredits() {
    const list = window.PORTFOLIO_CREDITS?.[state.lang] || [];
    $("#credits-body").innerHTML = `<dl>${list.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><p><a href="assets/img/GRAINIENT-ATTRIBUTION.md">Grainient · ${isEs() ? "atribución y licencia" : "attribution & license"} ↗</a> · <a href="assets/vendor/MOTION-LICENSE.md">Motion · MIT ↗</a> · <a href="assets/fonts/OFL.txt">Inter · OFL ↗</a> · <a href="assets/fonts/OFL-InstrumentSerif.txt">Instrument Serif · OFL ↗</a> · <a href="assets/fonts/OFL-JetBrainsMono.txt">JetBrains Mono · OFL ↗</a> · <a href="cardiocloud/ATTRIBUTION.md">CardioCloud ↗</a></p>`;
  }
  async function copyText(text, okMsg) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMsg);
      return true;
    } catch {
      return false;
    }
  }
  function initContact() {
    $("#copy-email").addEventListener("click", async () => {
      if (!(await copyText(EMAIL, T().copied))) location.href = `mailto:${EMAIL}`;
    });
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (b) await copyText(b.dataset.copy, T().doiCopied);
      const cr = e.target.closest("[data-open-credits]");
      if (cr) {
        e.preventDefault();
        showDialog($("#credits-dialog"));
      }
    });
  }

  /* ------------------------------------------------------------ navigation */
  function initNav() {
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

    const btn = $("#menu-toggle");
    const panel = $("#mobile-menu");
    const setOpen = (open, focusBack) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? T().menuClose : T().menuOpen);
      panel.hidden = !open;
      if (open) animate($$("a", panel), { opacity: [0, 1], y: [10, 0] }, { delay: motion?.stagger ? motion.stagger(0.03) : 0, duration: 0.35 });
      if (!open && focusBack) btn.focus();
    };
    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") setOpen(false, true); });
    addEventListener("resize", () => { if (innerWidth >= 1080 && !panel.hidden) setOpen(false); });

    const links = $$("#primary-nav a");
    const sections = [$("#top"), ...links.map((a) => $(a.getAttribute("href")))].filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => (a.getAttribute("href") === `#${en.target.id}` ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------ reveal */
  let revealIO;
  function arm() {
    if (reduced.matches || !motion?.animate) return;
    revealIO?.disconnect();
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          revealIO.unobserve(el);
          const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("is-armed")) : [];
          const delay = Math.min(0.24, Math.max(0, siblings.indexOf(el)) * 0.06);
          el.classList.remove("is-armed");
          animate(el, { opacity: [0, 1], y: [22, 0] }, { duration: 0.7, delay });
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    $$(".reveal").forEach((el) => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = "1";
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92) return; // already visible: never hide it
      el.classList.add("is-armed");
      revealIO.observe(el);
    });
  }

  /* ------------------------------------------------------------ render */
  function renderAll() {
    applyStatic();
    renderMetrics();
    renderFilters();
    renderCases();
    renderArchive();
    applyFilters();
    renderResearch();
    renderPath();
    renderStack();
    renderLearning();
    renderContact();
    renderCredits();
    $$("section .section-head, .contact-title").forEach((el) => el.classList.add("reveal"));
    document.dispatchEvent(new CustomEvent("portfolio:render", { detail: { lang: state.lang } }));
    arm();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const urlLang = new URLSearchParams(location.search).get("lang");
    const saved = store.get("portfolio-lang");
    state.lang = urlLang === "en" || urlLang === "es" ? urlLang : saved === "en" || saved === "es" ? saved : (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "es";
    initTheme();
    wireDialogs();
    initWork();
    initCaseNav();
    initStack();
    initContact();
    initNav();
    renderAll();
    $("#lang-toggle").addEventListener("click", () => {
      state.lang = isEs() ? "en" : "es";
      store.set("portfolio-lang", state.lang);
      const url = new URL(location.href);
      if (state.lang === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
      const keep = scrollY;
      renderAll();
      scrollTo(0, keep);
      if ($("#case-dialog").open && state.caseId) openCase(state.caseId);
    });
    window.PortfolioApp = { toast, openCase, getLang: () => state.lang, T };
  });
})();
