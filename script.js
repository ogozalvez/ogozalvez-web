// Aquí podrás añadir efectos visuales, animaciones o interacciones
console.log("Bienvenido a ogozalvez.cat");

console.log("Página de colección cargada");

// Menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
});