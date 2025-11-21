import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasAuth, ...rutasUsuario],
})

// ⚠️ COMENTAR TODO ESTO TEMPORALMENTE
/*
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('usuario')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'registrar') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})
*/

export default router