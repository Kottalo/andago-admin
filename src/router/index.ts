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
        path: '/cars',
        name: 'Cars',
        component: () => import('@/views/Cars.vue'),
      },
      {
        path: '/drivers',
        name: 'Drivers',
        component: () => import('@/views/Drivers.vue'),
      },
      {
        path: '/ongoingTrips',
        name: 'Ongoing Trips',
        component: () => import('@/views/OngoingTrips.vue'),
      },
      {
        path: '/tripHistory',
        name: 'Trip History',
        component: () => import('@/views/TripHistory.vue'),
      }
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
