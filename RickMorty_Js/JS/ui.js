//Renderizar lista de personajes
export function renderizarPersonajes(personajes, onClickCard) {
  const contenedor = document.getElementById("personaje");
  contenedor.innerHTML = "";

  personajes.forEach((personaje) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h2>${personaje.name}</h2>
      <img src="${personaje.image}" alt="${personaje.name}" style="width:100px;">
      <p>${personaje.species}</p>
      <p>${personaje.status}</p>
    `;

    div.addEventListener("click", () => onClickCard(personaje));
    contenedor.appendChild(div);
  });
}

//Mostrar detalles de un personaje
export function renderCharactersDetails(container, character) {
  container.innerHTML = `
    <h2>${character.name}</h2>
    <img src="${character.image}" alt="${character.name}">
    <p>Estado: ${character.status}</p>
    <p>Especie: ${character.species}</p>
    <p>Género: ${character.gender}</p>
    <p>Origen: ${character.origin.name}</p>
  `;
}

export function showModal(character, modal, modalBody) {
  modalBody.innerHTML = `
    <h2>${character.name}</h2>
    <img src="${character.image}" alt="${character.name}" style="width:150px; border-radius:8px;">
    <p><strong>Estado:</strong> ${character.status}</p>
    <p><strong>Especie:</strong> ${character.species}</p>
    <p><strong>Género:</strong> ${character.gender}</p>
    <p><strong>Origen:</strong> ${character.origin.name}</p>`;

  modal.style.display = "block";
}
