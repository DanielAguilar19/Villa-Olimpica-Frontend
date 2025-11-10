export interface crearUsuario {
  tipoUsuarioId: number
  nombre: string
  correo: string
  password: string
  telefono: string
}

export interface usuario {
  correo: string
  estado: string
  id: number
  nombre: string
  tipoUsuario: string
}
