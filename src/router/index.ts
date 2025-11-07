import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasAuth, ...rutasUsuario],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('usuario')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere auth y NO está autenticado, va al login
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'registrar') && isAuthenticated) {
    // Si YA está autenticado e intenta ir al login, va al home
    next({ name: 'home' })
  } else {
    next()
  }
  })

export default router
