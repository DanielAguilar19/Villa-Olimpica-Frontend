export default [
    {
    path: '/login',
      name: 'login',
      component: () => import('@/features/auth/views/loginView.vue'),
    },
    {
      path: '/registrar',
      name: 'registrar',
      component: () => import('@/features/auth/views/registrarView.vue'),
    },

    // Rutas protegidas
    // RUTAS PRIVADAS (requieren autenticación)
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/userHomePageView.vue'),
      meta: { requiresAuth: true }
    },
    /*
    {
      path: '/disciplinas',
      name: 'disciplinas',
      component: () => import('@/views/disciplinasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('@/views/cursosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('@/views/reservasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/perfilView.vue'),
      meta: { requiresAuth: true }
    },
    */

]
