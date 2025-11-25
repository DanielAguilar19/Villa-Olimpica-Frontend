export default [
  {
    path: '/',
    name: 'base',
    redirect: { name: 'login' },
  },
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

  {
    path: '/mis-cursos',
    name: 'mis-cursos',
    component: () => import('@/views/MisCursosView.vue'),
  },

  {
    path: '/mis-cursos-instructor',
    name: 'mis-cursos-instructor',
    component: () => import('@/views/MisCursosInstructorView.vue'),
  },
  // Rutas protegidas
  // RUTAS PRIVADAS (requieren autenticación)
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/userHomePageView.vue'),
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
