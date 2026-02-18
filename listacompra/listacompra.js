// 🔐 Configuración Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, remove, onValue, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCE_vOx4G6791luS7XlkZmtGghcr5s43zg",
  authDomain: "listacomprafamilia.firebaseapp.com",
  databaseURL: "https://listacomprafamilia-default-rtdb.firebaseio.com",
  projectId: "listacomprafamilia",
  storageBucket: "listacomprafamilia.appspot.com",
  messagingSenderId: "906261582139",
  appId: "1:906261582139:web:7b8582fb7857e3ee9f671e"
};

// ✅ Inicializar Firebase solo si no existe una instancia previa
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Iniciar sesión anónima
signInAnonymously(auth)
  .then(() => console.log("Sesión anónima iniciada ✅"))
  .catch((error) => console.error("Error sesión anónima:", error));

// 🔗 Elementos del DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🔍 Función principal (async para usar await)
async function init() {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");

  // ⚠️ Validar que haya código
  if (!codigo) {
    document.body.innerHTML = `
      <main style="text-align:center; padding:2rem;">
        <h2>🚫 Acceso denegado</h2>
        <p>No se ha proporcionado un código de familia.</p>
      </main>`;
    throw new Error("Código no proporcionado");
  }

  // 🔐 Comprobar contraseña en Firebase
  const passwordRef = ref(db, `familias/${codigo}/password`);
  const snapshot = await get(passwordRef);

  if (!snapshot.exists()) {
    document.body.innerHTML = `
      <main style="text-align:center; padding:2rem;">
        <h2>❌ Familia no encontrada</h2>
        <p>El código <b>${codigo}</b> no está registrado.</p>
      </main>`;
    throw new Error("Código de familia no encontrado");
  }

  const passwordCorrecta = snapshot.val();
  const intento = prompt(`Introduce la contraseña de la familia ${codigo}:`);

  if (intento !== passwordCorrecta) {
    document.body.innerHTML = `
      <main style="text-align:center; padding:2rem;">
        <h2>🔒 Contraseña incorrecta</h2>
        <p>No tienes acceso a esta lista.</p>
      </main>`;
    throw new Error("Contraseña incorrecta");
  }

  // ✅ Si todo correcto
  codigoTexto.textContent = `Código de familia: ${codigo}`;

  // 📦 Referencia a los productos
  const listaRef = ref(db, `listas/${codigo}/productos`);
  let productos = [];
  let productosFirebase = {};

  // Escuchar cambios en tiempo real
  onValue(listaRef, (snapshot) => {
    const data = snapshot.val() || {};
    productosFirebase = data;
    productos = Object.keys(data).map(key => ({
      key: key,
      valor: data[key]
    }));
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
    const key = productos[index].key;
    remove(ref(db, `listas/${codigo}/productos/${key}`));
  }

  // 🧾 Renderizar lista
  function renderizarLista() {
    lista.innerHTML = "";
    productos.forEach((productoObj, index) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = `${index + 1}. ${productoObj.valor}`;
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.setAttribute("aria-label", `Eliminar ${productoObj.valor}`);
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

  // 📲 Compartir por WhatsApp
  function compartirWhatsApp() {
    if (productos.length === 0) {
      alert("La lista está vacía.");
      return;
    }
    const mensaje = `🛒 Lista de la compra (${codigo}):\n` +
      productos.map((p, i) => `${i + 1}. ${p.valor}`).join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }

  // Crear botón de compartir
  const btnCompartir = document.createElement("button");
  btnCompartir.textContent = "📲 Compartir por WhatsApp";
  btnCompartir.style.marginTop = "1rem";
  btnCompartir.addEventListener("click", compartirWhatsApp);
  document.getElementById("accionesExtras").appendChild(btnCompartir);
}

// 🚀 Ejecutar la función principal
init();
