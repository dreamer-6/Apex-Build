/**
 * APEX — index.js
 * Complete JS: nav, GSAP scroll animations, scroll spy, form handler, scroll progress, cursor
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ═══════════════════════════════════════════
     1. REGISTER GSAP PLUGINS
  ═══════════════════════════════════════════ */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ═══════════════════════════════════════════
     2. HAMBURGER MENU
  ═══════════════════════════════════════════ */
  const hamburger = document.querySelector(".hamburger");
  const navLinks  = document.querySelector(".nav-links");
  const navItems  = document.querySelectorAll(".nav-links li");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpening = !navLinks.classList.contains("active");
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");

      if (isOpening) {
        document.body.style.overflow = "hidden";
        navItems.forEach((item, i) => {
          item.style.transitionDelay = `${0.2 + i * 0.1}s`;
        });
      } else {
        document.body.style.overflow = "";
        navItems.forEach((item) => { item.style.transitionDelay = "0s"; });
      }
    });

    // Close on link click
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
        navItems.forEach((item) => { item.style.transitionDelay = "0s"; });
      });
    });
  }

  /* ═══════════════════════════════════════════
     3. NAVBAR SCROLL STATE + PROGRESS BAR
  ═══════════════════════════════════════════ */
  const nav         = document.querySelector(".global-nav");
  const progressBar = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // Scrolled class on nav
    if (nav) nav.classList.toggle("scrolled", y > 80);

    // Progress bar
    if (progressBar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (y / total * 100) + "%" : "0%";
    }
  }, { passive: true });

  /* ═══════════════════════════════════════════
     4. SCROLL SPY — active nav link
  ═══════════════════════════════════════════ */
  const sections   = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll(".nav-link");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinkEls.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => spyObserver.observe(s));

  /* ═══════════════════════════════════════════
     5. GRACEFUL FALLBACK — no GSAP
  ═══════════════════════════════════════════ */
  if (typeof gsap === "undefined") {
    const animated = [
      ".hero-tag",".hero-title",".hero-sub",".hero-cta",
      ".section-header",".about-header",".reports-header",
      ".build-card",".bento-card",".spotlight-content",
      ".spotlight-image-container",".about-content",
      ".about-visual-group",".report-card"
    ].join(",");
    document.querySelectorAll(animated).forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  /* ═══════════════════════════════════════════
     6. GSAP ANIMATIONS
  ═══════════════════════════════════════════ */

  /* ── 6a. HERO ENTRANCE stagger on load ── */
  gsap.timeline({ delay: 0.1 })
    .to(".hero-tag",   { opacity:1, y:0, duration:0.7, ease:"power3.out" })
    .to(".hero-title", { opacity:1, y:0, duration:0.9, ease:"power4.out" }, "-=0.4")
    .to(".hero-sub",   { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.5")
    .to(".hero-cta",   { opacity:1, y:0, duration:0.6, ease:"power3.out" }, "-=0.4");

  /* ── 6b. HERO BG PARALLAX ── */
  if (document.querySelector(".hero-bg")) {
    gsap.to(".hero-bg", {
      yPercent: 28, ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  /* ── 6c. SECTION HEADERS ── */
  [".section-header", ".about-header", ".reports-header"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      gsap.to(el, {
        opacity:1, y:0, duration:0.9, ease:"power3.out",
        scrollTrigger: { trigger: el, start:"top 88%", toggleActions:"play none none none" }
      });
    });
  });

  /* ── 6d. ARSENAL BUILD CARDS stagger ── */
  const buildCards = gsap.utils.toArray(".build-card");
  if (buildCards.length) {
    gsap.to(buildCards, {
      opacity:1, y:0, scale:1,
      duration:0.75, stagger:0.13, ease:"power3.out",
      scrollTrigger: {
        trigger: ".arsenal-wrapper",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  /* ── 6e. BENTO CATEGORY CARDS stagger ── */
  const bentoCards = gsap.utils.toArray(".bento-card");
  if (bentoCards.length) {
    gsap.to(bentoCards, {
      opacity:1, y:0,
      duration:0.7, stagger:0.1, ease:"power3.out",
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  /* ── 6f. SPOTLIGHT — split horizontal reveal ── */
  const stContent = document.querySelector(".spotlight-content");
  const stImage   = document.querySelector(".spotlight-image-container");
  if (stContent) {
    gsap.to(stContent, {
      opacity:1, x:0, duration:1.0, ease:"power3.out",
      scrollTrigger: { trigger:".spotlight-wrapper", start:"top 82%", toggleActions:"play none none none" }
    });
  }
  if (stImage) {
    gsap.to(stImage, {
      opacity:1, x:0, duration:1.0, ease:"power3.out", delay:0.15,
      scrollTrigger: { trigger:".spotlight-wrapper", start:"top 82%", toggleActions:"play none none none" }
    });
  }

  /* ── 6g. ABOUT — split reveal ── */
  const aboutContent = document.querySelector(".about-content");
  const aboutVisual  = document.querySelector(".about-visual-group");
  if (aboutContent) {
    gsap.to(aboutContent, {
      opacity:1, x:0, duration:0.9, ease:"power3.out",
      scrollTrigger: { trigger:".about-grid", start:"top 82%", toggleActions:"play none none none" }
    });
  }
  if (aboutVisual) {
    gsap.to(aboutVisual, {
      opacity:1, x:0, duration:0.9, ease:"power3.out", delay:0.15,
      scrollTrigger: { trigger:".about-grid", start:"top 82%", toggleActions:"play none none none" }
    });
  }

  /* ── 6h. ABOUT IMAGE — grayscale reveal on scroll ── */
  const aboutImg = document.querySelector(".about-img");
  if (aboutImg) {
    gsap.to(aboutImg, {
      filter: "grayscale(0%) contrast(1.1)",
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".about-image-wrapper",
        start: "top 78%",
        toggleActions: "play none none none"
      }
    });
  }

  /* ── 6i. REVIEW CARDS stagger ── */
  const reportCards = gsap.utils.toArray(".report-card");
  if (reportCards.length) {
    gsap.to(reportCards, {
      opacity:1, y:0,
      duration:0.7, stagger:0.12, ease:"power3.out",
      scrollTrigger: {
        trigger: ".reports-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  /* ── 6j. MARQUEE PAUSE ON HOVER ── */
  const mqInner = document.querySelector(".mq-inner");
  if (mqInner) {
    mqInner.addEventListener("mouseenter", () => {
      mqInner.style.animationPlayState = "paused";
    });
    mqInner.addEventListener("mouseleave", () => {
      mqInner.style.animationPlayState = "running";
    });
  }

  /* ═══════════════════════════════════════════
     7. FORM HANDLER
  ═══════════════════════════════════════════ */
  const buildForm     = document.getElementById("build-form");
  const formContainer = document.querySelector(".cta-form-container");

  if (buildForm && formContainer) {
    buildForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate required fields
      let valid = true;
      buildForm.querySelectorAll("[required]").forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = "rgba(239,68,68,0.7)";
          field.addEventListener("input", () => {
            field.style.borderColor = "";
          }, { once: true });
        }
      });
      if (!valid) return;

      // Animate button to loading state
      const btn = buildForm.querySelector(".submit-btn");
      if (btn) {
        btn.textContent = "TRANSMITTING...";
        btn.style.opacity = "0.7";
        btn.disabled = true;
      }

      // Simulate async (replace with real fetch() call)
      setTimeout(() => {
        formContainer.style.transition = "opacity 0.4s ease";
        formContainer.style.opacity   = "0";
        setTimeout(() => {
          formContainer.innerHTML = `
            <div class="form-success">
              <div class="form-success-icon">✓</div>
              <h3>Build Request Received</h3>
              <p>Our team will reach out within 24 hours to begin your consultation. Welcome to APEX.</p>
            </div>
          `;
          formContainer.style.opacity = "1";
        }, 350);
      }, 800);
    });
  }

  /* ═══════════════════════════════════════════
     8. CUSTOM CURSOR (desktop only)
  ═══════════════════════════════════════════ */
  if (window.innerWidth > 900 && !window.matchMedia("(pointer: coarse)").matches) {
    const cursor = document.createElement("div");
    cursor.id    = "apex-cursor";
    Object.assign(cursor.style, {
      position:       "fixed",
      top:            "0",
      left:           "0",
      width:          "10px",
      height:         "10px",
      borderRadius:   "50%",
      background:     "rgba(245,110,15,0.9)",
      boxShadow:      "0 0 18px rgba(245,110,15,0.5)",
      pointerEvents:  "none",
      zIndex:         "99999",
      transform:      "translate(-50%,-50%)",
      transition:     "transform 0.25s ease, opacity 0.3s ease, width 0.25s ease, height 0.25s ease"
    });
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX   = mouseX;
    let curY   = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    (function tick() {
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.left = curX + "px";
      cursor.style.top  = curY + "px";
      requestAnimationFrame(tick);
    })();

    // Scale on interactive elements
    document.querySelectorAll("a, button, .build-card, .bento-card, .report-card").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width   = "24px";
        cursor.style.height  = "24px";
        cursor.style.opacity = "0.4";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width   = "10px";
        cursor.style.height  = "10px";
        cursor.style.opacity = "1";
      });
    });

    // Hide when leaving window
    document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
  }

}); // end DOMContentLoadedgit 