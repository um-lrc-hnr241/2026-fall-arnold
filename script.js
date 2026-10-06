document.documentElement.classList.add("js");

const progress = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let ticking = false;

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.setProperty("--scroll-progress", `${percent}%`);
  updateConsciousness();
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", updateProgress, { passive: true });

function updateConsciousness() {
  if (!hero) return;
  if (reducedMotion.matches) {
    document.documentElement.style.setProperty("--brain-opacity", "0.12");
    document.documentElement.style.setProperty("--brain-reveal", "0.12");
    return;
  }
  const distance = Math.max(hero.offsetHeight * 0.72, 1);
  const reveal = Math.min(Math.max(window.scrollY / distance, 0), 1);
  document.documentElement.style.setProperty("--portrait-lift", `${-reveal * 100}%`);
  document.documentElement.style.setProperty("--brain-reveal", `${reveal}`);
  document.documentElement.style.setProperty("--brain-opacity", `${0.06 + reveal * 0.22}`);
}

reducedMotion.addEventListener?.("change", updateConsciousness);
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