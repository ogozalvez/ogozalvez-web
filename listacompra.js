// 🔗 Referències a elements del DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🧩 Obtenir el codi de família des de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo") || "SIN_CODIGO";
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

// 🧾 Renderitzar la llista
function renderizarLista() {
  lista.innerHTML = "";
  productos.forEach((producto, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = producto;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.setAttribute("aria-label", `Eliminar ${producto}`);
    btnEliminar.addEventListener("click", () => eliminarProducto(index));

    li.appendChild(span);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

// 💾 Guardar la llista al localStorage
function guardarLista() {
  localStorage.setItem(`lista_${codigo}`, JSON.stringify(productos));
}

// 🎯 Event listener per afegir producte
btnAgregar.addEventListener("click", agregarProducto);

// ⌨️ Permetre afegir amb Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    agregarProducto();
  }
});