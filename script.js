lucide.createIcons();

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
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
document.querySelectorAll(".gallery button").forEach((btn) =>
  btn.addEventListener("click", () => {
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector("img").alt;
    lightboxCaption.textContent = btn.dataset.caption || "";
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

function confettiBurst() {
  const colors = ["#ff8a3d", "#ffc35c", "#ffffff", "#ff5a1e"];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

function toast(message, timeout = 300) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.querySelector(".toast-host").appendChild(el);
  requestAnimationFrame(() => el.classList.add("in"));
  el.addEventListener("click", (e) => {
    e.target.classList.remove("in");
    setTimeout(() => e.target.remove(), timeout);
  });

  if (timeout == 0) return;

  setTimeout(() => {
    el.classList.remove("in");
    setTimeout(() => el.remove(), timeout);
  }, 4000);
}

// Birthday easter egg: 16/07 is Jão's actual birthday (party is later, on 25-26/07)
(function birthdayEgg() {
  const now = new Date();
  if (now.getMonth() === 6 && now.getDate() === 16) {
    document.querySelector(".eyebrow").textContent = "🎂 Hoje é aniversário do Jão de verdade!";
    document.getElementById("countdown").classList.add("gold");
  }
})();

// Logo easter egg: double-click (desktop) or long-press (touch) swaps the name
(function logoEgg() {
  const logo = document.querySelector(".logo");
  const original = logo.textContent;
  const silly = "22zão do Jão?? Seloko 💀";
  let pressTimer;
  const swap = () => {
    logo.textContent = logo.textContent === original ? silly : original;
  };
  logo.addEventListener("dblclick", (e) => {
    e.preventDefault();
    swap();
  });
  logo.addEventListener("pointerdown", () => {
    pressTimer = setTimeout(swap, 600);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => logo.addEventListener(ev, () => clearTimeout(pressTimer)));
})();

// Shake to reveal: phone shake (devicemotion) or frantic mouse shake on desktop
(function shakeEgg() {
  const drinks = ["Caipirinha", "Cerveja bem gelada", "Quentão", "Suco de limão com vodka", "Refri de guaraná", "Vinho quente"];
  let lastTrigger = 0;
  function trigger() {
    const now = Date.now();
    if (now - lastTrigger < 8000) return;
    lastTrigger = now;
    confettiBurst();
    toast(`🍹 Bebida sorteada: ${drinks[Math.floor(Math.random() * drinks.length)]}`, 800);
  }

  let lastAccel = null;
  let shakeCount = 0;
  let shakeWindowStart = 0;
  function handleMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x === null) return;
    if (lastAccel) {
      const delta = Math.abs(a.x - lastAccel.x) + Math.abs(a.y - lastAccel.y) + Math.abs(a.z - lastAccel.z);
      if (delta > 25) {
        const now = Date.now();
        if (now - shakeWindowStart > 1000) {
          shakeWindowStart = now;
          shakeCount = 0;
        }
        shakeCount++;
        if (shakeCount > 3) trigger();
      }
    }
    lastAccel = a;
  }
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    document.addEventListener(
      "touchend",
      function requestOnce() {
        DeviceMotionEvent.requestPermission()
          .then((state) => {
            if (state === "granted") window.addEventListener("devicemotion", handleMotion);
          })
          .catch(() => {});
        document.removeEventListener("touchend", requestOnce);
      },
      { once: true },
    );
  } else if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleMotion);
  }

  let positions = [];
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    positions.push({ x: e.clientX, t: now });
    positions = positions.filter((p) => now - p.t < 700);
    if (positions.length < 6) return;
    let reversals = 0;
    let dir = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i - 1].x;
      if (Math.abs(dx) < 4) continue;
      const newDir = dx > 0 ? 1 : -1;
      if (dir !== 0 && newDir !== dir) reversals++;
      dir = newDir;
    }
    if (reversals > 6) trigger();
  });
})();

// Hidden emoji scavenger hunt: find all 5 for a payoff
(function eggHunt() {
  const eggs = document.querySelectorAll(".hidden-egg");
  const badge = document.querySelector(".egg-badge");
  const total = eggs.length;
  const found = new Set(JSON.parse(localStorage.getItem("eggsFound") || "[]"));
  function updateBadge() {
    badge.textContent = `🔍 ${found.size}/${total}`;
  }
  eggs.forEach((egg) => {
    if (found.has(egg.dataset.egg)) egg.classList.add("found");
    egg.addEventListener("click", (e) => {
      e.stopPropagation();
      if (found.has(egg.dataset.egg)) return;
      found.add(egg.dataset.egg);
      egg.classList.add("found");
      localStorage.setItem("eggsFound", JSON.stringify([...found]));
      updateBadge();
      if (found.size === total) {
        confettiBurst();
        toast("🎉 Achou os 5! Código PACU2026 = uma bebida de graça no dia.", 0);
      }
    });
  });
  updateBadge();
})();
