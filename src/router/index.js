import {
  createRouter,
  // createWebHistory
  createWebHashHistory,
} from 'vue-router'
import { Brush, Discount } from '@element-plus/icons-vue'

import Layout from "@/layout/index.vue"
import nestedRouter from "./modules/nested"
import whiteList from "./whiteList"
import { setWatermark, clearWatermark } from "@/common/watermark"

/**
 * 路由 meta 参数说明：
 * - title:      菜单及页面标题
 * - icon:       菜单图标（svg 图标名或 Element Plus 图标组件）
 * - hidden:     为 true 时不在侧边栏显示
 * - affix:      为 true 时固定在标签栏
 * - alwaysShow: 当路由只有一个可见子菜单时，是否仍显示父级菜单分组。
 *               false/不设置时会"拍平"，只显示那一个子菜单项
 * - watermark:  添加水印。为 true 时使用默认样式；
 *               也可传对象覆盖参数：{ text, fontSize, color, rotate, gapX, gapY, zIndex }
 */
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
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: 'Dashboard',
            icon: 'home',
            affix: true,
          },
        },
      ],
    },
    {
      path: '/about',
      component: Layout,
      redirect: '/about/readme',
      meta: {
        alwaysShow: true,
        title: 'About',
        icon: 'about',
      },
      children: [
        {
          path: 'readme',
          name: 'Readme',
          component: () => import('@/views/about/readme.vue'),
          meta: {
            title: 'Readme',
          },
        },
        {
          path: 'changelog',
          name: 'Changelog',
          component: () => import('@/views/about/changelog.vue'),
          meta: {
            title: 'Changelog',
          },
        },
      ],
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/icon',
      meta: {
        alwaysShow: true,
        title: 'Example',
        icon: 'example',
      },
      children: [
        {
          path: 'icon',
          name: 'Icons',
          component: () => import('@/views/example/icon.vue'),
          meta: {
            title: 'Icon',
            icon: Discount,
          },
        },
        {
          path: 'color',
          name: 'Color',
          component: () => import('@/views/example/color.vue'),
          meta: {
            title: 'Color',
            icon: Brush,
          },
        },
        {
          path: 'table',
          name: 'Table',
          component: () => import('@/views/example/table.vue'),
          meta: {
            title: 'Table',
            icon: 'table',
          },
        },
        {
          path: 'tree',
          name: 'Tree',
          meta: {
            title: 'Tree',
            icon: 'tree',
          },
          component: () => import('@/views/example/tree.vue'),
        },
        {
          path: 'form',
          name: 'Form',
          meta: {
            title: 'Form',
            icon: 'form',
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
          },
        },
      ],
    },
    nestedRouter,
    {
      path: '/external-link',
      component: Layout,
      children: [
        {
          path: 'https://github.com/chocho-1115/vue-admin',
          meta: {
            title: 'External Link',
            icon: 'link',
          },
        },
      ],
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true,
    },
  ],
})

router.afterEach(async (to) => {
	// set page title
	document.title = to.meta.title ? `${to.meta.title} - Vue Admin` : `Vue Admin`

	// apply or clear watermark based on route meta
	// watermark: true -> default style; object -> override params
	if (to.meta.watermark) {
		const wm =
			typeof to.meta.watermark === "object" ? to.meta.watermark : {}
		setWatermark(wm)
	} else {
		clearWatermark()
	}
})

export const resetRouter = () => {
	// console.log(router)
}

export const isWhitePage = (path) => {
	const route = router.currentRoute.value
	return !(whiteList.indexOf(path || route.path) === -1)
}

export default router
