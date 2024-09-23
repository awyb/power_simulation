import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children:[{
      path: '/GraphPage',
      name: 'graphpage',
      component: () => import('@/views/main/GraphPage.vue')
    },
    {
      path: '/design',
      name: 'design',
      component: () => import('@/views/main/MainPage.vue'),
      meta: {
        keepAlive: true
      }

    },
    {
      path: '/run',
      name: 'run',
      component: () => import('@/views/main/run/Run.vue'),
      meta: {
        keepAlive: false
      }

    }]
  },
  
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
