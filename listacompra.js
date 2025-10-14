// 🔐 Codis de família i contrasenyes incrustats
const familias = {
  "AAA": { nombre: "Trikis Family", password: "1234" },
  "BBB": { nombre: "Familia López", password: "lopez123" },
  "CCC": { nombre: "Familia Torres", password: "torres456" },
  "FAM123": { nombre: "Familia Martínez", password: "martinez789" },
  "OGZ2025": { nombre: "Familia Gozálvez", password: "ogzpass" }
};

// 🔗 Elements del DOM
const lista = document.getElementById("listaProductos");
const input = document.getElementById("productoInput");
const btnAgregar = document.getElementById("btnAgregar");
const codigoTexto = document.getElementById("codigoFamilia");

// 🔍 Obtenir codi de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// 🔒 Validació de codi
if (!codigo || !familias[codigo]) {
  document.body.innerHTML = `
    <main style="text-align:center; padding:2rem;">
      <h2>🚫 Acceso denegado</h2>
      <p>Este código de familia no está autorizado.</p>
    </main>
  `;
  throw new Error("Código no válido");
}

// 🔑 Validació de contrasenya (si existeix)
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

// ✅ Mostrar codi i nom
codigoTexto.textContent = `Código de familia: ${codigo} (${familia.nombre})`;

// 📦 Carregar llista
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

// 🧾 Renderitzar amb numeració
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

// 💾 Guardar
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

// 🔘 Botó compartir
const btnCompartir = document.createElement("button");
btnCompartir.textContent = "📲 Compartir por WhatsApp";
btnCompartir.style.marginTop = "1rem";
btnCompartir.addEventListener("click", compartirWhatsApp);
document.getElementById("accionesExtras").appendChild(btnCompartir);