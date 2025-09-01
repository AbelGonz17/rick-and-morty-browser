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
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const filtroEstado = document.getElementById("filtroEstado");
const filtroEspecie = document.getElementById("filtroEspecie");

// -----------------------------
// Variables globales
// -----------------------------
let nextPage = null;
let prevPage = null;
let personajesActuales = [];
let estadoFiltro = "";
let especieFiltro = "";

// -----------------------------
// Función para cargar personajes
// -----------------------------
async function cargarPersonajes(
  url = "https://rickandmortyapi.com/api/character"
) {
  contenedor.innerHTML = "<p>Cargando...</p>";
  personajesActuales = await cargarPersonajesFiltrados(url, 20);
  // Aplicamos filtro si hay uno seleccionado
  renderizarPersonajes(personajesActuales, (personaje) =>
    showModal(personaje, modal, modalBody)
  );

  const data = await getCharacters(url);
  // Guardamos URLs de siguiente y anterior página
  nextPage = data.info.next;
  prevPage = data.info.prev;

  // Desactivar botones si no hay página
  btnNext.disabled = !nextPage;
  btnPrev.disabled = !prevPage;
}

async function cargarMultiplesPersonajes(urlBase, cantidad = 20) {
  let personajes = [];
  let url = urlBase;

  while (personajes.length < cantidad && url) {
    const data = await getCharacters(url);
    personajes = [...personajes, ...data.results];
    url = data.info.next;
  }

  return personajes.slice(0, cantidad);
}

async function cargarPersonajesFiltrados(urlBase, cantidad = 20) {
  let personajes = [];
  let url = urlBase;

  while (personajes.length < cantidad && url) {
    const data = await getCharacters(url);
    let resultados = data.results;

    // Aplicar filtros y búsqueda
    if (estadoFiltro) {
      resultados = resultados.filter((p) => p.status === estadoFiltro);
    }
    if (especieFiltro) {
      resultados = resultados.filter((p) => p.species === especieFiltro);
    }
    const nombre = inputBusqueda.value.trim();
    if (nombre) {
      resultados = resultados.filter((p) =>
        p.name.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    personajes = [...personajes, ...resultados];
    url = data.info.next;
  }

  return personajes.slice(0, cantidad);
}

// -----------------------------
// Función para aplicar filtro
// -----------------------------
async function aplicarFiltros() {
  let url = "https://rickandmortyapi.com/api/character/?";

  if (estadoFiltro) {
    url += `status=${estadoFiltro}&`;
  }
  if (especieFiltro) {
    url += `species=${especieFiltro}&`;
  }
  const nombre = inputBusqueda.value.trim();
  if (nombre) {
    url += `name=${nombre}&`;
  }

  if (estadoFiltro || especieFiltro || nombre) {
    // Si hay filtros activos, pedimos otra vez a la API
    personajesActuales = await cargarMultiplesPersonajes(url, 20);
  }

  renderizarPersonajes(personajesActuales, (personaje) =>
    showModal(personaje, modal, modalBody)
  );
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
// -----------------------------
// Eventos botones
// -----------------------------
btnNext.addEventListener("click", async () => {
  if (nextPage) await cargarPersonajes(nextPage);
});

btnPrev.addEventListener("click", async () => {
  if (prevPage) await cargarPersonajes(prevPage);
});

//esto hace que la busqueda se haga al escribir
inputBusqueda.addEventListener(
  "input",
  debounce(async () => {
    const nombre = inputBusqueda.value.trim();
    if (nombre) {
      personajesActuales = await cargarMultiplesPersonajes(
        `https://rickandmortyapi.com/api/character/?name=${nombre}`,
        20
      );
      aplicarFiltros();

      // Actualizamos paginación
      btnNext.disabled = true;
      btnPrev.disabled = true;
    } else {
      cargarPersonajes();
    }
  }, 400)
);

// -----------------------------
// Evento filtro dropdown
// -----------------------------
filtroEstado.addEventListener("change", async () => {
  estadoFiltro = filtroEstado.value;
  await aplicarFiltros();
});

filtroEspecie.addEventListener("change", async () => {
  especieFiltro = filtroEspecie.value;
  await aplicarFiltros();
});
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
especieFiltro = "";
filtroEstado.value = "";
filtroEspecie.value = "";
cargarPersonajes();
