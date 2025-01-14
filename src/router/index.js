import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from '../stores/authentication'
import { useRouteMemoryStore } from '../stores/router-memory-store'
import DashBaordView from '../views/DashBoardView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import HomeView from '../views/HomeView.vue'
import RegistrationFormsView from '../views/RegistrationFormsView.vue'
import ProfileView from '../views/ProfileView.vue'
import FormDetailsView from '../views/FormDetailsView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ApplicationsView from '../views/ApplicationsView.vue'
import DownloadForms from '../views/DownloadForms.vue'
import BusinessRequest from '../views/BusinessRequestView.vue'
import BusinessPartners from '../views/BusinessPartnersView.vue'
import SignSealSubmitView from '../views/SignSealSubmitView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresAuth: false },
    },

    {
      path: '/find-id',
      name: 'find-id',
      component: () => import('../views/FindIdView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import('../views/FindPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/sign-seal-submit/:id',
      name: 'sign-seal-submit',
      component: SignSealSubmitView,
      meta: { requiresAuth: false },
    },
    {
      path: '/terms/:page',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
      meta: { requiresAuth: false },
      props: true,
    },
    {
      path: '/',
      name: 'dashboard',
      redirect: '/home',
      component: DashBaordView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true },
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: { requiresAuth: true },
        },
        {
          path: '/registration-forms',
          name: 'registration-forms',
          component: RegistrationFormsView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/form-details/:id',
          name: 'form-details',
          component: FormDetailsView,
          meta: { requiresAuth: true },
        },

        {
          path: '/applications',
          name: 'applications',
          component: ApplicationsView,
          meta: { requiresAuth: true },
          // props: true,
        },

        {
          path: '/download-forms',
          name: 'download-forms',
          component: DownloadForms,
          meta: { requiresAuth: true },
        },

        {
          path: '/business-request',
          name: 'business-request',
          component: BusinessRequest,
          meta: { requiresAuth: true },
        },

        {
          path: '/business-partners',
          name: 'business-partners',
          component: BusinessPartners,
          meta: { requiresAuth: true },
        },
        {
          path: '/htmls',
          name: 'htmls',
          component: () => import('../views/HtmlsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/usim-order',
          name: 'usim-order',
          component: () => import('../views/UsimOrderView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    // this catchs any  route
    {
      // path: '/:pathMatch(.*)*',
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!useAuthenticationStore().isLoggedIn) {
      useRouteMemoryStore().save(to.fullPath)
      next('/login')
    } else {
      next()
    }
  } else {
    // non-protected route, allow access
    next()
  }
})

export default router
