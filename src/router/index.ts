import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasAuth, ...rutasUsuario],
})

export default router
