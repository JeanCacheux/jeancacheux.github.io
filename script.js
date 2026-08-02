const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".menu");

menuButton?.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("flow-field");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let time = 0;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawFlow() {
  ctx.clearRect(0, 0, width, height);

  const lines = 16;
  for (let i = 0; i < lines; i++) {
    const baseY = (height / (lines + 1)) * (i + 1);
    const amp = 18 + (i % 4) * 6;
    const phase = time * 0.002 + i * 0.55;

    ctx.beginPath();
    for (let x = -40; x <= width + 40; x += 12) {
      const y =
        baseY +
        Math.sin(x * 0.006 + phase) * amp +
        Math.sin(x * 0.014 - phase * 0.65) * amp * 0.35;

      if (x === -40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = i % 5 === 0
      ? "rgba(239, 51, 78, 0.14)"
      : "rgba(80, 186, 209, 0.13)";
    ctx.lineWidth = i % 5 === 0 ? 1.2 : 1;
    ctx.stroke();
  }

  time += 1;
  requestAnimationFrame(drawFlow);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawFlow();
}
