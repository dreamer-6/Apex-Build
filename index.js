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
