export default [
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
