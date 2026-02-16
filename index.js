const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

if (hamburgerBtn && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("active");
    hamburgerBtn.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    navLinks.classList.add("active");
    hamburgerBtn.classList.add("active");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("active");
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".nav-content")) {
      closeMenu();
    }
  });
}

// =========================================
// ADVANCED CINEMATIC PHYSICS ENGINE
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ---------------------------------------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll, .reveal-stagger").forEach((el) => {
    revealObserver.observe(el);
  });

  // 2. MOUSE & SCROLL PHYSICS STATE
  // ---------------------------------------
  const state = {
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scroll: { current: 0, target: 0 },
    hero: {
      container: document.querySelector(".pc-container"),
      title: document.querySelector(".hero-title"),
      particles: document.querySelector(".particles-container")
    },
    cards: document.querySelectorAll(".spotlight-card")
  };

  // 3. INPUT LISTENERS
  // ---------------------------------------
  document.addEventListener("mousemove", (e) => {
    // Normalized coordinates (0 to 1)
    const nX = e.clientX / window.innerWidth;
    const nY = e.clientY / window.innerHeight;
    
    // Global lighting variables
    document.body.style.setProperty("--mouse-x", `${nX * 100}%`);
    document.body.style.setProperty("--mouse-y", `${nY * 100}%`);
    
    // Parallax targets (centered at 0,0)
    state.mouse.targetX = (e.clientX - window.innerWidth / 2) * 0.02; // Reduced sensitivity for weight
    state.mouse.targetY = (e.clientY - window.innerHeight / 2) * 0.02;

    // Card Tilt Calculation
    state.cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;
      
      // Only tilt if mouse is near/over card
      if (cardX > -50 && cardX < rect.width + 50 && cardY > -50 && cardY < rect.height + 50) {
        const tiltX = (rect.height / 2 - cardY) / 25; // Rotate X based on Y distance
        const tiltY = (cardX - rect.width / 2) / 25;  // Rotate Y based on X distance
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.zIndex = "10";
      } else {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        card.style.zIndex = "1";
      }
    });
  });

  document.addEventListener("mouseleave", () => {
    // Reset cards when mouse leaves window
    state.cards.forEach(card => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });

  // 4. ANIMATION LOOP (60fps+)
  // ---------------------------------------
  function animate() {
    // > MOUSE LERP (Smooth Inertia)
    // Moves current value 5% closer to target each frame
    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;

    // > SCROLL LERP (Weighted Momentum)
    state.scroll.target = window.scrollY;
    state.scroll.current += (state.scroll.target - state.scroll.current) * 0.1; // 10% catch-up
    
    // > APPLY HERO PARALLAX (Mouse + Scroll mix)
    // The hero image floats based on mouse AND sinks slightly on scroll
    if (state.hero.container) {
      const scrollOffset = state.scroll.current * 0.15; // Moves down slower than scroll
      const parallaxX = state.mouse.x;
      const parallaxY = state.mouse.y + scrollOffset;
      
      state.hero.container.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
    }

    if (state.hero.title) {
      // Title moves slower (more distant)
      const parallaxX = state.mouse.x * 0.5;
      const parallaxY = state.mouse.y * 0.5 + (state.scroll.current * 0.05);
      state.hero.title.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
    }

    if (state.hero.particles) {
      // Particles rise up as you scroll down
      const scrollOffset = state.scroll.current * -0.2; 
      state.hero.particles.style.transform = `translate3d(0, ${scrollOffset}px, 0)`;
    }

    // > MEGA TEXT PARALLAX
    const megaText = document.querySelector(".mega-text-bg");
    if (megaText) {
      const scrollOffset = state.scroll.current * 0.1; // Slow downward drift
      megaText.style.transform = `translate3d(-50%, calc(-50% + ${scrollOffset}px), 0)`;
    }

    requestAnimationFrame(animate);
  }
  
  // Start Engine
  animate();
});
