import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import RentalRegistrationView from '../views/RentalRegistrationView.vue'
import LoginView from '../views/LoginView.vue'
import DashBaordView from '../views/DashBoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false // No authentication required
      }
    },

    {
      path: '/',
      name: 'dashboard',
      component: DashBaordView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/registration',
          name: 'registration',
          component: RegistrationView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/rental-registration',
          name: 'rental-registration',
          component: RentalRegistrationView,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) {
      // User is authenticated, proceed to the route
      next()
    } else {
      // User is not authenticated, redirect to login
      next('/login')
    }
  } else {
    // Non-protected route, allow access
    next()
  }
})

export default router
