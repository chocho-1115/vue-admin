import Layout from "@/layout/index.vue"

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

export default nestedRouter
