// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'

const routes = [
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/Dashboard.vue'),
    redirect: '/settings',
    children: [
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/Test.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: '/vehicles',
        name: 'Vehicles',
        component: () => import('@/views/Vehicles.vue'),
      },
      {
        path: '/drivers',
        name: 'Drivers',
        component: () => import('@/views/Drivers.vue'),
      },
      {
        path: '/trips',
        name: 'Trips',
        component: () => import('@/views/Trips.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

const user = (await supabase.auth.getUser()).data.user

router.beforeEach(async (to) => {
  if (!user && to.name !== 'Login') {
    return '/login'
  }
  else if (user && to.name === 'Login') {
    return '/'
  }
})

export default router
