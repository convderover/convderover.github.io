"use strict";
const menu = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  }
});
const viewer = document.querySelector("#image-viewer");
const viewerImage = document.querySelector("#viewer-image");
const viewerCaption = document.querySelector("#viewer-caption");
document.querySelectorAll("[data-zoom]").forEach((button) =>
  button.addEventListener("click", () => {
    viewerImage.src = button.dataset.zoom;
    viewerImage.alt = button.querySelector("img").alt;
    viewerCaption.textContent = button.dataset.caption;
    viewer.showModal();
  }),
);
document
  .querySelector(".viewer-close")
  .addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      viewer.close();
  }
});
const traceCanvas = document.querySelector("#signature");
const traceContext = traceCanvas.getContext("2d");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
// Original public ECG9 lead II samples are injected by the local asset builder.
const trace = window.CARDIOCLOUD_TRACE || [];
let signalGain = 1;
function drawTrace(fraction = 1) {
  const width = traceCanvas.width,
    height = traceCanvas.height;
  traceContext.clearRect(0, 0, width, height);
  if (!trace.length) return;
  const extent = Math.max(...trace.map(Math.abs)) || 1;
  traceContext.strokeStyle = "#67bcb3";
  traceContext.lineWidth = 1.1;
  traceContext.beginPath();
  const end = Math.max(2, Math.floor(trace.length * fraction));
  for (let i = 0; i < end; i++) {
    const x = (i / (trace.length - 1)) * width,
      y = height * 0.52 - (trace[i] / extent) * height * 0.42 * signalGain;
    i ? traceContext.lineTo(x, y) : traceContext.moveTo(x, y);
  }
  traceContext.stroke();
}
if (trace.length) {
  if (reducedMotion) drawTrace();
  else {
    let start;
    function animate(time) {
      start ??= time;
      const fraction = Math.min((time - start) / 1600, 1);
      drawTrace(fraction);
      if (fraction < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
}

// Local controls and progressive disclosure; no live AWS requests.
document.querySelectorAll("[data-signal-gain]").forEach((button) =>
  button.addEventListener("click", () => {
    signalGain = Number(button.dataset.signalGain);
    document
      .querySelectorAll("[data-signal-gain]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    drawTrace();
  }),
);
if (!reducedMotion && window.Motion?.animate) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.Motion.animate(
            entry.target,
            { opacity: [0.5, 1], y: [18, 0] },
            { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          );
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(
      ".role-decisions>div,.experience-flow>li,.architecture-layer,.proof-outcomes>div,.lifecycle>li",
    )
    .forEach((el) => observer.observe(el));
}
document.querySelectorAll(".architecture-layer").forEach((layer) =>
  layer.addEventListener("toggle", () => {
    if (layer.open && !reducedMotion && window.Motion?.animate)
      window.Motion.animate(
        layer.querySelector("ul"),
        { opacity: [0.4, 1], y: [-6, 0] },
        { duration: 0.3 },
      );
  }),
);
