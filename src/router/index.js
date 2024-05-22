import { createRouter, createWebHistory } from 'vue-router'
import DashBaordView from '../views/DashBoardView.vue'
import ProfileView from '../views/ProfileView.vue'
import HomeView from '../views/HomeView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import RentalRegistrationView from '../views/RentalRegistrationView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'

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
      redirect: '/home',

      component: DashBaordView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView,
          meta: {
            requiresAuth: true
          }
        },
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
    },

    // this catchs any route
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
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
    const token = localStorage.getItem('accessToken')
    // console.log(token)
    if (token) {
      // authenticated, proceed to the route
      next()
    } else {
      //  not authenticated, redirect to login
      next('/login')
    }
  } else {
    // non-protected route, allow access
    next()
  }
})

export default router
