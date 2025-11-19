export default [
  {
    path: '/admin',
    component: () => import('@/components/Layouts/AdminLayout.vue'),
    // TEMPORAL: Sin autenticación 
    children: [
      {
        path: '',
        redirect: 'reservas' // Temporal: Redirige directo a reservas
      },
      {
        path: 'reservas',
        name: 'AdminReservas',
        component: () => import('@/features/admin/views/GestionReservasView.vue')
      },
      {
        path: 'disciplinas',
        name: 'AdminDisciplinas',
        component: () => import('@/features/admin/views/GestionDisciplinasView.vue')
      }
    ]
  }
];
