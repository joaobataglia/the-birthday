const target = new Date("2026-07-25T09:00:00");
const cd = {
  d: document.querySelector("[data-d]"),
  h: document.querySelector("[data-h]"),
  m: document.querySelector("[data-m]"),
  s: document.querySelector("[data-s]"),
};
function pad(n) {
  return String(n).padStart(2, "0");
}
function tick() {
  const diff = target - new Date();
  if (diff < 0) {
    document.getElementById("countdown").textContent = "A festa começou!";
    return;
  }
  const s = Math.floor(diff / 1000);
  cd.d.textContent = pad(Math.floor(s / 86400));
  cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
  cd.m.textContent = pad(Math.floor((s % 3600) / 60));
  cd.s.textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".mobile-nav");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }),
);

document.querySelectorAll(".day-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    const day = btn.dataset.day;
    document.querySelectorAll(".day-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn);
    });
    document.querySelectorAll(".day-panel").forEach((p) => {
      p.hidden = p.dataset.day !== day;
    });
  }),
);

const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
document.querySelectorAll(".gallery button").forEach((btn) =>
  btn.addEventListener("click", () => {
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector("img").alt;
    lightbox.showModal();
  }),
);
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
