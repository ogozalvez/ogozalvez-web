const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const codigoTexto = document.getElementById("codigoFamilia");

// Obtener código de URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo") || "SIN_CODIGO";
codigoTexto.textContent = `Código de familia: ${codigo}`;

// Cargar lista desde LocalStorage
let productos = JSON.parse(localStorage.getItem(`lista_${codigo}`)) || [];
renderizarLista();

function agregarProducto() {
  const producto = input.value.trim();
  if (producto !== "") {
    productos.push(producto);
    guardarLista();
    renderizarLista();
    input.value = "";
  }
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  guardarLista();
  renderizarLista();
}

function renderizarLista() {
  lista.innerHTML = "";
  productos.forEach((producto, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${producto}
      <button onclick="eliminarProducto(${index})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

function guardarLista() {
  localStorage.setItem(`lista_${codigo}`, JSON.stringify(productos));
}