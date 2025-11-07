import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'
import rutasDisciplinas from '@/router/disciplinas/disciplinasRoutes' // 👈 Importa las rutas nuevas

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...rutasAuth,
    ...rutasUsuario,
    ...rutasDisciplinas, // 👈 Añádelas aquí
  ],
})

export default router

