
(() => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const touchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)"
  ).matches;

  if (reducedMotion || touchDevice) return;

  // Evita inicialização duplicada
  if (document.querySelector(".urbs-liquid-cursor")) return;

  // Alvos visuais que podem receber a refração
  const targetSelector = [
    ".hero-video",
    ".statement-image",
    ".issue-card img",
    ".urbs-card-image img",
    ".map-teaser-bg"
  ].join(",");

  // Filtro SVG
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.classList.add("urbs-liquid-definitions");
  svg.setAttribute("aria-hidden", "true");

  svg.innerHTML = `
    <filter
      id="urbs-liquid-filter"
      x="-15%"
      y="-15%"
      width="130%"
      height="130%"
      color-interpolation-filters="sRGB"
    >
      <feTurbulence
        id="urbs-liquid-turbulence"
        type="fractalNoise"
        baseFrequency="0.012 0.018"
        numOctaves="2"
        seed="3"
        result="noise"
      />

      <feDisplacementMap
        id="urbs-liquid-displacement"
        in="SourceGraphic"
        in2="noise"
        scale="0"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  `;

  document.body.prepend(svg);

  // Elemento visual das ondas
  const cursor = document.createElement("div");
  cursor.className = "urbs-liquid-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  const displacement = svg.querySelector(
    "#urbs-liquid-displacement"
  );

  const turbulence = svg.querySelector(
    "#urbs-liquid-turbulence"
  );

  let activeTarget = null;
  let mouseX = -200;
  let mouseY = -200;
  let currentScale = 0;
  let targetScale = 0;
  let previousX = 0;
  let previousY = 0;
  let lastMovement = 0;

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  function activateTarget(target) {
    if (activeTarget === target) return;

    if (activeTarget) {
      activeTarget.classList.remove("is-liquid-active");
    }

    activeTarget = target;

    if (activeTarget) {
      activeTarget.classList.add("urbs-liquid-target");
      activeTarget.classList.add("is-liquid-active");
    }
  }

  function handlePointerMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.classList.add("is-visible");

    const speed = Math.hypot(
      mouseX - previousX,
      mouseY - previousY
    );

    previousX = mouseX;
    previousY = mouseY;
    lastMovement = performance.now();

    const element = document.elementFromPoint(mouseX, mouseY);
    const target = element?.closest(targetSelector);

    activateTarget(target || null);

    // A intensidade depende da velocidade do movimento
    targetScale = target
      ? clamp(8 + speed * 0.65, 8, 34)
      : 0;
  }

  function handlePointerLeave() {
    targetScale = 0;
    cursor.classList.remove("is-visible");
    activateTarget(null);
  }

  function animate() {
    // Suaviza a intensidade da refração
    currentScale += (targetScale - currentScale) * 0.14;

    displacement.setAttribute(
      "scale",
      currentScale.toFixed(2)
    );

    // Movimento sutil da textura líquida
    const time = performance.now() * 0.00001;

    turbulence.setAttribute(
      "baseFrequency",
      `${(0.012 + Math.sin(time) * 0.002).toFixed(4)} 0.018`
    );

    // Esconde o círculo quando o mouse fica parado
    if (performance.now() - lastMovement > 700) {
      cursor.classList.remove("is-visible");
    }

    requestAnimationFrame(animate);
  }

  document.addEventListener(
    "pointermove",
    handlePointerMove,
    { passive: true }
  );

  document.documentElement.addEventListener(
    "pointerleave",
    handlePointerLeave
  );

  window.addEventListener("blur", handlePointerLeave);

  requestAnimationFrame(animate);
})();
