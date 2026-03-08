/* ─── PAGE LOADER ─── */
const loaderStatuses = [
  "INITIALIZING SYSTEM...",
  "LOADING MIKU ASSETS...",
  "CALIBRATING RGB...",
  "ENGAGING TEAL LOOP...",
  "SYSTEM READY.",
];
let statusIdx = 0;
const loaderStatusEl = document.getElementById("loaderStatus");
const loaderBarEl = document.getElementById("loaderBar");
let loaderProgress = 0;

const loaderInterval = setInterval(() => {
  loaderProgress += Math.random() * 22 + 10;
  if (loaderProgress > 100) loaderProgress = 100;
  loaderBarEl.style.width = loaderProgress + "%";
  statusIdx = Math.min(
    Math.floor((loaderProgress / 100) * loaderStatuses.length),
    loaderStatuses.length - 1,
  );
  loaderStatusEl.textContent = loaderStatuses[statusIdx];
  if (loaderProgress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      document.getElementById("pageLoader").classList.add("hidden");
      document.body.classList.add("loaded");
      initAnimations();
    }, 500);
  }
}, 180);

/* ─── CUSTOM CURSOR ─── */
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});
(function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateCursor);
})();
document.querySelectorAll("a, button, .ca-rail-item, .ca-dot").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    ring.classList.add("expanded");
    dot.classList.add("hidden");
  });
  el.addEventListener("mouseleave", () => {
    ring.classList.remove("expanded");
    dot.classList.remove("hidden");
  });
});

/* ─── NAVBAR SCROLL ─── */
const nav = document.getElementById("globalNav");
window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 60),
);

/* ─── COMPONENT INSPECTOR ─── */
const railItems = [...document.querySelectorAll(".ca-rail-item")];
const panels = [...document.querySelectorAll(".ca-panel")];
const dots = [...document.querySelectorAll(".ca-dot")];
const progFill = document.getElementById("caProgFill");
let active = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowRight") go(active + 1);
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(active - 1);
});
railItems.forEach((el) =>
  el.addEventListener("click", () => go(+el.dataset.idx)),
);
dots.forEach((el) => el.addEventListener("click", () => go(+el.dataset.idx)));

function go(idx) {
  idx = ((idx % panels.length) + panels.length) % panels.length;
  if (idx === active) return;
  active = idx;
  render();
}
function render() {
  railItems.forEach((el, i) => el.classList.toggle("active", i === active));
  panels.forEach((el, i) => el.classList.toggle("active", i === active));
  dots.forEach((el, i) => el.classList.toggle("active", i === active));
  progFill.style.height = ((active + 1) / panels.length) * 80 + 10 + "%";
}
render();

/* ─── FORM ─── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".terminal-btn");
  btn.querySelector("span").textContent = "SLOT SECURED — CONCIERGE NOTIFIED";
  btn.style.background = "var(--miku-magenta)";
  btn.style.boxShadow = "0 0 40px rgba(227,0,127,0.5)";
}

/* ─── GSAP ANIMATIONS ─── */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero title */
  gsap.fromTo(
    ".title-word",
    { opacity: 0, y: 50, skewX: -6 },
    {
      opacity: 1,
      y: 0,
      skewX: 0,
      duration: 1,
      stagger: 0.18,
      ease: "power4.out",
      delay: 0.1,
    },
  );

  /* Hero elements stagger */
  gsap.fromTo(
    ".hero-label, .hero-edition-badge, .hero-desc, .unit-counter, .hero-action",
    {
      opacity: 0,
      y: 28,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.5,
    },
  );

  /* Hero visual frame */
  gsap.fromTo(
    ".hero-visual-frame",
    { opacity: 0, scale: 0.9, x: 50 },
    {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
    },
  );

  /* Scroll reveals */
  gsap.utils.toArray(".reveal-fade").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 52 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.07,
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  /* FPS bars */
  ScrollTrigger.create({
    trigger: ".fps-list",
    start: "top 80%",
    onEnter: () => {
      document.querySelectorAll(".fps-bar").forEach((bar) => {
        gsap.to(bar, {
          width: bar.dataset.width + "%",
          duration: 1.5,
          ease: "power3.out",
          delay: Math.random() * 0.25,
        });
      });
    },
  });

  /* Stat blocks */
  gsap.utils.toArray(".stat-block").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stat-blocks",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  /* Arsenal items */
  gsap.utils.toArray(".arsenal-item").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 91%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  /* Eco cards */
  gsap.utils.toArray(".eco-card").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 56, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  /* Philosophy text */
  const philText = document.querySelector(".philosophy-text");
  if (philText) {
    ScrollTrigger.create({
      trigger: philText,
      start: "top 82%",
      onEnter: () => {
        philText.classList.add("revealed");
      },
    });
  }

  /* Footer title */
  gsap.fromTo(
    ".closing-title",
    { opacity: 0, y: 70, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".closing-title",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    },
  );
}
