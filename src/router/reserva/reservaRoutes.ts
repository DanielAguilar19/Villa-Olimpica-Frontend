export default [
  {
    path: '/reservas/usuario/:usuarioId',
    name: 'ReservasUsuario',
    component: () => import('@/features/reservas/views/reservasUsuarioView.vue'),
    props: true,
  },
]
