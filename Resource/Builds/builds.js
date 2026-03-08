/**
 * APEX MONSTERVERSE — builds.js
 * Shared JS for all 4 destination build pages.
 * Each page sets window.BUILD_CONFIG before this script loads.
 *
 * Required window.BUILD_CONFIG shape:
 * {
 *   loaderStatuses: string[],
 *   loaderTitle: string,       // e.g. "APEX × GODZILLA"
 *   charColor: string,         // e.g. "#1a6dff"
 *   formSuccessColor: string,  // e.g. "#1a6dff"
 * }
 */

(function () {
  const CFG = window.BUILD_CONFIG || {
    loaderStatuses: ["INITIALIZING SYSTEM...", "LOADING ASSETS...", "SYSTEM READY."],
    loaderTitle: "APEX",
    charColor: "#f56e0f",
    formSuccessColor: "#f56e0f",
  };

  /* ─── PAGE LOADER ─── */
  const loaderStatusEl = document.getElementById("loaderStatus");
  const loaderBarEl    = document.getElementById("loaderBar");
  let loaderProgress   = 0;
  let statusIdx        = 0;

  const loaderInterval = setInterval(() => {
    loaderProgress += Math.random() * 22 + 10;
    if (loaderProgress > 100) loaderProgress = 100;

    loaderBarEl.style.width = loaderProgress + "%";
    statusIdx = Math.min(
      Math.floor((loaderProgress / 100) * CFG.loaderStatuses.length),
      CFG.loaderStatuses.length - 1
    );
    loaderStatusEl.textContent = CFG.loaderStatuses[statusIdx];

    if (loaderProgress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        document.getElementById("pageLoader").classList.add("hidden");
        document.body.classList.add("loaded");
        initPage();
      }, 500);
    }
  }, 180);

  /* ─── CUSTOM CURSOR (desktop only) ─── */
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (dot && ring && window.innerWidth > 768 && !window.matchMedia("(pointer: coarse)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top  = mouseY + "px";
    });

    (function animateCursor() {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll("a, button, .ca-rail-item, .ca-dot, .stat-block").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("expanded");
        dot.classList.add("hidden");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("expanded");
        dot.classList.remove("hidden");
      });
    });

    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });
  } else if (dot && ring) {
    dot.style.display  = "none";
    ring.style.display = "none";
  }

  /* ─── NAVBAR SCROLL STATE + SCROLL PROGRESS ─── */
  const nav         = document.getElementById("globalNav");
  const progressBar = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 60);
    if (progressBar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (y / total * 100) + "%" : "0%";
    }
  }, { passive: true });

  /* ─── COMPONENT INSPECTOR ─── */
  const railItems = [...document.querySelectorAll(".ca-rail-item")];
  const panels    = [...document.querySelectorAll(".ca-panel")];
  const dots      = [...document.querySelectorAll(".ca-dot")];
  const progFill  = document.getElementById("caProgFill");
  let active      = 0;

  function go(idx) {
    idx = ((idx % panels.length) + panels.length) % panels.length;
    if (idx === active) return;
    active = idx;
    render();
  }

  function render() {
    railItems.forEach((el, i) => el.classList.toggle("active", i === active));
    panels.forEach((el, i)    => el.classList.toggle("active", i === active));
    dots.forEach((el, i)      => el.classList.toggle("active", i === active));
    if (progFill) progFill.style.height = ((active + 1) / panels.length) * 80 + 10 + "%";
  }

  railItems.forEach((el) => el.addEventListener("click", () => go(+el.dataset.idx)));
  dots.forEach((el)      => el.addEventListener("click", () => go(+el.dataset.idx)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(active + 1);
    if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  go(active - 1);
  });

  render();

  /* ─── FORM HANDLER ─── */
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const btn    = e.target.querySelector(".terminal-btn");
    const span   = btn ? btn.querySelector("span") : null;

    // Validate
    let valid = true;
    e.target.querySelectorAll("[required]").forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = "rgba(239,68,68,0.7)";
        field.addEventListener("input", () => { field.style.borderColor = ""; }, { once: true });
      }
    });
    if (!valid) return;

    if (btn && span) {
      span.textContent = "SLOT SECURED — CONCIERGE NOTIFIED";
      btn.style.background  = CFG.formSuccessColor;
      btn.style.boxShadow   = `0 0 40px ${CFG.charColor}88`;
      btn.disabled          = true;
    }
  };

  /* ─── GSAP ANIMATIONS (called after loader) ─── */
  function initPage() {
    if (typeof gsap === "undefined") {
      // Graceful fallback: show everything
      document.querySelectorAll(".reveal-fade, .reveal-up, .title-word, .hero-edition-badge, .section-label, .hero-desc, .unit-counter, .hero-action, .hero-visual-frame").forEach((el) => {
        el.style.opacity   = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Hero title words stagger */
    gsap.fromTo(
      ".title-word",
      { opacity: 0, y: 50, skewX: -6 },
      { opacity: 1, y: 0, skewX: 0, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.1 }
    );

    /* Hero content stagger */
    gsap.fromTo(
      ".section-label, .hero-edition-badge, .hero-desc, .unit-counter, .hero-action",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power3.out", delay: 0.5 }
    );

    /* Hero visual frame */
    gsap.fromTo(
      ".hero-visual-frame",
      { opacity: 0, scale: 0.88, x: 50 },
      { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );

    /* Scroll reveals — .reveal-fade */
    gsap.utils.toArray(".reveal-fade").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
        }
      );
    });

    /* Scroll reveals — .reveal-up */
    gsap.utils.toArray(".reveal-up").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 52 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: i * 0.07,
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" }
        }
      );
    });

    /* FPS bars — scroll-triggered width animation */
    ScrollTrigger.create({
      trigger: ".fps-list",
      start: "top 82%",
      onEnter: () => {
        document.querySelectorAll(".fps-bar").forEach((bar) => {
          gsap.to(bar, {
            width: bar.dataset.width + "%",
            duration: 1.5, ease: "power3.out", delay: Math.random() * 0.2
          });
        });
      },
    });

    /* Stat blocks stagger */
    gsap.utils.toArray(".stat-block").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".stat-blocks", start: "top 82%", toggleActions: "play none none none" }
        }
      );
    });

    /* Arsenal items slide-in from right */
    gsap.utils.toArray(".arsenal-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 91%", toggleActions: "play none none none" }
        }
      );
    });

    /* Footer closing title */
    gsap.fromTo(
      ".closing-title",
      { opacity: 0, y: 70, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".closing-title", start: "top 85%", toggleActions: "play none none none" }
      }
    );
  }

})();
