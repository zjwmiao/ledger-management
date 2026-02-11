import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/activity-management'
    },
    {
      path: '/activity-management',
      name: 'ActivityManagement',
      component: () => import('@/views/ActivityManagement.vue')
    },
    {
      path: '/activity-detail',
      name: 'ActivityDetail',
      component: () => import('@/views/ActivityDetail.vue')
    },
    {
      path: '/developer-management',
      name: 'DeveloperManagement',
      component: () => import('@/views/DeveloperManagement.vue')
    },
    {
      path: '/content-management',
      name: 'ContentManagement',
      component: () => import('@/views/ContentManagement.vue')
    }
  ],
})

export default router
