// 🔐 Configuración Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"; // Importa funciones para inicializar la app de Firebase
import { getDatabase, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"; // Importa funciones del módulo Realtime Database
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"; // Importa funciones de autenticación anónima

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCE_vOx4G6791luS7XlkZmtGghcr5s43zg", // Clave pública de la API de Firebase
  authDomain: "listacomprafamilia.firebaseapp.com", // Dominio de autenticación del proyecto
  databaseURL: "https://listacomprafamilia-default-rtdb.firebaseio.com", // URL de la base de datos en tiempo real
  projectId: "listacomprafamilia", // ID del proyecto
  storageBucket: "listacomprafamilia.appspot.com", // Almacenamiento (no se usa aquí)
  messagingSenderId: "906261582139", // ID para mensajería (no se usa aquí)
  appId: "1:906261582139:web:7b8582fb7857e3ee9f671e" // ID único de la app
};

// ✅ Inicializar Firebase solo si no existe una instancia previa
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig); // Si ya está inicializada, reutiliza esa instancia
const db = getDatabase(app); // Obtiene referencia a la base de datos
const auth = getAuth(app); // Obtiene el sistema de autenticación

// Iniciar sesión anónima en Firebase (sin usuario registrado)
signInAnonymously(auth)
  .then(() => console.log("Sesión anónima iniciada ✅")) // Mensaje si la conexión fue correcta
  .catch((error) => console.error("Error sesión anónima:", error)); // Mensaje de error si falla


// 🔗 Elementos del DOM (elementos del HTML que vamos a usar)
const lista = document.getElementById("listaProductos"); // Lista donde se mostrarán los productos
const input = document.getElementById("productoInput"); // Campo de texto para escribir un producto
const btnAgregar = document.getElementById("btnAgregar"); // Botón para añadir productos
const codigoTexto = document.getElementById("codigoFamilia"); // Texto donde se muestra el código de familia activo

// 🔍 Obtener el código de familia de la URL (por ejemplo: ?codigo=AAA)
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo"); // Extrae el valor del parámetro "codigo"

// Validar que el código exista y sea válido
if (!codigo || !familias[codigo]) {
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🚫 Acceso denegado</h2>
      <p>Este código de familia no está autorizado.</p>
    </main>
  `;
  throw new Error("Código no válido"); // Detiene el script si el código no es válido
}

// Pedir contraseña al usuario
const intento = prompt(`Introduce la contraseña de la familia ${codigo}:`);
if (intento !== familias[codigo]) { // Si la contraseña no coincide
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🔒 Contraseña incorrecta</h2>
      <p>No tienes acceso a esta lista.</p>
    </main>
  `;
  throw new Error("Contraseña incorrecta"); // Detiene el script si la contraseña es incorrecta
}

// Mostrar en pantalla el código de la familia actual
codigoTexto.textContent = `Código de familia: ${codigo}`;

// 📦 Crear una referencia a la lista de esa familia en Firebase
const listaRef = ref(db, `listas/${codigo}`); // Cada familia tiene su propia lista

// 🧾 Variables para manejar los productos
let productos = []; // Array local para guardar productos
let productosFirebase = {}; // Objeto con los datos originales de Firebase

// Escuchar cambios en tiempo real desde Firebase y actualizar la lista automáticamente
onValue(listaRef, (snapshot) => {
  const data = snapshot.val() || {}; // Obtiene los datos o un objeto vacío si no hay nada
  productosFirebase = data; // Guarda los datos completos
  // Convierte el objeto en un array con clave y valor
  productos = Object.keys(data).map(key => ({
    key: key,
    valor: data[key]
  }));
  renderizarLista(); // Actualiza la lista visualmente
});

// ➕ Función para añadir un producto nuevo
function agregarProducto() {
  const producto = input.value.trim(); // Quita espacios sobrantes
  if (producto !== "") { // Si no está vacío
    push(listaRef, producto); // Lo añade a Firebase
    input.value = ""; // Limpia el campo
    input.focus(); // Devuelve el foco al input
  }
}

// 🗑️ Función para eliminar un producto por índice
function eliminarProducto(index) {
  const key = productos[index].key; // Obtiene la clave única del producto en Firebase
  remove(ref(db, `listas/${codigo}/${key}`)); // Lo elimina de la base de datos
}

// 🧾 Función que muestra la lista actualizada con numeración
function renderizarLista() {
  lista.innerHTML = ""; // Limpia la lista visual
  productos.forEach((productoObj, index) => { // Recorre todos los productos
    const li = document.createElement("li"); // Crea un elemento de lista

    const span = document.createElement("span"); // Texto del producto
    span.textContent = `${index + 1}. ${productoObj.valor}`; // Añade número y nombre

    const btnEliminar = document.createElement("button"); // Botón para eliminar
    btnEliminar.textContent = "🗑️"; // Icono de papelera
    btnEliminar.setAttribute("aria-label", `Eliminar ${productoObj.valor}`); // Accesibilidad
    btnEliminar.addEventListener("click", () => eliminarProducto(index)); // Evento al pulsar eliminar

    li.appendChild(span); // Añade el texto al elemento de lista
    li.appendChild(btnEliminar); // Añade el botón al elemento de lista
    lista.appendChild(li); // Añade el elemento completo a la lista en el HTML
  });
}

// 🎯 Eventos de interacción
btnAgregar.addEventListener("click", agregarProducto); // Añadir producto con botón
input.addEventListener("keypress", (e) => { // Añadir producto con tecla Enter
  if (e.key === "Enter") agregarProducto();
});

// 📲 Función para compartir la lista por WhatsApp
function compartirWhatsApp() {
  if (productos.length === 0) { // Si la lista está vacía
    alert("La lista está vacía.");
    return;
  }

  // Crea el mensaje con formato numerado
  const mensaje = `🛒 Lista de la compra (${codigo}):\n` +
    productos.map((p, i) => `${i + 1}. ${p.valor}`).join("\n");

  // Crea un enlace directo a WhatsApp con el mensaje
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank"); // Abre WhatsApp en una nueva pestaña
}

// Crea el botón de compartir dinámicamente
const btnCompartir = document.createElement("button");
btnCompartir.textContent = "📲 Compartir por WhatsApp"; // Texto del botón
btnCompartir.style.marginTop = "1rem"; // Espaciado superior
btnCompartir.addEventListener("click", compartirWhatsApp); // Evento de clic
document.getElementById("accionesExtras").appendChild(btnCompartir); // Lo añade al contenedor HTML
