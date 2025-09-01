import { getCharacterById, searchCharacters, getCharacters } from "./API.js";
import {
  renderCharactersDetails,
  showModal,
  renderizarPersonajes,
} from "./UI.JS";

// -----------------------------
// Elementos del DOM
// -----------------------------
const contenedor = document.getElementById("personaje");
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");
const inputBusqueda = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btnBuscar");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const filtroEstado = document.getElementById("filtroEstado");

// -----------------------------
// Variables globales
// -----------------------------
let nextPage = null;
let prevPage = null;
let personajesActuales = [];
let estadoFiltro = "";

// -----------------------------
// Función para cargar personajes
// -----------------------------
async function cargarPersonajes(url) {
  contenedor.innerHTML = "<p>Cargando...</p>";
  const data = await getCharacters(url);
  personajesActuales = data.results;

  // Aplicamos filtro si hay uno seleccionado
  let personajesAMostrar = personajesActuales;
  if (estadoFiltro) {
    personajesAMostrar = personajesActuales.filter(
      (personaje) => personaje.status === estadoFiltro
    );
  }

  // Renderizamos personajes filtrados con data-id
  renderizarPersonajes(personajesAMostrar, (personaje) =>
    showModal(personaje, modal, modalBody)
  );

  // Guardamos URLs de siguiente y anterior página
  nextPage = data.info.next;
  prevPage = data.info.prev;

  // Desactivar botones si no hay página
  btnNext.disabled = !nextPage;
  btnPrev.disabled = !prevPage;
}

// -----------------------------
// Función para aplicar filtro
// -----------------------------
function aplicarFiltroEstado() {
  const estadoSeleccionado = filtroEstado.value;
  estadoFiltro = estadoSeleccionado;

  const filtrados = estadoFiltro
    ? personajesActuales.filter(
        (personaje) => personaje.status === estadoFiltro
      )
    : personajesActuales;

  renderizarPersonajes(filtrados, (personaje) =>
    showModal(personaje, modal, modalBody)
  );
}

// -----------------------------
// Eventos botones
// -----------------------------
btnNext.addEventListener("click", () => cargarPersonajes(nextPage));
btnPrev.addEventListener("click", () => cargarPersonajes(prevPage));

btnBuscar.addEventListener("click", async () => {
  const nombre = inputBusqueda.value.trim();
  if (nombre) {
    const data = await searchCharacters(nombre);
    personajesActuales = data.results; // actualizamos array global
    aplicarFiltroEstado(); // aplicamos filtro sobre los resultados

    // Actualizamos paginación
    nextPage = data.info?.next || null;
    prevPage = data.info?.prev || null;
    btnNext.disabled = !nextPage;
    btnPrev.disabled = !prevPage;
  }
});

// -----------------------------
// Evento filtro dropdown
// -----------------------------
filtroEstado.addEventListener("change", aplicarFiltroEstado);

// -----------------------------
// Eventos modal
// -----------------------------
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// -----------------------------
// Click en tarjetas (data-id)
// -----------------------------
contenedor.addEventListener("click", async (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const id = card.dataset.id;
  if (id) {
    const personaje = await getCharacterById(id);
    showModal(personaje, modal, modalBody);
  }
});

// -----------------------------
// Cargar primera página al inicio
// -----------------------------
estadoFiltro = "";
filtroEstado.value = "";
cargarPersonajes();
