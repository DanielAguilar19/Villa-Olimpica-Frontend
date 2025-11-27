import type { Curso } from '@/interfaces/cursos/ICurso'
import type { Instalacion } from '../../interfaces/instalaciones/instalaciones'
import type { CrearSesion, Sesion } from '@/interfaces/sesiones/ISesion'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

export async function crearSesion(sesion: CrearSesion): Promise<Sesion | undefined> {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API}/sesiones`, sesion, {
      headers: { 'Content-Type': 'application/json' },
    })
    LanzarAlerta('Sesión creada exitosamente', 'success')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const mensaje = error.response?.data?.message || 'Error al crear la sesión'
      LanzarAlerta(mensaje, 'error')
    } else {
      LanzarAlerta('Error al crear la sesión', 'error')
    }
    console.error('Error creando la sesión:', error)
    throw error
  }
}

export async function getAllCursos(): Promise<Curso[] | undefined> {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/cursos`, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const mensaje = error.response?.data?.message || 'Error al obtener los cursos'
      LanzarAlerta(mensaje, 'error')
    } else {
      LanzarAlerta('Error al obtener los cursos', 'error')
    }
    console.error('Error obteniendo los cursos:', error)
    throw error
  }
}

export async function getAllInstalaciones(): Promise<Instalacion[] | undefined> {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/instalaciones`, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const mensaje = error.response?.data?.message || 'Error al obtener las instalaciones'
      LanzarAlerta(mensaje, 'error')
    } else {
      LanzarAlerta('Error al obtener las instalaciones', 'error')
    }
    console.error('Error obteniendo las instalaciones:', error)
    throw error
  }
}
