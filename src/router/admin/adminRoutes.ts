export default [
  {
    path: '/admin',
    component: () => import('@/components/Layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        redirect: '/admin/reservas',
      },
      {
        path: '/user/home',
        name: 'adminHome',
        component: () => import('@/views/adminHomePageView.vue'),
      },
      {
        path: 'reservas',
        name: 'GestionReservas',
        component: () => import('@/views/adminHomePageView.vue'),
      },
      {
        path: 'disciplinas',
        name: 'GestionDisciplinas',
        component: () => import('@/features/admin/views/GestionDisciplinasView.vue'),
      },
      {
        path: 'crear-usuarios',
        name: 'CrearUsuarios',
        component: () => import('@/features/admin/views/CrearUsuarioView.vue'),
      },

        
      {
      path: '/admin/instalaciones',
      name: 'GestionInstalaciones',
      component: () => import('@/views/GestionInstalaciones.vue'),
      meta: { requiresAuth: true, role: 'admin' }
      }
    ],
  },
]
