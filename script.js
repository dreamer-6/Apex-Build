// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Utility: Fade Up Animation Batch
const fadeUpConfig = {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
};

// 1. Hero Section Animations
const heroTl = gsap.timeline();

heroTl.to(".hero-visual img", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: "power2.out",
    delay: 0.5
})
.from(".hero-label", { opacity: 0, x: -50, duration: 1 }, "-=1")
.from(".hero-title", { opacity: 0, y: 50, duration: 1, stagger: 0.2 }, "-=0.8")
.from(".hero-subtext", { opacity: 0, y: 30, duration: 1 }, "-=0.8")
.from(".cta-sec button", { opacity: 0, y: 20, stagger: 0.2, duration: 0.8 }, "-=0.6")
.from(".scroll-indicator", { opacity: 0, y: 20, duration: 1 }, "-=0.5");

// Parallax Effect for Hero Image
gsap.to(".hero-visual img", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 200,
    scale: 1.1
});

// 2. Architecture Header
gsap.from(".architecture .section-title", {
    scrollTrigger: {
        trigger: ".architecture",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: "back.out(1.7)"
});

// 3. Component Sections (CPU & Motherboard)
const components = document.querySelectorAll('.component');

components.forEach(comp => {
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: comp,
            start: "top 70%",
            end: "bottom 80%",
            toggleActions: "play none none reverse"
        }
    });

    const isRtl = getComputedStyle(comp.querySelector('.component-wrapper')).direction === 'rtl';
    const xOffset = isRtl ? 100 : -100;

    tl.from(comp.querySelector('.component-visual'), {
        opacity: 0,
        x: xOffset,
        duration: 1.2,
        ease: "power3.out"
    })
    .from(comp.querySelectorAll('.component-details > *'), {
        opacity: 0,
        x: isRtl ? -50 : 50,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1"); // Overlap
});

// 4. GPU Section
gsap.from(".gpu-image", {
    scrollTrigger: {
        trigger: ".gpu-sec",
        start: "top 60%",
        scrub: 1
    },
    y: 100,
    rotation: 5,
    scale: 0.9
});

gsap.from(".gpu-stat-card", {
    scrollTrigger: {
        trigger: ".gpu-sec",
        start: "top 70%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});

// 5. Quad Grid (RAM, SSD, etc.)
gsap.from(".quad-card", {
    scrollTrigger: {
        trigger: ".quad-grid",
        start: "top 85%"
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out"
});

// 6. Cabinet Section
gsap.from(".cabinet-visual", {
    scrollTrigger: {
        trigger: ".cabinet-showcase",
        start: "top 70%"
    },
    x: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

gsap.from(".cabinet-info > *", {
    scrollTrigger: {
        trigger: ".cabinet-showcase",
        start: "top 70%"
    },
    x: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.3
});

// Feature points pop-in
gsap.from(".feature-point", {
    scrollTrigger: {
        trigger: ".cabinet-visual",
        start: "top 60%"
    },
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2,
    ease: "back.out(2)"
});

// 7. Specs Table Animation
gsap.from(".spec-category", {
    scrollTrigger: {
        trigger: ".spec-table-section",
        start: "top 80%"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});

// Spec Category Toggle Animation (Enhancing the existing JS)
// We can use the existing onclick handler but let's add some smooth height animation via CSS or simple JS
// The existing CSS likely handles height or display. Let's assume standard accordion behavior.
// For smooth accordion, CSS 'grid-template-rows' transition is best, but here we'll stick to what we have or generic fade.
