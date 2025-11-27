import axios from 'axios'
import type { TipoUsuario } from '@/interfaces/tiposUsuario/tipoUsuario'
import { LanzarAlerta } from '@/utils/alertas'

const base = `${import.meta.env.VITE_API}/tipos-usuario`

export const getTiposUsuario = async (): Promise<TipoUsuario[]> => {
  try {
    const res = await axios.get<TipoUsuario[]>(base)
    return res.data
  } catch (error) {
    LanzarAlerta('error obteniendo los tipos de usuario', 'error')
    console.log(error)
    return []
  }
}
