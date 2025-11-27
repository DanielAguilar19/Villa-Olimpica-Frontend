import axios from "axios";

export const obtenerCursos = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/cursos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return [];
  }
};

