export default [
  {
    path: '/admin',
    component: () => import('@/components/Layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin'
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        //  REDIRECCIÓN x mientras
        redirect: '/admin/reservas'
      },
      {
        path: 'reservas',
        name: 'GestionReservas',
        component: () => import('@/features/admin/views/GestionReservasView.vue'),
      },

      // 3. Gestión de Disciplinas
      {
        path: 'disciplinas', // La ruta final será /admin/disciplinas
        name: 'GestionDisciplinas',
        component: () => import('@/features/admin/views/GestionDisciplinasView.vue'),
      },
    ]
  }
];


