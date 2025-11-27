export interface login {
  correo: string
  password: string
}

export interface loginResponse {
  id: number
  correo: string
  nombre: string
  tipoUsuario: 'ADMIN' | 'INSTRUCTOR' | 'EXTERNO' | string
  estado: 'string'
}
