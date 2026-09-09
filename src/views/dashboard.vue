<template>
	<div class="app-container">
		<!-- Welcome -->
		<el-card class="welcome-card" shadow="never">
			<div class="welcome">
				<el-avatar :size="56" :src="ctx.userInfo.avatar" v-if="ctx.userInfo.avatar" />
				<el-avatar :size="56" v-else>
					<el-icon :size="28"><UserFilled /></el-icon>
				</el-avatar>
				<div>
					<h3 class="welcome-title">{{ greeting }}, {{ ctx.userInfo.name || 'Guest' }}</h3>
					<p class="welcome-sub">{{ ctx.userInfo.introduction || 'Welcome back' }}</p>
				</div>
			</div>
		</el-card>

		<!-- Overview stats -->
		<el-row :gutter="16" class="stats-row">
			<el-col v-for="item in stats" :key="item.label" :span="6" :xs="12">
				<el-card shadow="hover">
					<div class="stat">
						<el-icon :size="28" class="stat-icon" :style="{ color: `var(--el-color-${item.color})` }">
							<component :is="item.icon" />
						</el-icon>
						<div>
							<div class="stat-value">{{ item.value }}</div>
							<div class="stat-label">{{ item.label }}</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- Permissions overview -->
		<el-card class="section-card" shadow="never">
			<template #header>
				<span class="card-title">Permissions</span>
			</template>
			<div class="perm-row" v-for="group in permGroups" :key="group.label">
				<span class="perm-label">{{ group.label }}</span>
				<div class="perm-tags">
					<el-tag v-for="item in group.items" :key="item" :type="group.type" :plain="group.plain">{{ item }}</el-tag>
					<el-tag v-if="!group.items.length" type="info">none</el-tag>
				</div>
			</div>
		</el-card>

		<!-- Quick links -->
		<el-card class="section-card" shadow="never">
			<template #header>
				<span class="card-title">Quick Links</span>
			</template>
			<div class="links">
				<div v-for="link in quickLinks" :key="link.title" class="link-item" @click="onOpen(link)">
					<el-icon :size="20"><component :is="link.icon" /></el-icon>
					<span>{{ link.title }}</span>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import {
	Document,
	EditPen,
	Key,
	Link,
	Lock,
	Monitor,
	Picture,
	Tickets,
	UserFilled,
} from "@element-plus/icons-vue"

import { ctx, session } from "@/store"

defineOptions({
	name: "Dashboard", // 必须与keepAliveName一致
})

const router = useRouter()

const roles = session.permission.get().roles
const permissions = session.permission.get().permissions

const permGroups = [
	{ label: "Roles", items: roles, type: "primary" },
	{ label: "Perms", items: permissions, type: "success", plain: true },
]

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 6) return "Good night"
	if (hour < 12) return "Good morning"
	if (hour < 14) return "Good noon"
	if (hour < 18) return "Good afternoon"
	return "Good evening"
})

const stats = computed(() => [
	{ label: "My Roles", value: roles.length, icon: UserFilled, color: "primary" },
	{ label: "My Perms", value: permissions.length, icon: Key, color: "success" },
	{ label: "Tags", value: ctx.tagsView.length, icon: Tickets, color: "warning" },
	{ label: "Device", value: ctx.device === "mobile" ? "Mobile" : "Desktop", icon: Monitor, color: "info" },
])

const quickLinks = [
	{ title: "Icon", path: "/example/icon", icon: Picture },
	{ title: "Form", path: "/example/form", icon: EditPen },
	{ title: "Permission", path: "/permission", icon: Lock },
	{ title: "Readme", path: "/about/readme", icon: Document },
	{ title: "GitHub", url: "https://github.com/chocho-1115/vue-admin", icon: Link },
]

const onOpen = (link) => {
	if (link.url) window.open(link.url, "_blank")
	else router.push(link.path)
}
</script>

<style lang="scss" scoped>
.welcome-card,
.stats-row,
.section-card {
	margin-bottom: 16px;
}

.stats-row {
	row-gap: 16px; // 换行时的行间间距（手机端 2×2）
}

.welcome {
	display: flex;
	align-items: center;
	gap: 16px;

	.welcome-title {
		margin: 0 0 6px;
		font-size: 20px;
	}

	.welcome-sub {
		margin: 0;
		font-size: 14px;
		color: var(--el-text-color-secondary);
	}
}

.stat {
	display: flex;
	align-items: center;
	gap: 14px;

	.stat-icon {
		flex-shrink: 0;
	}

	.stat-value {
		font-size: 18px;
		font-weight: 600;
		line-height: 1.2;
	}

	.stat-label {
		font-size: 13px;
		color: var(--el-text-color-secondary);
	}
}

.card-title {
	font-size: 15px;
	font-weight: 600;
}

.perm-row {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 8px 0;

	+ .perm-row {
		border-top: 1px solid var(--el-border-color-lighter);
	}

	.perm-label {
		flex-shrink: 0;
		width: 56px;
		line-height: 24px;
		font-size: 14px;
		color: var(--el-text-color-secondary);
	}

	.perm-tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
}

.links {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 12px;

	.link-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px 16px;
		border: 1px solid var(--el-border-color-lighter);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			color: var(--el-color-primary);
			border-color: var(--el-color-primary);
			background: var(--el-color-primary-light-9);
		}
	}
}
</style>