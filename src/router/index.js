import {
  createRouter,
  // createWebHistory
  createWebHashHistory,
} from 'vue-router'

import nestedRouter from './modules/nested'

import Layout from '@/layout/index.vue'
import {
  Brush,
  Discount,
} from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: [{
      path: '/account/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/account/login.vue'),
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'home',
          keepAlive: true,
          affix: true
        }
      }, ]
    },
    {
      path: '/about',
      component: Layout,
      redirect: '/about/readme',
      meta: {
        alwaysShow: true,
        title: 'About',
        icon: 'about'
      },
      children: [{
        path: 'readme',
        name: 'Readme',
        component: () => import('@/views/about/readme.vue'),
        meta: {
          title: 'Readme',
        }
      }, {
        path: 'changelog',
        name: 'Changelog',
        component: () => import('@/views/about/changelog.vue'),
        meta: {
          title: 'Changelog',
        }
      }]
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/icon',
      meta: {
        alwaysShow: true,
        title: 'Example',
        icon: 'example'
      },
      children: [{
          path: 'icon',
          name: 'Icons',
          component: () => import('@/views/example/icon.vue'),
          meta: {
            title: 'Icon',
            icon: Discount,
          }
        },
        {
          path: 'color',
          name: 'Color',
          component: () => import('@/views/example/color.vue'),
          meta: {
            title: 'Color',
            icon: Brush,
          }
        },
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/example/table.vue'),
          meta: {
            title: 'Table',
            icon: 'table',
          }
        },
        {
          path: 'tree',
          name: 'Tree',
          meta: {
            title: 'Tree',
            icon: 'tree'
          },
          component: () => import('@/views/example/tree.vue'),
        },
        {
          path: 'form',
          name: 'Form',
          meta: {
            title: 'Form',
            icon: 'form'
          },
          component: () => import('@/views/example/form.vue'),
        },
        {
          path: 'test',
          name: 'Test',
          component: () => import('@/views/example/test.vue'),
          meta: {
            title: 'Test',
            icon: 'test',
            keepAlive: true,
          }
        },
      ]
    },
    nestedRouter,
    {
      path: '/external-link',
      component: Layout,
      children: [{
        path: 'https://github.com/chocho-1115/vue-admin',
        meta: {
          title: 'External Link',
          icon: 'link'
        }
      }]
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true
    },
  ],
})

export const resetRouter = () => {
  // console.log(router)
}

export default router
