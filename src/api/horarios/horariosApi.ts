import type { Horario, HorarioForm } from '@/interfaces/horario/IHorario'
import axios from 'axios'

// Función auxiliar para convertir el formulario al formato del backend
const formatHorarioForBackend = (form: HorarioForm) => {
  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    id: form.id || 0,
    instalacionId: form.instalacionId || 0,
    diaSemana: form.diaSemana || 0,
    horaInicio: form.horaInicio,
    horaFin: form.horaFin,
    vigenteDesde: formatDate(form.vigenteDesde),
    vigenteHasta: formatDate(form.vigenteHasta),
  }
}

export const getHorarios = async (): Promise<Horario[]> => {
  const response = await axios.get('/horarios')
  return response.data
}

export const getHorarioById = async (id: number): Promise<Horario> => {
  const response = await axios.get(`/horarios/${id}`)
  return response.data
}

export const getHorariosByInstalacion = async (instalacionId: number): Promise<Horario[]> => {
  const response = await axios.get(`/horarios/instalacion/${instalacionId}`)
  return response.data
}

export const createHorario = async (horario: HorarioForm) => {
  const formatted = formatHorarioForBackend(horario)
  const response = await axios.post('/horarios', formatted)
  return response.data
}

export const updateHorario = async (id: number, horario: HorarioForm) => {
  const formatted = formatHorarioForBackend(horario)
  const response = await axios.put(`/horarios/${id}`, formatted)
  return response.data
}

export const deleteHorario = async (id: number) => {
  await axios.delete(`/horarios/${id}`)
}
