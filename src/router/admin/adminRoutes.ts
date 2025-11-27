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
        component: () => import('@/features/admin/views/GestionReservasView.vue'),
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
        path: 'usuarios',
        name: 'gestionUsuarios',
        component: () => import('@/features/admin/views/GestionUsuariosView.vue'),
      },

      {
        path: 'instalaciones',
        name: 'GestionInstalaciones',
        component: () => import('@/views/GestionInstalaciones.vue'),
      },
      {
        path: 'asignar-curso',
        name: 'AsignarCurso',
        component: () => import('@/features/admin/views/AsignarCursoView.vue'),
      },
      {
        path: 'horarios',
        name: 'horarios',
        component: () => import('@/features/horarios/horariosListView.vue'),
      },
      {
        path: 'horarios/nuevo',
        name: 'horarios-nuevo',
        component: () => import('@/features/horarios/horariosForm.vue'),
      },
      {
        path: 'horarios/editar/:id',
        name: 'horarios-editar',
        component: () => import('@/features/horarios/horariosView.vue'),
      },
    ],
  },
]
