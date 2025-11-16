import type { usuario } from '@/interfaces/usuarios/usuario'
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
