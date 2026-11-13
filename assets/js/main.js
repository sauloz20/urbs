
"use strict";

/* =====================================
   URBS — MENU, SCROLL E ANIMAÇÕES
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const progress = document.querySelector(".scroll-progress span");

  // MENU MOBILE

  const closeMenu = () => {
    nav?.classList.remove("is-open");

    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Abrir navegação");
  };

  menuButton?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open") ?? false;

    menuButton.setAttribute("aria-expanded", String(open));

    menuButton.setAttribute(
      "aria-label",
      open ? "Fechar navegação" : "Abrir navegação"
    );
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // VÍDEO DO HERO

  const video = document.querySelector(".hero-video");

  video?.addEventListener("error", () => {
    video.classList.add("video-unavailable");
  });

  // ACESSIBILIDADE

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // BARRA DE PROGRESSO

  const updateProgress = () => {
    if (!progress) return;

    const max =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = max > 0
      ? window.scrollY / max
      : 0;

    progress.style.transform = `scaleX(${percentage})`;
  };

  window.addEventListener("scroll", updateProgress, {
    passive: true
  });

  updateProgress();

  if (reduceMotion) return;

  // LENIS — SCROLL SUAVE

  if (window.Lenis) {

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.35
    });

    if (window.gsap && window.ScrollTrigger) {

      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add(time => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

    } else {

      const raf = time => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
    }
  }

  // FALLBACK CASO GSAP NÃO CARREGUE

  if (!window.gsap) {

    document.querySelectorAll(".reveal").forEach(element => {
      element.classList.add("is-visible");
    });

    return;
  }

  // ANIMAÇÃO DO HEADER

  gsap.from(".site-header", {
    y: -22,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });

  // ANIMAÇÃO DE ENTRADA DO HERO

  gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  })

    .from(".hero-eyebrow", {
      y: 18,
      opacity: 0,
      duration: 0.65
    }, 0.15)

    .from(".hero h1", {
      y: 60,
      opacity: 0,
      duration: 1.05
    }, 0.28)

    .from(".hero-description, .round-link", {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12
    }, 0.7)

    .from(".hero-meta", {
      opacity: 0,
      duration: 0.65
    }, 0.95);

  // ANIMAÇÕES DE SCROLL

  if (window.ScrollTrigger) {

    gsap.registerPlugin(ScrollTrigger);

    const revealElements = gsap.utils.toArray(
      [
        ".section-kicker",
        ".intro h2",
        ".intro-copy",
        ".principles article",
        ".statement-content > *",
        ".gallery-heading > *",
        ".issue-card",
        ".process-heading > *",
        ".process-item",
        ".map-teaser-content > *",
        ".project-note-inner > *"
      ].join(",")
    );

    revealElements.forEach(element => {

      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",

        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });

    });

    // PARALLAX DO VÍDEO

    if (document.querySelector(".hero-video")) {

      gsap.to(".hero-video", {
        scale: 1.09,
        ease: "none",

        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

    }

    // PARALLAX DA IMAGEM DO MANIFESTO

    if (document.querySelector(".statement-image")) {

      gsap.to(".statement-image", {
        yPercent: 8,
        ease: "none",

        scrollTrigger: {
          trigger: ".statement",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }

  }

});


/* =====================================
   URBS — CARROSSEL DE ETAPAS
===================================== */

(() => {

  const track = document.querySelector("#urbsTrack");

  const viewport = document.querySelector(
    ".urbs-carousel-viewport"
  );

  const cards = [
    ...document.querySelectorAll(".urbs-carousel-card")
  ];

  if (!track || !viewport || !cards.length) {
    return;
  }

  const prev = document.querySelector("#urbsPrev");
  const next = document.querySelector("#urbsNext");
  const progress = document.querySelector("#urbsProgress");
  const counter = document.querySelector("#urbsCounter");

  let currentIndex = 0;
  let startX = 0;
  let dragging = false;

  // QUANTIDADE DE CARDS VISÍVEIS

  function getVisibleCards() {

    if (window.innerWidth <= 600) return 1;

    if (window.innerWidth <= 900) return 2;

    return 3;
  }

  // ÍNDICE MÁXIMO

  function getMaxIndex() {

    return Math.max(
      0,
      cards.length - getVisibleCards()
    );
  }

  // ATUALIZAÇÃO DO CARROSSEL

  function updateCarousel() {

    const cardWidth = cards[0].getBoundingClientRect().width;

    const gap =
      parseFloat(getComputedStyle(track).gap) || 0;

    track.style.transform =
      `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    const total = getMaxIndex() + 1;

    if (progress) {

      progress.style.width =
        `${((currentIndex + 1) / total) * 100}%`;
    }

    if (counter) {

      counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }

    if (prev && next) {

      prev.disabled = currentIndex === 0;

      next.disabled = currentIndex === getMaxIndex();

      prev.style.opacity = prev.disabled ? ".35" : "1";

      next.style.opacity = next.disabled ? ".35" : "1";
    }

  }

  // NAVEGAÇÃO

  function goTo(index) {

    currentIndex = Math.max(
      0,
      Math.min(index, getMaxIndex())
    );

    updateCarousel();
  }

  prev?.addEventListener("click", () => {
    goTo(currentIndex - 1);
  });

  next?.addEventListener("click", () => {
    goTo(currentIndex + 1);
  });

  window.addEventListener("resize", updateCarousel);

  // DESLIZAMENTO COM MOUSE OU TOQUE

  viewport.addEventListener("pointerdown", event => {

    startX = event.clientX;

    dragging = true;
  });

  viewport.addEventListener("pointerup", event => {

    if (!dragging) return;

    const distance = event.clientX - startX;

    if (Math.abs(distance) > 50) {

      goTo(
        currentIndex + (distance < 0 ? 1 : -1)
      );
    }

    dragging = false;
  });

  viewport.addEventListener("pointercancel", () => {
    dragging = false;
  });

  updateCarousel();

})();


/* =====================================
   URBS — IMAGE TRAIL
   RASTRO DE IMAGENS NOS CARDS
===================================== */

(() => {

  const carouselCards = document.querySelectorAll(
    ".urbs-carousel-card"
  );

  carouselCards.forEach(card => {

    const imgElement = card.querySelector(
      ".urbs-card-image img"
    );

    if (!imgElement) return;

    let lastTime = 0;

    const throttleInterval = 60;

    card.addEventListener("mousemove", event => {

      const now = Date.now();

      if (now - lastTime < throttleInterval) return;

      lastTime = now;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clone = document.createElement("img");

      clone.src = imgElement.src;

      clone.className = "urbs-mouse-clone";

      clone.style.left = `${x}px`;
      clone.style.top = `${y}px`;

      card.appendChild(clone);

      setTimeout(() => {
        clone.remove();
      }, 600);

    });

  });

})();
