import type { crearUsuario } from '@/interfaces/usuarios/usuario'
import axios from 'axios'

export const crearUsuarioFinal = async (usuario: crearUsuario) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API}/auth/register`, usuario, {
      headers: { 'Content-Type': 'application/json' },
    })

    return response.data
  } catch (error) {
    console.error('Error creando el usuario:', error)
    throw error
  }
}
