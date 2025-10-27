// 🔐 Configuración Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyCE_vOx4G6791luS7XlkZmtGghcr5s43zg",
  authDomain: "listacomprafamilia.firebaseapp.com",
  databaseURL: "https://listacomprafamilia-default-rtdb.firebaseio.com",
  projectId: "listacomprafamilia",
  storageBucket: "listacomprafamilia.appspot.com",
  messagingSenderId: "906261582139",
  appId: "1:906261582139:web:7b8582fb7857e3ee9f671e"
};

// ✅ Inicializar Firebase solo si no existe
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const auth = getAuth(app);

// Iniciar sesión anónima
signInAnonymously(auth)
  .then(() => console.log("Sesión anónima iniciada ✅"))
  .catch((error) => console.error("Error en sesión anónima:", error));

// 🔐 Familias y contraseñas
const familias = {
  "AAA": "1234",
  "BBB": "lopez123",
  "CCC": "torres456",
  "FAM123": "martinez789",
  "OGZ2025": "ogzpass"
};

// 🔗 Elementos del DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🔍 Obtener código de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// Validar código
if (!codigo || !familias[codigo]) {
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🚫 Acceso denegado</h2>
      <p>Este código de familia no está autorizado.</p>
    </main>
  `;
  throw new Error("Código no válido");
}

// Pedir contraseña
const intento = prompt(`Introduce la contraseña de la familia ${codigo}:`);
if (intento !== familias[codigo]) {
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🔒 Contraseña incorrecta</h2>
      <p>No tienes acceso a esta lista.</p>
    </main>
  `;
  throw new Error("Contraseña incorrecta");
}

// Mostrar código de familia
codigoTexto.textContent = `Código de familia: ${codigo}`;

// 📦 Referencia a Firebase
const listaRef = ref(db, `listas/${codigo}`);

// 🧾 Productos actuales (para renderizar)
let productos = [];
let productosFirebase = {}; // objeto completo de Firebase

// Leer lista en tiempo real
onValue(listaRef, (snapshot) => {
  productosFirebase = snapshot.val() || {};
  productos = Object.values(productosFirebase);
  renderizarLista();
});

// ➕ Añadir producto
function agregarProducto() {
  const producto = input.value.trim();
  if (producto !== "") {
    push(listaRef, producto);
    input.value = "";
    input.focus();
  }
}

// 🗑️ Eliminar producto
function eliminarProducto(index) {
  const keys = Object.keys(productosFirebase);
  const key = keys[index];
  remove(ref(db, `listas/${codigo}/${key}`));
}

// 🧾 Renderizar lista con numeración
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

// 🎯 Eventos
btnAgregar.addEventListener("click", agregarProducto);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") agregarProducto();
});

// 📲 Botón compartir por WhatsApp
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

const btnCompartir = document.createElement("button");
btnCompartir.textContent = "📲 Compartir por WhatsApp";
btnCompartir.style.marginTop = "1rem";
btnCompartir.addEventListener("click", compartirWhatsApp);
document.getElementById("accionesExtras").appendChild(btnCompartir);
