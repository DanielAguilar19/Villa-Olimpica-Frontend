import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'
import rutasDisciplinas from '@/router/disciplinas/disciplinasRoutes'
import rutasDisponibilidad from '@/router/disponibilidad/disponibilidadRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasAuth, ...rutasUsuario, ...rutasDisciplinas, ...rutasDisponibilidad],
})
/*
router.beforeEach((to, from, next) => {
  let isAuthenticated = false
  if (localStorage.getItem('usuario')) {
    isAuthenticated = true
  }

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
*/
export default router
