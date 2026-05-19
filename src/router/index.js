import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('../views/Login.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('../views/Register.vue'), meta: { guest: true } },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('kaname_token')
  if (to.meta.auth && !token) return '/login'
  if (to.meta.guest && token) return '/dashboard'
})

export default router
