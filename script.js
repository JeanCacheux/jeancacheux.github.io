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
