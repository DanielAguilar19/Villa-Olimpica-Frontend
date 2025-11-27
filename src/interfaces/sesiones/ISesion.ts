export interface CrearSesion {
  cursoId: number
  instalacionId: number
  cupos: number
  dia: string | null
  horaInicio: string | null
  horaFin: string | null
}

export interface Sesion {
  id: number
  cupos: number
  dia: string | null
  horaInicio: string | null
  horaFin: string | null
  cursoId: number
  creadoEn?: string
}
