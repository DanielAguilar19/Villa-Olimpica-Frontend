export default [
  {
    path: '/instalaciones/:id/disponibilidad',
    name: 'resrvacion-disponibilidad',
    component: () => import('@/features/disponibilidad/views/disponibilidadView.vue'),
  },
]
