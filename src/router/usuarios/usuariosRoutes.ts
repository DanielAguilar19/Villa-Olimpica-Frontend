export default [
  {
    path: '/registrar',
    name: 'registrar',
    component: () => import('@/features/auth/views/registrarView.vue'),
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
