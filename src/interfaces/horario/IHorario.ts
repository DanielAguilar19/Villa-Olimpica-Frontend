export interface Horario {
  id: number
  instalacionId: number
  diaSemana: number
  horaInicio: string
  horaFin: string
  vigenteDesde: string
  vigenteHasta: string
}

export interface HorarioForm {
  id?: number
  instalacionId: number | null
  diaSemana: number | null
  horaInicio: string
  horaFin: string
  vigenteDesde: Date | null
  vigenteHasta: Date | null
}

export interface DiaSemana {
  value: number
  label: string
}

export const DIAS_SEMANA: DiaSemana[] = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
]
