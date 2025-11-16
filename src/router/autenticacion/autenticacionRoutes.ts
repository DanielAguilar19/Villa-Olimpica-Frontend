//EJEMPLO DE RUTAS MODULARES
export default [
  {
    path: '/',
    name: 'login',
    component: () => import('@/features/auth/views/loginView.vue'),
    //    children: [
    //      {
    //        path: '',
    //        name: 'UserList',
    //        component: () => import('../views/HomeView.vue'),
    //      },
    //      {
    //        path: ':id',
    //        name: 'UserDetail',
    //        component: () => import('../views/HomeView.vue'),
    //      },
    //    ],
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/userHomePageView.vue'),
    meta: { requiresAuthExt: true },
  },
  {
    path: '/disciplinas',
    name: 'disciplinas',
    component: () => import('@/features/disciplinas/views/DisciplinasView.vue'),
    meta: { requiresAuthExt: true },
  },
  {
    path: '/disciplinas/:id',
    name: 'disciplinaDetalle',
    component: () => import('@/features/disciplinas/views/DisciplinaDetalleView.vue'),
    props: true,
    meta: { requiresAuthExt: true },
  },
]
