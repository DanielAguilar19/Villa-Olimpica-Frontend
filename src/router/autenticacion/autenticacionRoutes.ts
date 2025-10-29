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
]
