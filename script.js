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

function playSound(src) {
  new Audio(src).play().catch(() => {});
}

function playClickSound() {
  playSound(Math.random() < 0.75 ? "assets/sounds/interactions/click.mp3" : "assets/sounds/interactions/click-nice.mp3");
}

function playRandomSound(sounds) {
  const sound = sounds[Math.floor(Math.random() * sounds.length)];
  playSound(sounds[Math.floor(Math.random() * sounds.length)]);
}

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

// Turns a drink name into a coupon-looking code, e.g. "Cerveja bem gelada" -> "CERVEJA4821"
function drinkCode(name) {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 7);
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return `${slug}${1000 + (hash % 9000)}`;
}

// Draws (and remembers) the one free-drink coupon earned for finishing the egg hunt
function drawEggHuntCoupon(drinks) {
  let saved = JSON.parse(localStorage.getItem("eggHuntCoupon") || "null");
  if (!saved) {
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    saved = { drink, code: drinkCode(drink) };
    localStorage.setItem("eggHuntCoupon", JSON.stringify(saved));
  }
  return saved;
}

function toast(message, timeout = 300, icon = "party-popper") {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<i data-lucide="${icon}" class="icon"></i><span></span>`;
  el.querySelector("span").textContent = message;
  document.querySelector(".toast-host").appendChild(el);
  lucide.createIcons();
  requestAnimationFrame(() => el.classList.add("in"));
  el.addEventListener("click", () => {
    el.classList.remove("in");
    setTimeout(() => el.remove(), timeout);
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
  const drinks = [
    { name: "Cervejinha", sounds: ["assets/sounds/reactions/ack.mp3"] },
    { name: "Cerveja gelada", sounds: ["assets/sounds/reactions/heavenly-music.mp3", "assets/sounds/reactions/mlg-airhorn.mp3"] },
    { name: "Cerveja artesanal", sounds: ["assets/sounds/reactions/rehehehe.mp3", "assets/sounds/reactions/prowler.mp3"] },
    { name: "Chopp", sounds: ["assets/sounds/reactions/mlg-airhorn.mp3", "assets/sounds/reactions/heavenly-music.mp3"] },

    { name: "Coca-Cola", sounds: ["assets/sounds/reactions/ack.mp3"] },
    { name: "Coca Zero", sounds: ["assets/sounds/reactions/fart.mp3", "assets/sounds/reactions/brain-fart.mp3"] },
    { name: "Guaraná", sounds: ["assets/sounds/reactions/mlg-airhorn.mp3", "assets/sounds/reactions/fuuuuh.mp3"] },
    { name: "H2OH", sounds: ["assets/sounds/reactions/brain-fart.mp3"] },

    { name: "Água com gás", sounds: ["assets/sounds/reactions/fart-reverb.mp3"] },
    { name: "Chá gelado", sounds: ["assets/sounds/reactions/ack.mp3", "assets/sounds/reactions/pan-hit.mp3"] },
    { name: "Suco de laranja", sounds: ["assets/sounds/reactions/heavenly-music.mp3"] },
    { name: "Suco de uva", sounds: ["assets/sounds/reactions/rehehehe.mp3"] },
    { name: "Suco de morango", sounds: ["assets/sounds/reactions/heavenly-music.mp3", "assets/sounds/reactions/rehehehe.mp3"] },
    { name: "Isotônico", sounds: ["assets/sounds/reactions/pan-hit.mp3"] },

    { name: "Vodka", sounds: ["assets/sounds/reactions/mlg-airhorn.mp3", "assets/sounds/reactions/prowler.mp3"] },
    { name: "Gin", sounds: ["assets/sounds/reactions/heavenly-music.mp3"] },
    { name: "Tequila", sounds: ["assets/sounds/reactions/mlg-airhorn.mp3", "assets/sounds/reactions/fuuuuh.mp3"] },

    { name: "Energético", sounds: ["assets/sounds/reactions/mlg-airhorn.mp3", "assets/sounds/reactions/brain-fart.mp3"] },
    { name: "Água tônica", sounds: ["assets/sounds/reactions/fart.mp3"] },
    { name: "Skol Beats", sounds: ["assets/sounds/reactions/rehehehe.mp3"] },
    { name: "Smirnoff Ice", sounds: ["assets/sounds/reactions/pan-hit.mp3", "assets/sounds/reactions/fuuuuh.mp3"] },
    { name: "Keep Cooler", sounds: ["assets/sounds/reactions/heavenly-music.mp3", "assets/sounds/reactions/rehehehe.mp3"] },
  ];

  let lastTrigger = 0;
  function trigger() {
    const now = Date.now();
    if (now - lastTrigger < 8000) return;
    lastTrigger = now;
    confettiBurst();
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    playRandomSound(drink.sounds);
    toast(`Bebida sugerida pra trazer: ${drink.name}`, 800, "martini");
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
  const drinks = ["Cervejinha quente", "Cerveja bem gelada", "Coca-cola pitchulinha", "Água kkkk", "Guaraná", "Água com gás"];
  const eggs = document.querySelectorAll(".hidden-egg");
  const badge = document.querySelector(".egg-badge");
  const total = eggs.length;
  // const found = new Set(JSON.parse(localStorage.getItem("eggsFound") || "[]"));
  const found = new Set(JSON.parse("[1,2,3,4]"));
  const badgeLabel = badge.querySelector("span");
  function updateBadge() {
    badgeLabel.textContent = `${found.size}/${total}`;
  }
  function showCoupon() {
    const coupon = drawEggHuntCoupon(drinks);
    toast(`Cupom: ${coupon.code}\n${coupon.drink} de graça no dia!`, 0, "party-popper");
  }
  badge.addEventListener("click", () => {
    if (found.size === total) showCoupon();
  });
  eggs.forEach((egg) => {
    if (found.has(egg.dataset.egg)) egg.classList.add("found");
    egg.addEventListener("click", (e) => {
      e.stopPropagation();
      if (found.has(egg.dataset.egg)) return;
      playClickSound();
      found.add(egg.dataset.egg);
      egg.classList.add("found");
      localStorage.setItem("eggsFound", JSON.stringify([...found]));
      updateBadge();
      if (found.size === total) {
        confettiBurst();
        showCoupon();
      }
    });
  });
  updateBadge();
})();
