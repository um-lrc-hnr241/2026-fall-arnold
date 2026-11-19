document.documentElement.classList.add("js");

const progress = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const consciousnessImage = document.querySelector(".consciousness-backdrop img");
const quoteSection = document.querySelector(".quotes-section");
const portraitToggle = document.querySelector(".portrait-toggle");
let ticking = false;

if (portraitToggle) {
  const portraitImage = portraitToggle.querySelector(".arnold-portrait");
  const consciousness = portraitToggle.querySelector(".brain-reveal");

  portraitToggle.addEventListener("click", () => {
    const showingImage = portraitToggle.getAttribute("aria-pressed") !== "true";
    portraitImage.hidden = showingImage;
    consciousness.hidden = !showingImage;
    portraitToggle.setAttribute("aria-pressed", String(showingImage));
    portraitToggle.setAttribute("aria-label", showingImage ? "Show the portrait placeholder" : "Reveal the image representing consciousness");
  });
}

if (consciousnessImage) {
  window.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * -18;
    const y = (event.clientY / window.innerHeight - 0.5) * -18;
    consciousnessImage.style.setProperty("--pointer-x", `${x}px`);
    consciousnessImage.style.setProperty("--pointer-y", `${y}px`);
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    consciousnessImage.style.setProperty("--pointer-x", "0px");
    consciousnessImage.style.setProperty("--pointer-y", "0px");
  });
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.setProperty("--scroll-progress", `${percent}%`);
  if (quoteSection) {
    const quoteBottom = quoteSection.getBoundingClientRect().bottom + window.scrollY;
    const fadeDistance = Math.max(1, quoteBottom - window.innerHeight);
    const fadeProgress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
    document.documentElement.style.setProperty("--shadow-opacity", String(1 - fadeProgress));
  }
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", updateProgress, { passive: true });

updateProgress();

const revealTargets = document.querySelectorAll(
  ".section-heading, .project-card, .approach-copy, .steps-list li, .contact-section"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((element) => element.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
}