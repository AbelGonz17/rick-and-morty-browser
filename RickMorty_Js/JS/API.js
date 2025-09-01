const API_URL = "https://rickandmortyapi.com/api/character";

// Función para obtener personajes
export async function getCharacters(url = API_URL) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener personajes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [], info: {} };
  }
}

// Función para buscar personajes por nombre
export async function searchCharacters(name) {
  try {
    const url = `${API_URL}/?name=${name}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al buscar personajes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [], info: {} };
  }
}

// Función para obtener un personaje por ID
export async function getCharacterById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error al obtener el personaje por Id");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
