export interface Instalacion {
  id: number
  nombre: string
  estado: 'ACTIVO' | 'INACTIVO'
  ubicacion: string
  disciplinaId: number
  disciplinaNombre: string
}
