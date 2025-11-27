import type { obtenerReservas } from '@/interfaces/reserva/reserva'
import type { usuario } from '@/interfaces/usuarios/usuario'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

const usuario: usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
export async function reservarSimple(
  username: number,
  instalacionId: number,
  fechaYYYYMMDD: string,
  horaHHmm: string,
) {
  const { data } = await axios.post<string>(
    `${import.meta.env.VITE_API}/reservas/crear`,
    usuario.id,
    {
      params: {
        username,
        instalacionId,
        fecha: fechaYYYYMMDD,
        hora: horaHHmm,
      },
    },
  )
  return data
}

export const reservasApi = {
  async getAllByUsuario(usuarioId: number): Promise<obtenerReservas[]> {
    const res = await axios.get(`${import.meta.env.VITE_API}/reservas/usuario/${usuarioId}/all`)
    return res.data
  },
}

export const obtenerTodasReservas = async (): Promise<obtenerReservas[]> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}/reservas/all`)
    return res.data
  } catch (error) {
    LanzarAlerta('No se pudieron obtener los reservas.', 'error')
    console.error(error)
  }
  return []
}
