// 🔐 Codigos de familia y contraseñas
const familias = {
  "AAA": { nombre: "Trikis Family", password: "1234" },
  "BBB": { nombre: "Familia López", password: "lopez123" },
  "CCC": { nombre: "Familia Torres", password: "torres456" },
  "FAM123": { nombre: "Familia Martínez", password: "martinez789" },
  "OGZ2025": { nombre: "Familia Gozálvez", password: "ogzpass" }
};

// 🔗 Elementos del DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🔍 Obtener código de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// 🔒 Validación de código
if (!codigo || !familias[codigo]) {
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🚫 Acceso denegado</h2>
      <p>Este código de familia no está autorizado.</p>
    </main>
  `;
  throw new Error("Código no válido");
}

// 🔑 Validación de contraseña
const familia = familias[codigo];
if (familia.password) {
  const intento = prompt(`Introduce la contraseña para ${familia.nombre}:`);
  if (intento !== familia.password) {
    document.body.innerHTML = `
      <main style="text-align:center; padding:2rem;">
        <h2>🔒 Contraseña incorrecta</h2>
        <p>No tienes acceso a esta lista.</p>
      </main>
    `;
    throw new Error("Contraseña incorrecta");
  }
}

// ✅ Mostrar código y nombre
codigoTexto.textContent = `Código de familia: ${codigo} (${familia.nombre})`;

// 🔗 Firebase
const db = window.firebaseDB;
const listaRef = window.firebaseRef(db, `listas/${codigo}`);

// Productos locales para renderizar
let productos = [];

// 🔍 Escuchar cambios en tiempo real
window.firebaseOnValue(listaRef, (snapshot) => {
  const data = snapshot.val();
  productos = data ? Object.entries(data).map(([key, value]) => ({ key, nombre: value })) : [];
  renderizarLista();
});

// ➕ Añadir producto
function agregarProducto() {
  const producto = input.value.trim();
  if (producto !== "") {
    window.firebasePush(listaRef, producto);
    input.value = "";
    input.focus();
  }
}

// 🗑️ Eliminar producto
function eliminarProducto(index) {
  const key = productos[index].key;
  window.firebaseRemove(window.firebaseRef(db, `listas/${codigo}/${key}`));
}

// 🧾 Renderizar con numeración
function renderizarLista() {
  lista.innerHTML = "";
  productos.forEach((item, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${index + 1}. ${item.nombre}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.setAttribute("aria-label", `Eliminar ${item.nombre}`);
    btnEliminar.addEventListener("click", () => eliminarProducto(index));

    li.appendChild(span);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

// 🔘 Botón compartir WhatsApp
function compartirWhatsApp() {
  if (productos.length === 0) {
    alert("La lista está vacía.");
    return;
  }
  const mensaje = `🛒 Lista de la compra (${codigo}):\n` +
    productos.map((p, i) => `${i + 1}. ${p.nombre}`).join("\n");
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// 🎯 Eventos
btnAgregar.addEventListener("click", agregarProducto);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") agregarProducto();
});

// 🔘 Botón compartir
const btnCompartir = document.createElement("button");
btnCompartir.textContent = "📲 Compartir por WhatsApp";
btnCompartir.style.marginTop = "1rem";
btnCompartir.addEventListener("click", compartirWhatsApp);
document.getElementById("accionesExtras").appendChild(btnCompartir);
