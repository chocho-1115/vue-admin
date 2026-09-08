import {
	createWebHistory,
	// createWebHashHistory
} from "vue-router"
import { Brush, Discount } from "@element-plus/icons-vue"

const Layout = () => import("@/layout/index.vue")

const keepAliveNames = ["Test", "Dashboard"]

// no redirect whitelist
const whiteList = ["/account/login", "/error/*"]

/**
 * Route `meta` options:
 * - title:      menu and page title
 * - icon:       menu icon (SVG icon name or an Element Plus icon component)
 * - hidden:     hide from the sidebar when true. 
 * - affix:      pin to the tags view when true
 * - alwaysShow: show the parent menu group when it has only one visible child.
 *               When false / unset, the route is "flattened" to show that child.
 * - roles:      roles allowed to access this route. Empty / unset = public.
 *               Enforced by the permission guard (redirects to /error/403) and the
 *               sidebar menu filter (hides the route). E.g. roles: ['admin'].
 */

const config = {
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes: [
		{
			path: "/account/login",
			name: "login",
			component: () => import("@/views/account/login.vue"),
			meta: {
				hidden: true,
			},
		},
		{
			path: "/",
			component: Layout,
			redirect: "/dashboard",
			children: [
				{
					path: "dashboard",
					name: "Dashboard",
					component: () => import("@/views/dashboard.vue"),
					meta: {
						title: "Dashboard",
						icon: "home",
						affix: true,
					},
				},
			],
		},
		{
			path: "/about",
			component: Layout,
			redirect: "/about/readme",
			meta: {
				alwaysShow: true,
				title: "About",
				icon: "about",
			},
			children: [
				{
					path: "readme",
					name: "Readme",
					component: () => import("@/views/about/readme.vue"),
					meta: {
						title: "Readme",
					},
				},
				{
					path: "changelog",
					name: "Changelog",
					component: () => import("@/views/about/changelog.vue"),
					meta: {
						title: "Changelog",
					},
				},
			],
		},
		{
			path: "/permission",
			component: Layout,
			children: [
				{
					path: "",
					name: "Permission",
					component: () => import("@/views/permission.vue"),
					meta: {
						title: "Permission",
						icon: "test",
					},
				},
			],
		},
		{
			path: "/example",
			component: Layout,
			redirect: "/example/icon",
			meta: {
				alwaysShow: true,
				title: "Example",
				icon: "example",
			},
			children: [
				{
					path: "icon",
					name: "Icons",
					component: () => import("@/views/example/icon.vue"),
					meta: {
						title: "Icon",
						icon: Discount,
					},
				},
				{
					path: "color",
					name: "Color",
					component: () => import("@/views/example/color.vue"),
					meta: {
						title: "Color",
						icon: Brush,
					},
				},
				{
					path: "table",
					name: "Table",
					component: () => import("@/views/example/table.vue"),
					meta: {
						title: "Table",
						icon: "table",
					},
				},
				{
					path: "tree",
					name: "Tree",
					meta: {
						title: "Tree",
						icon: "tree",
					},
					component: () => import("@/views/example/tree.vue"),
				},
				{
					path: "form",
					name: "Form",
					meta: {
						title: "Form",
						icon: "form",
					},
					component: () => import("@/views/example/form.vue"),
				},
				{
					path: "test",
					name: "Test",
					component: () => import("@/views/example/test.vue"),
					meta: {
						title: "Test",
						icon: "test",
						roles: ["admin"],
					},
				},
			],
		},
		{
			path: "/external-link",
			component: Layout,
			children: [
				{
					path: "https://github.com/chocho-1115/vue-admin",
					meta: {
						title: "External Link",
						icon: "link",
					},
				},
			],
		},
		{
			path: "/error/:code",
			component: () => import("@/views/error.vue"),
			meta: {
				hidden: true,
			},
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/error/404",
			meta: {
				hidden: true,
			},
		},
	],
}

const nestedRouter = {
	path: "/nested",
	component: Layout,
	redirect: "/nested/menu1",
	name: "Nested",
	meta: {
		title: "Nested",
		icon: "nested",
	},
	children: [
		{
			path: "menu1",
			component: () => import("@/views/nested/menu1/index.vue"), // Parent router-view
			name: "Menu1",
			meta: {
				title: "Menu1",
			},
			children: [
				{
					path: "menu1-1",
					component: () => import("@/views/nested/menu1/menu1-1.vue"),
					name: "Menu1-1",
					meta: {
						title: "Menu1-1",
					},
				},
				{
					path: "menu1-2",
					component: () => import("@/views/nested/menu1/menu1-2/index.vue"),
					name: "Menu1-2",
					meta: {
						title: "Menu1-2",
					},
					children: [
						{
							path: "menu1-2-1",
							component: () => import("@/views/nested/menu1/menu1-2/menu1-2-1.vue"),
							name: "Menu1-2-1",
							meta: {
								title: "Menu1-2-1",
							},
						},
						{
							path: "menu1-2-2",
							component: () => import("@/views/nested/menu1/menu1-2/menu1-2-2.vue"),
							name: "Menu1-2-2",
							meta: {
								title: "Menu1-2-2",
							},
						},
					],
				},
			],
		},
		{
			path: "menu2",
			component: () => import("@/views/nested/menu2.vue"),
			name: "Menu2",
			meta: {
				title: "menu2",
			},
		},
	],
}

config.routes.splice(-3, 0, nestedRouter)

export { config, whiteList, keepAliveNames }
