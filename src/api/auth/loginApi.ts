import type { login } from '@/interfaces/auth/ILogin'
import axios from 'axios'

export const loginUsuarios = async (usuario: login) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API}/auth/login`, usuario, {
      headers: { 'Content-Type': 'application/json' },
    })

    return response.data
  } catch (error) {
    console.error('Error haciendo login:', error)
    throw error
  }
}

/*
EJEMPLO DE API TIPADA
export const obtenerUsuarios = async (): Promise<UsuarioData | undefined> => {
  try {
    const response = await api.get<UsuarioData>(`/seguridad/v1/Usuario`, {
      params: {},
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log('Error obteniendo usuarios', error);
  }
};
*/
