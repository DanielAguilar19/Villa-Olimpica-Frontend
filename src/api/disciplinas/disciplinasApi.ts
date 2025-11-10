import type { Disciplina } from '@/interfaces/disciplinas/disciplinas'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

export async function obtenerDisciplinas(): Promise<Disciplina[] | undefined> {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/disciplinas`, {})
    return response.data
  } catch (error) {
    LanzarAlerta('Error al obtener las disciplinas', 'error')
    console.log(error)
  }
}
