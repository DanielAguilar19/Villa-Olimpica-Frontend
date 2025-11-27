import axios from 'axios';

// Crear instancia con la URL base
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token si existe

// ============================================
// INTERFACES
// ============================================
export interface CursoCardDTO {
  id: number;
  titulo: string;
  descripcion: string;
  disciplinaNombre: string;
  estado: string;
  instructorNombre?: string;
}

export interface CursoInscripcionDTO {
  inscripcionId: number;
  cursoId: number;
  cursoTitulo: string;
  usuarioId: number;
  usuarioNombre: string;
  estado: string;
  inscritoEn: string;
  canceladoEn?: string | null;
}

export interface CursoInscripcion {
  id: number;
  cursoId: number;
  usuarioId: number;
  estado: string;
  inscritoEn: string;
  canceladoEn?: string | null;
}

export interface InscripcionRequest {
  cursoId: number;
  usuarioId: number;
}

export interface VerificarInscripcionResponse {
  inscrito: boolean;
}

export interface ContarInscritosResponse {
  inscritosActivos: number;
}

export interface MensajeResponse {
  mensaje: string;
}

// Interface para lo que devuelve el backend
interface CursoCardBackendDTO {
  idCurso: number;
  nombreDisciplina: string;
  nombreInstructor: string;
  tituloCurso: string;
  estadoCurso: string;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================
const mapCursoFromBackend = (backendCurso: CursoCardBackendDTO): CursoCardDTO => {
  return {
    id: backendCurso.idCurso,
    titulo: backendCurso.tituloCurso,
    descripcion: `Curso de ${backendCurso.nombreDisciplina} impartido por ${backendCurso.nombreInstructor}`,
    disciplinaNombre: backendCurso.nombreDisciplina,
    estado: backendCurso.estadoCurso,
    instructorNombre: backendCurso.nombreInstructor
  };
};

// ============================================
// FUNCIONES API
// ============================================
const BASE_URL = '/api/inscripciones';
const API_URL = "http://localhost:8080/api/cursos";


export const inscribirUsuario = async (
  request: InscripcionRequest
): Promise<CursoInscripcion> => {
  const response = await api.post<CursoInscripcion>(BASE_URL, request);
  return response.data;
};


export const getCursosActivosByUsuario = async (
  usuarioId: number
): Promise<CursoCardDTO[]> => {
  const response = await api.get<CursoCardBackendDTO[]>(
    `${BASE_URL}/usuario/${usuarioId}/cursos/cards`
  );
  return response.data.map(mapCursoFromBackend);
};

export const getAllCursosByUsuario = async (
  usuarioId: number
): Promise<CursoCardDTO[]> => {
  const response = await api.get<CursoCardBackendDTO[]>(
    `${BASE_URL}/usuario/${usuarioId}/cursos/all`
  );
  return response.data.map(mapCursoFromBackend);
};

export const getInscripcionesByUsuario = async (
  usuarioId: number
): Promise<CursoInscripcionDTO[]> => {
  const response = await api.get<CursoInscripcionDTO[]>(
    `${BASE_URL}/usuario/${usuarioId}`
  );
  return response.data;
};

export const obtenerCursos = async (): Promise<CursoCardDTO[]> => {
  const respuesta = await axios.get<CursoCardBackendDTO[]>(`${API_URL}/todos`);
  return respuesta.data.map(mapCursoFromBackend);
};

export const verificarInscripcion = async (
  cursoId: number,
  usuarioId: number
): Promise<boolean> => {
  const response = await api.get<VerificarInscripcionResponse>(
    `${BASE_URL}/verificar`,
    { params: { cursoId, usuarioId } }
  );
  return response.data.inscrito;
};

export const contarInscritosActivos = async (
  cursoId: number
): Promise<number> => {
  const response = await api.get<ContarInscritosResponse>(
    `${BASE_URL}/curso/${cursoId}/count`
  );
  return response.data.inscritosActivos;
};

export const cancelarInscripcion = async (
  usuarioId: number,
  cursoId: number
): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(`${BASE_URL}/cancelarcurso`, {
    usuarioId,
    cursoId
  });
  return response.data;
};


export const getCursosByInstructor = async (
  instructorId: number
): Promise<CursoCardDTO[]> => {
  const response = await api.get<CursoCardBackendDTO[]>(
    `${BASE_URL}/instructor/${instructorId}/cursos`
  );
  return response.data.map(mapCursoFromBackend);
};

export const getInscritosPorCurso = async (
  instructorId: number,
  cursoId: number
): Promise<number> => {
  const response = await api.get<{ totalInscritos: number }>(
    `${BASE_URL}/instructor/${instructorId}/cursos/${cursoId}/inscritos`
  );
  return response.data.totalInscritos;
};
