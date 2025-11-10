import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

export async function obtenerInstalacionesPorDisciplina(disciplinaId: number) {
  try {
    const { data } = await axios.get<Instalacion[]>(
      `${import.meta.env.VITE_API}/instalaciones/por-disciplina/${disciplinaId}`,
    )
    return data
  } catch (error) {
    console.error('Error al obtener las instalaciones por disciplina', error)
    LanzarAlerta('Error al obtener las instalaciones', 'error')
  }
}
