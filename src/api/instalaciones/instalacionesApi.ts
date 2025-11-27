import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { LanzarAlerta } from '@/utils/alertas'
import axios from 'axios'

export async function obtenerInstalacionesPorDisciplina(disciplinaId: number) {
  try {
    const { data } = await axios.get<Instalacion[]>(
      `${import.meta.env.VITE_API}/instalaciones/por-disciplina/${disciplinaId}`,
    )
    return data
  } catch (error) {
    console.error('Error al obtener las instalaciones por disciplina', error)
    LanzarAlerta('Error al obtener las instalaciones', 'error')
  }
}

export async function cambiarEstadoInstalacion(
  instalacionId: number,
  nuevoEstado: 'ACTIVO' | 'INACTIVO'
) {
  try {
    const { data } = await axios.patch<Instalacion>(
      `${import.meta.env.VITE_API}/instalaciones/${instalacionId}/estado`,
      { estado: nuevoEstado }
    )
    LanzarAlerta('Estado actualizado correctamente', 'success')
    return data
  } catch (error) {
    console.error('Error al cambiar el estado de la instalación', error)
    LanzarAlerta('Error al cambiar el estado', 'error')
    throw error
  }
}

export interface CrearInstalacionDTO {
  nombre: string
  ubicacion: string
  disciplinaId: number
  estado?: 'ACTIVO' | 'INACTIVO'
}

export async function crearInstalacion(datos: CrearInstalacionDTO) {
  try {
    const { data } = await axios.post<Instalacion>(
      `${import.meta.env.VITE_API}/instalaciones`,
      datos
    )
    LanzarAlerta('Instalación creada exitosamente', 'success')
    return data
  } catch (error) {
    console.error('Error al crear la instalación', error)
    LanzarAlerta('Error al crear la instalación', 'error')
    throw error
  }
}

// ACTUALIZADO: Ahora usa el endpoint /todas
export async function obtenerTodasLasInstalaciones() {
  try {
    console.log('📋 Obteniendo TODAS las instalaciones (activas e inactivas)...')
    const { data } = await axios.get<Instalacion[]>(
      `${import.meta.env.VITE_API}/instalaciones/todas`
    )
    console.log(`✅ Recibidas ${data.length} instalaciones:`, data)
    return data
  } catch (error) {
    console.error('Error al obtener todas las instalaciones', error)
    LanzarAlerta('Error al obtener las instalaciones', 'error')
  }
}

// NUEVO: Obtener solo las activas
export async function obtenerInstalacionesActivas() {
  try {
    const { data } = await axios.get<Instalacion[]>(
      `${import.meta.env.VITE_API}/instalaciones/activas`
    )
    return data
  } catch (error) {
    console.error('Error al obtener las instalaciones activas', error)
    LanzarAlerta('Error al obtener las instalaciones', 'error')




    
  }



  
}

// NUEVO: Obtener disciplinas para el dropdown
export interface Disciplina {
  id: number
  nombre: string
}

export async function obtenerDisciplinas() {
  try {
    const { data } = await axios.get<Disciplina[]>(
      `${import.meta.env.VITE_API}/disciplinas`
    )
    return data
  } catch (error) {
    console.error('Error al obtener las disciplinas', error)
    LanzarAlerta('Error al obtener las disciplinas', 'error')
    return []
  }
}
