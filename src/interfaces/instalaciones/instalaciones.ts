export interface Instalacion {
  id: number
  nombre: string
  estado: 'ACTIVO' | 'INACTIVO'
  ubicacion: string
  disciplinaId: number
  disciplinaNombre: string
}

export interface CrearInstalacionDTO {
  nombre: string
  ubicacion: string
  disciplinaId: number
  estado?: 'ACTIVO' | 'INACTIVO'
}

