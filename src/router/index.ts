import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'
import rutasUsuario from '@/router/usuarios/usuariosRoutes'
import rutasCursos from '@/router/cursos/cursosRoutes'
import rutasDisciplinas from '@/router/disciplinas/disciplinasRoutes'
import rutasAdmin from '@/router/admin/adminRoutes'
//import adminRoutes from '@/router/admin/adminRoutes'

import rutasDisponibilidad from '@/router/disponibilidad/disponibilidadRoutes'
import rutasReserva from '@/router/reserva/reservaRoutes'
import { LanzarAlerta } from '@/utils/alertas'
//import rutasAdminUser from '@/router/admin/adminUsuariosRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...rutasAuth,

    ...rutasUsuario,
    ...rutasCursos,
    ...rutasDisciplinas,
    ...rutasAdmin,
    ...rutasDisponibilidad,
    ...rutasReserva,
    //...rutasAdminUser,
  ],
})

router.beforeEach((to, from, next) => {
  let isAuthenticated = false
  const rol = localStorage.getItem('rol')
  if (rol) {
    isAuthenticated = true
  }

  if (to.meta.requiresAuthExt && rol === 'EXTERNO') {
    LanzarAlerta('No tienes permiso para acceder a esta sección.', 'warning')
  } else if ((to.name === 'login' || to.name === 'registrar') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
