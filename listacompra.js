// --- Elementos del DOM ---
const input = document.getElementById("producto");
const addBtn = document.getElementById("addBtn");
const lista = document.getElementById("lista");
const fecha = document.getElementById("fecha");

// --- Inicializar lista ---
let productos = JSON.parse(localStorage.getItem("listaCompra")) || [];

// --- Mostrar fecha actual ---
const hoy = new Date();
fecha.textContent = hoy.toLocaleDateString("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// --- Función para actualizar la lista en pantalla ---
function mostrarLista() {
  lista.innerHTML = "";
  productos.forEach((producto, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const btnBorrar = document.createElement("button");

    span.textContent = producto;
    btnBorrar.textContent = "❌";
    btnBorrar.onclick = () => eliminarProducto(i);

    li.appendChild(span);
    li.appendChild(btnBorrar);
    lista.appendChild(li);
  });
}

// --- Añadir producto ---
function añadirProducto() {
  const texto = input.value.trim();
  if (texto === "") return;

  productos.push(texto);
  localStorage.setItem("listaCompra", JSON.stringify(productos));
  input.value = "";
  mostrarLista();
}

// --- Eliminar producto ---
function eliminarProducto(index) {
  productos.splice(index, 1);
  localStorage.setItem("listaCompra", JSON.stringify(productos));
  mostrarLista();
}

// --- Eventos ---
addBtn.addEventListener("click", añadirProducto);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") añadirProducto();
});

// --- Mostrar lista al cargar ---
mostrarLista();
