import { createRouter, createWebHistory } from 'vue-router'
import rutasAuth from '@/router/autenticacion/autenticacionRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasAuth],
})

export default router
