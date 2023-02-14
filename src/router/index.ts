import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'lotto',
    component: () => import('../views/lotto.vue')
  },
  {
    path: '/bingo',
    name: 'bingo',
    component: () => import('../views/bingo.vue')
  },
  {
    path: '/bingo2',
    name: 'bingo2',
    component: () => import('../views/bingo2.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
