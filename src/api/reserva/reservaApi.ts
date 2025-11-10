import type { usuario } from '@/interfaces/usuarios/usuario'
import axios from 'axios'

const usuario: usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
export async function reservarSimple(
  instalacionId: number,
  fechaYYYYMMDD: string,
  horaHHmm: string,
) {
  const { data } = await axios.post<string>(
    `${import.meta.env.VITE_API}/reservas/crear`,
    usuario.id,
    {
      params: {
        instalacionId,
        fecha: fechaYYYYMMDD,
        hora: horaHHmm,
      },
    },
  )
  return data
}
