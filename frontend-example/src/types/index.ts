export type Page = 'login' | 'signup' | 'dashboard'

export interface User {
  id: number
  name: string
  email: string
  matricula: string
  curso: string
  periodo: string
  semestre: string
  password: string
  avatar: string | null
}
