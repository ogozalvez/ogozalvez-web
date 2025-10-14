// 🔗 Referències al DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🧩 Obtenir el codi de família des de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// 🔒 Protecció bàsica: si no hi ha codi, redirigir
if (!codigo) {
  alert("Accés restringit: cal un codi de família.");
  window.location.href = "index.html";
}

// Mostrar el codi a la capçalera
codigoTexto.textContent = `Código de familia: ${codigo}`;

// 📦 Carregar la llista des de localStorage
let productos = JSON.parse(localStorage.getItem(`lista_${codigo}`)) || [];
renderizarLista();

// ➕ Afegir producte
function agregarProducto() {
  const producto = input.value.trim();
  if (producto !== "") {
    productos.push(producto);
    guardarLista();
    renderizarLista();
    input.value = "";
    input.focus();
  }
}

// 🗑️ Eliminar producte
function eliminarProducto(index) {
  productos.splice(index, 1);
  guardarLista();
  renderizarLista();
}

// 🧾 Renderitzar la llista amb numeració
function renderizarLista() {
  lista.innerHTML = "";
  productos.forEach((producto, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${index + 1}. ${producto}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.setAttribute("aria-label", `Eliminar ${producto}`);
    btnEliminar.addEventListener("click", () => eliminarProducto(index));

    li.appendChild(span);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

// 💾 Guardar la llista
function guardarLista() {
  localStorage.setItem(`lista_${codigo}`, JSON.stringify(productos));
}

// 📲 Compartir per WhatsApp
function compartirWhatsApp() {
  if (productos.length === 0) {
    alert("La lista está vacía.");
    return;
  }

  const mensaje = `🛒 Lista de la compra (${codigo}):\n` +
    productos.map((p, i) => `${i + 1}. ${p}`).join("\n");

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// 🎯 Events
btnAgregar.addEventListener("click", agregarProducto);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") agregarProducto();
});

// 🔘 Crear botó de compartir
const btnCompartir = document.createElement("button");
btnCompartir.textContent = "📲 Compartir por WhatsApp";
btnCompartir.style.marginTop = "1rem";
btnCompartir.addEventListener("click", compartirWhatsApp);
document.querySelector("main").appendChild(btnCompartir);