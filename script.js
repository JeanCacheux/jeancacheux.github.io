\
const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];
let pointer = { x: -9999, y: -9999 };

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(165, Math.floor((width * height) / 10000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.22 + Math.random() * 0.42,
    phase: Math.random() * Math.PI * 2,
    size: 0.7 + Math.random() * 1.5
  }));
}

function updatePointer(x, y) {
  pointer.x = x;
  pointer.y = y;
}

window.addEventListener("pointermove", (e) => updatePointer(e.clientX, e.clientY));
window.addEventListener("pointerleave", () => updatePointer(-9999, -9999));
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) updatePointer(t.clientX, t.clientY);
}, { passive: true });

function animate(time) {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    const field =
      Math.sin((p.y + time * 0.03) * 0.008 + p.phase) +
      Math.cos((p.x - time * 0.02) * 0.006);

    p.x += Math.cos(field) * p.speed;
    p.y += Math.sin(field) * p.speed;

    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 120) {
      const force = (120 - dist) / 120;
      p.x += (dx / (dist || 1)) * force * 1.4;
      p.y += (dy / (dist || 1)) * force * 1.4;
    }

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = i % 13 === 0
      ? "rgba(239, 51, 78, 0.24)"
      : "rgba(80, 189, 211, 0.19)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

resize();
window.addEventListener("resize", resize);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(animate);
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}
