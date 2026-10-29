/* Application Logic — Roberto Martín Gutiérrez Portfolio */
(() => {
  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  const EMAIL = "convderover@gmail.com";
  let currentLang = "es";
  let currentFilter = "all";
  let copyTimer = null;

  /* Track active gallery tab per project id so language switch preserves active tab */
  const activeGalleryTab = {};

  function safeGetStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSetStorage(key, val) {
    try {
      if (val === null) localStorage.removeItem(key);
      else localStorage.setItem(key, val);
    } catch {
      /* Storage blocked; UI still updates live */
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  /* ========================================================================
     1. Dark Mode Toggle (modern-web-guidance: dark-mode & dark-mode-toggle)
     ======================================================================== */
  function initThemeToggle() {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const btn = document.getElementById("theme-toggle");
    if (!meta || !btn) return;

    btn.addEventListener("click", () => {
      const stored = safeGetStorage("color-scheme");
      const sysScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const rendered = (stored === "dark" || stored === "light") ? stored : sysScheme;
      const target = rendered === "dark" ? "light" : "dark";

      if (target !== sysScheme) {
        safeSetStorage("color-scheme", target);
        meta.content = target;
      } else {
        safeSetStorage("color-scheme", null);
        meta.content = "light dark";
      }
    });

    window.addEventListener("storage", (e) => {
      if (e.key === "color-scheme") {
        meta.content = e.newValue ?? "light dark";
      }
    });
  }

  /* ========================================================================
     2. Animated Top-Layer <dialog> Modals (dialog, light-dismiss, top-layer)
     ======================================================================== */
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
      return false;
    }
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS?.supports?.("overlay", "auto")) && canTransitionDisplay();
  }

  async function closeTopLayer(dialog) {
    if (!dialog || !dialog.open) return;
    if (!supportsTopLayerExit()) {
      dialog.setAttribute("data-closing", "");
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 450))
        ]);
      }
      if (!dialog.hasAttribute("data-closing")) return;
      dialog.removeAttribute("data-closing");
    }
    dialog.close();
  }

  function wireDialog(dialog) {
    if (!dialog) return;

    dialog.addEventListener("close", () => {
      dialog.removeAttribute("data-closing");
      dialog.returnValue = "";
    });

    dialog.addEventListener("cancel", (event) => {
      if (!supportsTopLayerExit()) {
        event.preventDefault();
        closeTopLayer(dialog);
      }
    });

    const closeForm = dialog.querySelector('form[method="dialog"]');
    closeForm?.addEventListener("submit", (event) => {
      if (!supportsTopLayerExit()) {
        event.preventDefault();
        closeTopLayer(dialog);
      }
    });

    /* Fallback for browsers without native HTMLDialogElement.prototype.closedBy */
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const isOutside = (e, dlg) => {
        const r = dlg.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      dialog.addEventListener("pointerdown", (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener("pointerup", (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          closeTopLayer(dialog);
        }
        pressedOutside = false;
      });
    }
  }

  function openZoomDialog(src, width, height, captionText, altText) {
    const dialog = document.getElementById("zoom-dialog");
    const img = document.getElementById("zoom-img");
    const cap = document.getElementById("zoom-caption");
    const closeBtn = document.getElementById("zoom-close-btn");
    if (!dialog || !img || !cap) return;

    const t = DATA.ui[currentLang];
    img.src = src;
    if (width) img.width = Number(width);
    if (height) img.height = Number(height);
    img.alt = altText || captionText || "";
    cap.textContent = captionText || altText || "";
    if (closeBtn) closeBtn.setAttribute("aria-label", t.aria.closeZoom);

    dialog.removeAttribute("data-closing");
    dialog.showModal();
  }

  function openProjectModal(projectId) {
    const project = DATA.projects.find((p) => p.id === projectId);
    const dialog = document.getElementById("project-dialog");
    if (!project || !dialog) return;

    const t = DATA.ui[currentLang];
    const isEs = currentLang === "es";

    document.getElementById("dialog-category").textContent = isEs ? project.categoryLabelEs : project.categoryLabelEn;
    document.getElementById("dialog-title").textContent = isEs ? project.titleEs : project.titleEn;
    document.getElementById("dialog-close-btn").setAttribute("aria-label", t.modal.closeLabel);

    let mediaHtml = "";
    if (project.gallery && project.gallery.length > 0) {
      const activeId = activeGalleryTab[project.id] || project.gallery[0].id;
      const item = project.gallery.find((g) => g.id === activeId) || project.gallery[0];
      const mediaThemeCls = project.mediaTheme === "scientific-light" ? " is-scientific-light" : "";
      mediaHtml = `<div class="dialog-media-preview${mediaThemeCls}">
        <img src="${escapeHtml(item.src)}" width="${item.width}" height="${item.height}" alt="${escapeHtml(isEs ? item.altEs : item.altEn)}" fetchpriority="low">
      </div>`;
    } else if (project.image) {
      mediaHtml = `<div class="dialog-media-preview">
        <img src="${escapeHtml(project.image.src)}" width="${project.image.width}" height="${project.image.height}" alt="${escapeHtml(isEs ? project.image.altEs : project.image.altEn)}" fetchpriority="low">
      </div>`;
    } else if (project.svgKey && DATA.schematics[project.svgKey]) {
      mediaHtml = `<div class="dialog-media-preview"><div class="project-svg-wrap is-drawn">${DATA.schematics[project.svgKey]}</div></div>`;
    }

    const bullets = (isEs ? project.bulletsEs : project.bulletsEn)
      .map((b) => `<li>${escapeHtml(b)}</li>`)
      .join("");

    const kpis = (isEs ? project.kpisEs : project.kpisEn)
      .map((k) => `<span class="kpi-pill">${escapeHtml(k)}</span>`)
      .join("");

    const tags = (isEs ? project.tagsEs : project.tagsEn)
      .map((tag) => `<span class="tech-tag">${escapeHtml(tag)}</span>`)
      .join("");

    const links = (project.links || [])
      .map((lnk) => {
        const cls = lnk.role === "primary" ? "card-btn card-btn-primary" : "card-btn";
        const isExternal = lnk.url.startsWith("http");
        const rel = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="${cls}" href="${escapeHtml(lnk.url)}"${rel}>${escapeHtml(isEs ? lnk.labelEs : lnk.labelEn)}</a>`;
      })
      .join("");

    const note = isEs ? project.noteEs : project.noteEn;

    document.getElementById("dialog-body").innerHTML = `
      ${mediaHtml}
      <div class="project-kpis">${kpis}</div>
      <p class="project-summary">${escapeHtml(isEs ? project.summaryEs : project.summaryEn)}</p>
      <h3 class="dialog-section-title">${escapeHtml(t.modal.highlightsTitle)}</h3>
      <ul class="dialog-bullets">${bullets}</ul>
      <h3 class="dialog-section-title">${escapeHtml(t.modal.stackTitle)}</h3>
      <div class="tag-list">${tags}</div>
      ${note ? `<p class="dialog-note">${escapeHtml(note)}</p>` : ""}
      ${links ? `<div class="project-actions dialog-actions">${links}</div>` : ""}
    `;

    dialog.removeAttribute("data-closing");
    dialog.showModal();
  }

  /* ========================================================================
     3. Navigation: Scrollspy, Header Elevation & Mobile Menu Drawer
     ======================================================================== */
  function initNavigation() {
    const header = document.getElementById("site-header");
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobilePanel = document.getElementById("mobile-nav-panel");

    /* Header elevation on scroll */
    const syncHeaderScroll = () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    syncHeaderScroll();
    window.addEventListener("scroll", syncHeaderScroll, { passive: true });

    /* Mobile navigation drawer */
    const setMobileOpen = (open, returnFocus = false) => {
      if (!menuBtn || !mobilePanel) return;
      const t = DATA.ui[currentLang];
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? t.aria.mobileMenuClose : t.aria.mobileMenuOpen);
      mobilePanel.hidden = !open;
      if (!open && returnFocus) menuBtn.focus();
    };

    menuBtn?.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      setMobileOpen(!isOpen);
    });

    mobilePanel?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMobileOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuBtn?.getAttribute("aria-expanded") === "true") {
        setMobileOpen(false, true);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960 && menuBtn?.getAttribute("aria-expanded") === "true") {
        setMobileOpen(false);
      }
    });

    /* Scrollspy active section indicator (modern-web-guidance: scrollspy) */
    const navLinks = Array.from(document.querySelectorAll("#primary-nav a"));
    const mobileLinks = Array.from(document.querySelectorAll("#mobile-nav-panel a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("main > section[id]")).filter((s) => s.id !== "top" && s.id !== "metrics-section");

    const supportsScrollTargetGroup = Boolean(window.CSS?.supports?.("scroll-target-group: auto"));

    if (supportsScrollTargetGroup) {
      const syncAriaCurrent = () => {
        const currentLink = document.querySelector("#primary-nav a:target-current");
        navLinks.forEach((link) => {
          if (link === currentLink) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      };
      syncAriaCurrent();
      document.addEventListener("scrollend", syncAriaCurrent, { passive: true });
    } else if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              [...navLinks, ...mobileLinks].forEach((link) => {
                const isActive = link.getAttribute("href") === `#${id}`;
                link.classList.toggle(":target-current", isActive);
                if (isActive) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
              });
            }
          });
        },
        { rootMargin: "-32% 0px -55% 0px", threshold: 0 }
      );
      sections.forEach((sec) => observer.observe(sec));
    }
  }

  /* ========================================================================
     4. Two-Tier Projects Rendering, Interactive Galleries & Adaptive Grids
     ======================================================================== */
  function buildMediaStage(p, t, isEs) {
    const visLabel = isEs ? p.visibilityEs : p.visibilityEn;
    const badgeCls = p.isPrivate ? "media-status-pill is-private" : "media-status-pill";
    const chromeMeta = isEs ? p.chromeMetaEs : p.chromeMetaEn;
    const themeCls = p.mediaTheme === "scientific-light" ? " is-scientific-light" : "";

    if (p.gallery && p.gallery.length > 0) {
      const activeId = activeGalleryTab[p.id] || p.gallery[0].id;
      const activeItem = p.gallery.find((g) => g.id === activeId) || p.gallery[0];
      const tabsHtml = p.gallery
        .map((g) => {
          const isSel = g.id === activeItem.id;
          return `<button type="button" class="media-tab-btn${isSel ? " is-active" : ""}" data-gallery-proj="${escapeHtml(p.id)}" data-gallery-tab="${escapeHtml(g.id)}" aria-pressed="${isSel}">${escapeHtml(isEs ? g.labelEs : g.labelEn)}</button>`;
        })
        .join("");

      const altTxt = isEs ? activeItem.altEs : activeItem.altEn;
      return `<div class="project-media has-gallery${themeCls}">
        <div class="media-chrome-bar">
          <span class="${badgeCls}">${escapeHtml(visLabel)}</span>
          <div class="media-tabs" role="group" aria-label="${escapeHtml(isEs ? p.nameEs : p.nameEn)} views">${tabsHtml}</div>
        </div>
        <div class="media-canvas-wrap">
          <img class="project-preview-img" data-preview-img="${escapeHtml(p.id)}" src="${escapeHtml(activeItem.src)}" width="${activeItem.width}" height="${activeItem.height}" alt="${escapeHtml(altTxt)}" loading="lazy">
          <button type="button" class="media-zoom-btn" data-zoom-proj="${escapeHtml(p.id)}" aria-label="${escapeHtml(t.aria.zoomPreview)}: ${escapeHtml(isEs ? p.nameEs : p.nameEn)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            <span>${escapeHtml(t.projectsSection.zoomLabel)}</span>
          </button>
        </div>
      </div>`;
    }

    if (p.image) {
      const altTxt = isEs ? p.image.altEs : p.image.altEn;
      return `<div class="project-media${themeCls}">
        <div class="media-chrome-bar">
          <span class="${badgeCls}">${escapeHtml(visLabel)}</span>
          ${chromeMeta ? `<span class="media-chrome-meta">${escapeHtml(chromeMeta)}</span>` : ""}
        </div>
        <div class="media-canvas-wrap">
          <img class="project-preview-img" src="${escapeHtml(p.image.src)}" width="${p.image.width}" height="${p.image.height}" alt="${escapeHtml(altTxt)}" loading="lazy">
          <button type="button" class="media-zoom-btn" data-zoom-proj="${escapeHtml(p.id)}" aria-label="${escapeHtml(t.aria.zoomPreview)}: ${escapeHtml(isEs ? p.nameEs : p.nameEn)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            <span>${escapeHtml(t.projectsSection.zoomLabel)}</span>
          </button>
        </div>
      </div>`;
    }

    return `<div class="project-media is-schematic">
      <div class="media-chrome-bar">
        <span class="${badgeCls}">${escapeHtml(visLabel)}</span>
        ${chromeMeta ? `<span class="media-chrome-meta">${escapeHtml(chromeMeta)}</span>` : ""}
      </div>
      <div class="project-svg-wrap" data-svg-key="${escapeHtml(p.svgKey || "")}">${DATA.schematics[p.svgKey] || ""}</div>
    </div>`;
  }

  function buildExpandableDetails(p, t, isEs) {
    const bullets = (isEs ? projectBullets(p, true) : projectBullets(p, false))
      .map((b) => `<li>${escapeHtml(b)}</li>`)
      .join("");
    const allTags = isEs ? p.tagsEs : p.tagsEn;
    const extraTags = allTags.slice(p.coreTagCount || 4);
    const extraHtml = extraTags.length
      ? `<p class="details-extra-stack"><strong>Stack +:</strong> ${escapeHtml(extraTags.join(" · "))}</p>`
      : "";
    const note = isEs ? p.noteEs : p.noteEn;

    return `<details class="card-details">
      <summary class="card-details-summary">
        <span>${escapeHtml(t.projectsSection.expandLabel)}</span>
        <svg class="details-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div class="card-details-body">
        <ul class="card-details-bullets">${bullets}</ul>
        ${extraHtml}
        ${note ? `<p class="card-details-note">${escapeHtml(note)}</p>` : ""}
      </div>
    </details>`;
  }

  function projectBullets(p, isEs) {
    return isEs ? (p.bulletsEs || []) : (p.bulletsEn || []);
  }

  function buildFlagshipCard(p, t, isEs) {
    const kpis = (isEs ? p.kpisEs : p.kpisEn)
      .map((k) => `<span class="kpi-pill">${escapeHtml(k)}</span>`)
      .join("");

    const allTags = isEs ? p.tagsEs : p.tagsEn;
    const coreTags = allTags.slice(0, p.coreTagCount || 4);
    const extraCount = Math.max(0, allTags.length - coreTags.length);
    const techLine = coreTags.map((tg) => `<span class="tech-token">${escapeHtml(tg)}</span>`).join("") +
      (extraCount > 0 ? `<span class="tech-token tech-token-more">+${extraCount}</span>` : "");

    const primaryLinks = (p.links || []).filter((l) => l.role === "primary" || l.role === "secondary");
    const resourceLinks = (p.links || []).filter((l) => l.role === "resource");

    const mainCtasHtml = primaryLinks
      .map((lnk) => {
        const cls = lnk.role === "primary" ? "card-btn card-btn-primary card-btn-lg" : "card-btn card-btn-secondary card-btn-lg";
        const isExt = lnk.url.startsWith("http");
        const rel = isExt ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="${cls}" href="${escapeHtml(lnk.url)}"${rel}>${escapeHtml(isEs ? lnk.labelEs : lnk.labelEn)}</a>`;
      })
      .join("");

    const resourcesHtml = resourceLinks
      .map((lnk) => {
        const isExt = lnk.url.startsWith("http");
        const rel = isExt ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="resource-link" href="${escapeHtml(lnk.url)}"${rel}>${escapeHtml(isEs ? lnk.labelEs : lnk.labelEn)}</a>`;
      })
      .join("");

    return `<article class="project-card is-flagship" style="view-transition-name: proj-${escapeHtml(p.id)}" data-project-id="${escapeHtml(p.id)}" data-categories="${escapeHtml(p.categories.join(","))}">
      ${buildMediaStage(p, t, isEs)}
      <div class="project-body">
        <div class="project-meta-top">
          <span class="project-category-tag">${escapeHtml(isEs ? p.categoryLabelEs : p.categoryLabelEn)}</span>
          <span class="project-year">${escapeHtml(isEs ? p.yearEs : p.yearEn)}</span>
        </div>
        <h4 class="project-heading">
          <span class="project-name">${escapeHtml(isEs ? p.nameEs : p.nameEn)}</span>
          <span class="project-subtitle">${escapeHtml(isEs ? p.subtitleEs : p.subtitleEn)}</span>
        </h4>
        <p class="project-brief">${escapeHtml(isEs ? p.briefEs : p.briefEn)}</p>
        <div class="project-kpis">${kpis}</div>
        <div class="tech-token-row">${techLine}</div>
        <div class="flagship-cta-row">
          ${mainCtasHtml}
        </div>
        <div class="technical-resources-bar">
          <span class="resources-label">${escapeHtml(t.projectsSection.techResourcesLabel)}:</span>
          <div class="resources-links">
            ${resourcesHtml}
            <button type="button" class="resource-link resource-btn" data-open-modal="${escapeHtml(p.id)}">${escapeHtml(t.projectsSection.detailsBtn)} +</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function buildStandardOrPairCard(p, t, isEs, isFeaturedPair) {
    const kpis = (isEs ? p.kpisEs : p.kpisEn)
      .slice(0, 3)
      .map((k) => `<span class="kpi-pill">${escapeHtml(k)}</span>`)
      .join("");

    const allTags = isEs ? p.tagsEs : p.tagsEn;
    const coreTags = allTags.slice(0, p.coreTagCount || 4);
    const extraCount = Math.max(0, allTags.length - coreTags.length);
    const techLine = coreTags.map((tg) => `<span class="tech-token">${escapeHtml(tg)}</span>`).join("") +
      (extraCount > 0 ? `<span class="tech-token tech-token-more">+${extraCount}</span>` : "");

    const primaryLink = (p.links || []).find((l) => l.role === "primary");
    const extraResourceLinks = (p.links || []).filter((l) => l.role !== "primary");

    let primaryActionHtml = "";
    if (primaryLink) {
      const isExt = primaryLink.url.startsWith("http");
      const rel = isExt ? ' target="_blank" rel="noopener noreferrer"' : "";
      primaryActionHtml = `<a class="card-btn card-btn-primary" href="${escapeHtml(primaryLink.url)}"${rel}>${escapeHtml(isEs ? primaryLink.labelEs : primaryLink.labelEn)}</a>`;
    }

    const extraLinksHtml = extraResourceLinks
      .map((lnk) => {
        const isExt = lnk.url.startsWith("http");
        const rel = isExt ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="card-btn card-btn-quiet" href="${escapeHtml(lnk.url)}"${rel}>${escapeHtml(isEs ? lnk.labelEs : lnk.labelEn)}</a>`;
      })
      .join("");

    const modalBtnCls = primaryLink ? "card-btn card-btn-quiet" : "card-btn";
    const tierCls = isFeaturedPair ? `is-featured-pair layout-${escapeHtml(p.layout || "standard")}` : "is-secondary-card";

    return `<article class="project-card ${tierCls}" style="view-transition-name: proj-${escapeHtml(p.id)}" data-project-id="${escapeHtml(p.id)}" data-categories="${escapeHtml(p.categories.join(","))}">
      ${buildMediaStage(p, t, isEs)}
      <div class="project-body">
        <div class="project-meta-top">
          <span class="project-category-tag">${escapeHtml(isEs ? p.categoryLabelEs : p.categoryLabelEn)}</span>
          <span class="project-year">${escapeHtml(isEs ? p.yearEs : p.yearEn)}</span>
        </div>
        <h4 class="project-heading">
          <span class="project-name">${escapeHtml(isEs ? p.nameEs : p.nameEn)}</span>
          <span class="project-subtitle">${escapeHtml(isEs ? p.subtitleEs : p.subtitleEn)}</span>
        </h4>
        <p class="project-brief">${escapeHtml(isEs ? p.briefEs : p.briefEn)}</p>
        <div class="project-kpis">${kpis}</div>
        <div class="tech-token-row">${techLine}</div>
        ${buildExpandableDetails(p, t, isEs)}
        <div class="project-actions">
          ${primaryActionHtml}
          ${extraLinksHtml}
          <button type="button" class="${modalBtnCls}" data-open-modal="${escapeHtml(p.id)}">${escapeHtml(t.projectsSection.detailsBtn)} +</button>
        </div>
      </div>
    </article>`;
  }

  function syncTierVisibilityAndOddCards() {
    const tierFeatured = document.getElementById("projects-tier-featured");
    const flagshipSlot = document.getElementById("featured-flagship-slot");
    const pairGrid = document.getElementById("featured-pair-grid");
    const tierSecondary = document.getElementById("projects-tier-secondary");
    const secGrid = document.getElementById("secondary-projects-grid");

    if (!tierFeatured || !pairGrid || !tierSecondary || !secGrid || !flagshipSlot) return;

    const allCards = document.querySelectorAll("#projects .project-card");
    allCards.forEach((card) => {
      const cats = (card.dataset.categories || "").split(",");
      const match = currentFilter === "all" || cats.includes(currentFilter);
      card.hidden = !match;
      card.classList.remove("is-odd-tail", "is-solo-pair");
    });

    /* Balance Tier 1 Featured Pair when only 1 of the 2 pair cards matches */
    const visibleFlagship = Array.from(flagshipSlot.querySelectorAll(".project-card")).filter((c) => !c.hidden);
    const visiblePair = Array.from(pairGrid.querySelectorAll(".project-card")).filter((c) => !c.hidden);

    flagshipSlot.hidden = visibleFlagship.length === 0;
    pairGrid.hidden = visiblePair.length === 0;
    if (visiblePair.length === 1) {
      visiblePair[0].classList.add("is-solo-pair");
    }
    tierFeatured.hidden = visibleFlagship.length + visiblePair.length === 0;

    /* Balance Tier 2 Grid: when visible count is odd, last visible card becomes horizontal 2-col full-span */
    const visibleSecondary = Array.from(secGrid.querySelectorAll(".project-card")).filter((c) => !c.hidden);
    if (visibleSecondary.length % 2 === 1) {
      visibleSecondary[visibleSecondary.length - 1].classList.add("is-odd-tail");
    }
    tierSecondary.hidden = visibleSecondary.length === 0;
  }

  function renderFilterButtons(t) {
    const filterContainer = document.getElementById("project-filters");
    if (!filterContainer) return;

    filterContainer.setAttribute("aria-label", t.aria.filters);
    filterContainer.innerHTML = t.projectsSection.filters
      .map(
        (f) => `<button type="button" class="filter-chip" data-filter="${escapeHtml(f.id)}" aria-pressed="${f.id === currentFilter}">
          <span>${escapeHtml(f.label)}</span>
          <span class="filter-count">${f.count}</span>
        </button>`
      )
      .join("");

    filterContainer.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextFilter = btn.dataset.filter || "all";
        if (nextFilter === currentFilter) return;

        const applyUpdate = () => {
          currentFilter = nextFilter;
          filterContainer.querySelectorAll(".filter-chip").forEach((b) => {
            b.setAttribute("aria-pressed", String(b.dataset.filter === currentFilter));
          });
          syncTierVisibilityAndOddCards();
        };

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (document.startViewTransition && !prefersReduced) {
          document.startViewTransition(() => applyUpdate());
        } else {
          applyUpdate();
        }
      });
    });
  }

  function wireProjectCardInteractions() {
    const section = document.getElementById("projects");
    if (!section) return;

    /* Open technical specs modal */
    section.querySelectorAll("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openProjectModal(btn.dataset.openModal));
    });

    /* Switch active gallery tab inside CardioCloud, Convity, Kick Biomechanics */
    section.querySelectorAll("[data-gallery-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const projId = tabBtn.dataset.galleryProj;
        const tabId = tabBtn.dataset.galleryTab;
        const proj = DATA.projects.find((p) => p.id === projId);
        if (!proj || !proj.gallery) return;

        const targetItem = proj.gallery.find((g) => g.id === tabId);
        if (!targetItem) return;

        activeGalleryTab[projId] = tabId;
        const isEs = currentLang === "es";
        const card = tabBtn.closest(".project-card");
        if (!card) return;

        card.querySelectorAll("[data-gallery-tab]").forEach((b) => {
          const active = b.dataset.galleryTab === tabId;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        const img = card.querySelector(`[data-preview-img="${projId}"]`);
        if (img) {
          img.src = targetItem.src;
          img.width = targetItem.width;
          img.height = targetItem.height;
          img.alt = isEs ? targetItem.altEs : targetItem.altEn;
        }
      });
    });

    /* Enlarge preview in native lightbox dialog */
    section.querySelectorAll("[data-zoom-proj]").forEach((zoomBtn) => {
      zoomBtn.addEventListener("click", () => {
        const projId = zoomBtn.dataset.zoomProj;
        const proj = DATA.projects.find((p) => p.id === projId);
        if (!proj) return;
        const isEs = currentLang === "es";

        if (proj.gallery && proj.gallery.length > 0) {
          const activeId = activeGalleryTab[projId] || proj.gallery[0].id;
          const item = proj.gallery.find((g) => g.id === activeId) || proj.gallery[0];
          const label = isEs ? `${proj.nameEs} — ${item.labelEs}` : `${proj.nameEn} — ${item.labelEn}`;
          openZoomDialog(item.src, item.width, item.height, label, isEs ? item.altEs : item.altEn);
        } else if (proj.image) {
          const title = isEs ? proj.titleEs : proj.titleEn;
          openZoomDialog(proj.image.src, proj.image.width, proj.image.height, title, isEs ? proj.image.altEs : proj.image.altEn);
        }
      });
    });

    /* Observe ECOCARDIA SVG schematic once to trigger subtle sequential connector draw */
    const ecoWrap = section.querySelector('.project-svg-wrap[data-svg-key="ecocardia"]');
    if (ecoWrap) {
      if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ecoWrap.classList.add("is-drawn");
      } else {
        const rect = ecoWrap.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          ecoWrap.classList.add("is-drawn");
        } else {
          const obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) {
                  ecoWrap.classList.add("is-drawn");
                  obs.disconnect();
                }
              });
            },
            { threshold: 0.25 }
          );
          obs.observe(ecoWrap);
        }
      }
    }
  }

  function renderProjects(t, isEs) {
    renderFilterButtons(t);

    document.getElementById("tier1-eyebrow").textContent = t.projectsSection.tier1Eyebrow;
    document.getElementById("tier1-title").textContent = t.projectsSection.tier1Title;
    document.getElementById("tier2-eyebrow").textContent = t.projectsSection.tier2Eyebrow;
    document.getElementById("tier2-title").textContent = t.projectsSection.tier2Title;

    const flagship = DATA.projects.find((p) => p.layout === "flagship");
    const featuredPair = DATA.projects.filter((p) => p.tier === "featured" && p.layout !== "flagship");
    const secondary = DATA.projects.filter((p) => p.tier === "secondary");

    const flagshipSlot = document.getElementById("featured-flagship-slot");
    const pairGrid = document.getElementById("featured-pair-grid");
    const secGrid = document.getElementById("secondary-projects-grid");

    if (flagshipSlot) {
      flagshipSlot.innerHTML = flagship ? buildFlagshipCard(flagship, t, isEs) : "";
    }
    if (pairGrid) {
      pairGrid.innerHTML = featuredPair.map((p) => buildStandardOrPairCard(p, t, isEs, true)).join("");
    }
    if (secGrid) {
      secGrid.innerHTML = secondary.map((p) => buildStandardOrPairCard(p, t, isEs, false)).join("");
    }

    syncTierVisibilityAndOddCards();
    wireProjectCardInteractions();
  }

  /* ========================================================================
     5. Full Bilingual Page Render
     ======================================================================== */
  function renderAll() {
    const isEs = currentLang === "es";
    const t = DATA.ui[currentLang];

    document.documentElement.lang = currentLang;
    document.title = t.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t.metaDesc);

    document.getElementById("skip-link").textContent = t.skipLink;
    document.getElementById("primary-nav")?.setAttribute("aria-label", t.aria.primaryNav);
    document.getElementById("metrics-section")?.setAttribute("aria-label", t.aria.metrics);

    /* Desktop & Mobile navigation labels */
    const navPairs = [
      ["nav-projects", "mnav-projects", t.nav.projects],
      ["nav-research", "mnav-research", t.nav.research],
      ["nav-experience", "mnav-experience", t.nav.experience],
      ["nav-stack", "mnav-stack", t.nav.stack],
      ["nav-credentials", "mnav-credentials", t.nav.credentials],
      ["nav-contact", "mnav-contact", t.nav.contact]
    ];
    navPairs.forEach(([deskId, mobId, label]) => {
      const d = document.getElementById(deskId);
      const m = document.getElementById(mobId);
      if (d) d.textContent = label;
      if (m) m.textContent = label;
    });

    for (const [linkId, textId] of [["nav-cv-link", "nav-cv-text"], ["mnav-cv-link", "mnav-cv-text"]]) {
      const lnk = document.getElementById(linkId);
      const txt = document.getElementById(textId);
      if (lnk) {
        lnk.href = t.cvHref;
        lnk.setAttribute("download", t.cvFilename);
      }
      if (txt) txt.textContent = t.nav.downloadCv;
    }

    const menuBtn = document.getElementById("mobile-menu-btn");
    if (menuBtn) {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-label", open ? t.aria.mobileMenuClose : t.aria.mobileMenuOpen);
    }

    const langBtn = document.getElementById("lang-toggle");
    langBtn.textContent = t.langBtnLabel;
    langBtn.setAttribute("aria-label", t.langBtnTitle);
    langBtn.setAttribute("title", t.langBtnTitle);

    const themeBtn = document.getElementById("theme-toggle");
    themeBtn.setAttribute("aria-label", t.themeToggleLabel);
    themeBtn.setAttribute("title", t.themeToggleLabel);

    /* Hero */
    document.getElementById("hero-institution-text").textContent = t.hero.institution;
    document.getElementById("hero-location-text").textContent = t.hero.location;
    document.getElementById("hero-specialty").textContent = t.hero.specialty;
    document.getElementById("hero-badges").innerHTML = t.hero.badges
      .map((b, i) => `<span class="role-badge ${i > 0 ? "role-badge-outline" : ""}">${escapeHtml(b)}</span>`)
      .join("");
    document.getElementById("hero-lead").innerHTML = t.hero.lead;
    document.getElementById("hero-pillars").innerHTML = t.hero.pillars
      .map((p) => `<li>${escapeHtml(p)}</li>`)
      .join("");

    document.getElementById("hero-cta-primary-text").textContent = t.hero.ctaPrimary;
    const heroCv = document.getElementById("hero-cv-link");
    heroCv.href = t.cvHref;
    heroCv.setAttribute("download", t.cvFilename);
    document.getElementById("hero-cv-text").textContent = t.hero.ctaCv;

    const portraitImg = document.getElementById("hero-portrait-img");
    if (portraitImg) portraitImg.alt = t.hero.portraitAlt;
    document.getElementById("portrait-role-text").textContent = t.hero.portraitRole;
    document.getElementById("portrait-meta-text").textContent = t.hero.portraitMeta;

    /* Key Impact Metrics */
    document.getElementById("metrics-grid").innerHTML = t.metrics
      .map(
        (m) => `<div class="metric-item">
          <span class="metric-tag">${escapeHtml(m.tag)}</span>
          <span class="metric-value">${escapeHtml(m.value)}</span>
          <span class="metric-label">${escapeHtml(m.label)}</span>
        </div>`
      )
      .join("");

    /* Section 01: Projects */
    document.getElementById("projects-eyebrow").textContent = t.projectsSection.eyebrow;
    document.getElementById("projects-title").textContent = t.projectsSection.title;
    document.getElementById("projects-subtitle").textContent = t.projectsSection.subtitle;
    renderProjects(t, isEs);

    /* Section 02: Scientific Publications & Clinical Trials */
    document.getElementById("research-eyebrow").textContent = t.researchSection.eyebrow;
    document.getElementById("research-title").textContent = t.researchSection.title;
    document.getElementById("research-subtitle").textContent = t.researchSection.subtitle;
    document.getElementById("preprint-tag").textContent = t.researchSection.preprintTag;
    document.getElementById("preprint-author-role").textContent = t.researchSection.preprintAuthorRole;
    document.getElementById("preprint-title").textContent = t.researchSection.preprintTitle;
    document.getElementById("preprint-authors").textContent = t.researchSection.preprintAuthors;
    document.getElementById("preprint-highlights").innerHTML = t.researchSection.preprintHighlights
      .map(
        (h) => `<div class="benchmark-cell">
          <strong class="benchmark-val">${escapeHtml(h.k)}</strong>
          <span class="benchmark-desc">${escapeHtml(h.v)}</span>
        </div>`
      )
      .join("");
    document.getElementById("preprint-summary").textContent = t.researchSection.preprintSummary;
    document.getElementById("preprint-primary-doi").textContent = t.researchSection.primaryDoiLabel;
    document.getElementById("preprint-zenodo-link").textContent = t.researchSection.zenodoLabel;
    document.getElementById("preprint-orcid-link").textContent = t.researchSection.orcidLabel;

    document.getElementById("trials-tag").textContent = t.researchSection.trialsTag;
    document.getElementById("trials-title").textContent = t.researchSection.trialsTitle;
    document.getElementById("trials-intro").textContent = t.researchSection.trialsIntro;
    document.getElementById("trials-list").innerHTML = t.researchSection.trials
      .map(
        (tr) => `<article class="trial-ledger-item">
          <div class="trial-ledger-top">
            <div>
              <strong class="trial-name">${escapeHtml(tr.name)}</strong>
              <span class="trial-scope">${escapeHtml(tr.scope)}</span>
            </div>
            <a class="nct-link" href="${escapeHtml(tr.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tr.nct)} ↗</a>
          </div>
          <p class="trial-desc">${escapeHtml(tr.desc)}</p>
        </article>`
      )
      .join("");

    /* Section 03: Career Experience Timeline */
    document.getElementById("exp-eyebrow").textContent = t.experienceSection.eyebrow;
    document.getElementById("exp-title").textContent = t.experienceSection.title;
    document.getElementById("exp-subtitle").textContent = t.experienceSection.subtitle;
    document.getElementById("experience-timeline").innerHTML = t.experienceSection.items
      .map(
        (item) => `<article class="timeline-entry${item.current ? " is-current" : ""}">
          <div class="timeline-rail">
            <span class="timeline-period">${escapeHtml(item.period)}</span>
            <span class="timeline-meta-sub">${escapeHtml(item.location)}</span>
            ${item.current ? `<span class="timeline-current-pill">${escapeHtml(t.experienceSection.currentBadge)}</span>` : ""}
          </div>
          <div class="timeline-node" aria-hidden="true"></div>
          <div class="timeline-content">
            <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
            <p class="timeline-org">${escapeHtml(item.org)}</p>
            <p class="timeline-desc">${escapeHtml(item.desc)}</p>
          </div>
        </article>`
      )
      .join("");

    /* Section 04: Technical Stack Matrix */
    document.getElementById("stack-eyebrow").textContent = t.stackSection.eyebrow;
    document.getElementById("stack-title").textContent = t.stackSection.title;
    document.getElementById("stack-subtitle").textContent = t.stackSection.subtitle;
    const totalGroups = t.stackSection.groups.length;
    document.getElementById("stack-grid").innerHTML = t.stackSection.groups
      .map((g, idx) => {
        const isLastOdd = totalGroups % 2 === 1 && idx === totalGroups - 1;
        const coreTokens = g.core.map((c) => `<span class="stack-core-pill">${escapeHtml(c)}</span>`).join("");
        const extraLine = g.extra.map((e) => `<span class="stack-extra-item">${escapeHtml(e)}</span>`).join("");
        return `<div class="stack-domain${isLastOdd ? " is-full-span" : ""}">
          <div class="stack-domain-head">
            <span class="stack-index">${escapeHtml(g.index)}</span>
            <h3>${escapeHtml(g.title)}</h3>
          </div>
          <div class="stack-domain-body">
            <div class="stack-core-row" aria-label="${escapeHtml(t.stackSection.coreLabel)}">${coreTokens}</div>
            <div class="stack-extra-row" aria-label="${escapeHtml(t.stackSection.extraLabel)}">${extraLine}</div>
          </div>
        </div>`;
      })
      .join("");

    /* Section 05: Education & Certifications */
    document.getElementById("cred-eyebrow").textContent = t.credentialsSection.eyebrow;
    document.getElementById("cred-title").textContent = t.credentialsSection.title;
    document.getElementById("cred-subtitle").textContent = t.credentialsSection.subtitle;
    document.getElementById("edu-col-title").textContent = t.credentialsSection.eduTitle;
    document.getElementById("certs-featured-title").textContent = t.credentialsSection.certsFeaturedTitle;
    document.getElementById("certs-additional-title").textContent = t.credentialsSection.certsAdditionalTitle;

    const primaryEdu = t.credentialsSection.education.filter((e) => e.primary);
    const secondaryEdu = t.credentialsSection.education.filter((e) => !e.primary);

    document.getElementById("education-list").innerHTML =
      primaryEdu
        .map(
          (ed) => `<article class="edu-degree-card">
            <div class="edu-degree-top">
              <h4>${escapeHtml(ed.degree)}</h4>
              <span class="edu-period">${escapeHtml(ed.period)}</span>
            </div>
            <p class="edu-school">${escapeHtml(ed.school)}</p>
            <span class="grade-badge">${escapeHtml(ed.badge)}</span>
          </article>`
        )
        .join("") +
      `<div class="edu-footnotes">
        ${secondaryEdu
          .map(
            (ed) => `<div class="edu-footnote-row">
              <div>
                <strong>${escapeHtml(ed.degree)}</strong>
                <span class="edu-footnote-meta">${escapeHtml(ed.school)} · ${escapeHtml(ed.period)}</span>
              </div>
              <span class="edu-footnote-grade">${escapeHtml(ed.badge)}</span>
            </div>`
          )
          .join("")}
        <div class="edu-footnote-row is-languages">
          <strong>${escapeHtml(t.credentialsSection.languagesLabel)}</strong>
          <span>${escapeHtml(t.credentialsSection.languagesLine)}</span>
        </div>
      </div>`;

    const featuredCerts = t.credentialsSection.certs.filter((c) => c.featured);
    const additionalCerts = t.credentialsSection.certs.filter((c) => !c.featured);

    document.getElementById("certs-featured-list").innerHTML = featuredCerts
      .map(
        (c) => `<article class="cert-featured-row">
          <div class="cert-featured-main">
            <div class="cert-meta-line">
              <span class="cert-issuer">${escapeHtml(c.issuer)}</span>
              <span class="cert-kind-badge">${escapeHtml(c.kind)}</span>
              <span class="cert-date">${escapeHtml(c.date)}</span>
            </div>
            <p class="cert-title">${escapeHtml(c.title)}</p>
          </div>
          ${c.url ? `<a class="cert-verify-btn" href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.linkLabel)}</a>` : ""}
        </article>`
      )
      .join("");

    document.getElementById("certs-additional-list").innerHTML = additionalCerts
      .map(
        (c) => `<div class="cert-ledger-row">
          <div class="cert-ledger-title-wrap">
            <span class="cert-ledger-title">${escapeHtml(c.title)}</span>
            <span class="cert-ledger-kind">${escapeHtml(c.kind)}</span>
          </div>
          <div class="cert-ledger-meta">
            <span class="cert-ledger-issuer">${escapeHtml(c.issuer)}</span>
            <span class="cert-ledger-year">${escapeHtml(c.date)}</span>
          </div>
        </div>`
      )
      .join("");

    /* Section 06: Contact & Footer */
    document.getElementById("contact-eyebrow").textContent = t.contactSection.eyebrow;
    document.getElementById("contact-title").textContent = t.contactSection.title;
    document.getElementById("contact-desc").textContent = t.contactSection.desc;
    document.getElementById("contact-primary-email-text").textContent = t.contactSection.primaryEmailBtn;
    document.getElementById("copy-email-text").textContent = t.contactSection.copyEmailBtn;
    document.getElementById("contact-cv-label").textContent = t.contactSection.cvGroupLabel;
    document.getElementById("cv-es-btn-text").textContent = t.contactSection.cvEsBtn;
    document.getElementById("cv-en-btn-text").textContent = t.contactSection.cvEnBtn;

    document.getElementById("contact-channels").innerHTML = t.contactSection.channels
      .map((ch) => {
        const rel = ch.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="channel-link" href="${escapeHtml(ch.url)}"${rel}>
          <span class="channel-title">${escapeHtml(ch.title)}</span>
          <span class="channel-meta">${escapeHtml(ch.meta)}</span>
        </a>`;
      })
      .join("");

    document.getElementById("footer-left").textContent = t.footer.left;
    document.getElementById("footer-right").textContent = t.footer.right;
  }

  /* ========================================================================
     6. Once-Only Progressive Section Reveals (safe against low-opacity traps)
     ======================================================================== */
  function initScrollReveals() {
    const targets = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!targets.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("is-reveal-armed");
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 1.02) {
        el.classList.add("is-revealed");
      } else {
        el.classList.add("is-reveal-armed");
        observer.observe(el);
      }
    });
  }

  /* ========================================================================
     7. Bootstrapping
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const savedLang = safeGetStorage("portfolio-lang");
    if (urlLang === "en" || urlLang === "es") {
      currentLang = urlLang;
    } else if (savedLang === "en" || savedLang === "es") {
      currentLang = savedLang;
    }

    initThemeToggle();
    wireDialog(document.getElementById("project-dialog"));
    wireDialog(document.getElementById("zoom-dialog"));
    renderAll();
    initNavigation();
    initScrollReveals();

    document.getElementById("lang-toggle")?.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      safeSetStorage("portfolio-lang", currentLang);
      renderAll();
    });

    const copyBtn = document.getElementById("copy-email-btn");
    const copyTxt = document.getElementById("copy-email-text");
    const feedbackPill = document.getElementById("copy-feedback-pill");

    copyBtn?.addEventListener("click", async () => {
      const t = DATA.ui[currentLang];
      try {
        await navigator.clipboard.writeText(EMAIL);
        copyBtn.classList.add("is-copied");
        if (copyTxt) copyTxt.textContent = t.contactSection.copiedMsg;
        if (feedbackPill) {
          feedbackPill.textContent = t.contactSection.copiedMsg;
          feedbackPill.classList.add("is-visible");
        }
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          copyBtn.classList.remove("is-copied");
          if (copyTxt) copyTxt.textContent = DATA.ui[currentLang].contactSection.copyEmailBtn;
          if (feedbackPill) {
            feedbackPill.classList.remove("is-visible");
            feedbackPill.textContent = "";
          }
        }, 2800);
      } catch {
        window.location.href = `mailto:${EMAIL}`;
      }
    });
  });
})();
