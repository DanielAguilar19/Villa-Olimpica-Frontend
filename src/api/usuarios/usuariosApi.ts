import type { crearUsuario, UsuarioView } from '@/interfaces/usuarios/usuario'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

export const registrarUsuario = async (usuario: crearUsuario) => {
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

const base = `${import.meta.env.VITE_API}/usuarios`

export const getAllUsuarios = async (): Promise<UsuarioView[]> => {
  try {
    const resp = await axios.get<UsuarioView[]>(`${base}/all`, {
      headers: { accept: '*/*' },
    })

    return resp.data
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    LanzarAlerta('Error al cargar usuarios. Revisa el backend.', 'error')
    throw error
  }
}

export const creaUsuario = async (payload: Partial<UsuarioView>) => {
  try {
    const resp = await axios.post(`${base}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
    LanzarAlerta('Usuario creado correctamente', 'success')
    return resp.data
  } catch (error) {
    console.error('Error creando usuario:', error)
    LanzarAlerta('Error creando usuario', 'error')
    throw error
  }
}

export const actualizarUsuario = async (id: number, payload: Partial<UsuarioView>) => {
  try {
    const resp = await axios.put(`${base}/${id}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
    LanzarAlerta('Usuario actualizado', 'success')
    return resp.data
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    LanzarAlerta('Error al actualizar usuario', 'error')
    throw error
  }
}

export const eliminarUsuario = async (id: number) => {
  try {
    await axios.delete(`${base}/${id}`)
    LanzarAlerta('Usuario eliminado', 'success')
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    LanzarAlerta('Error al eliminar usuario', 'error')
    throw error
  }
}
