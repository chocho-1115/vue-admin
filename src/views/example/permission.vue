<template>
	<div class="permission-page">
		<!-- 角色展示 -->
		<div class="block">
			<div class="block-title">当前角色 hasRole / isAdmin</div>
			<div class="role-list">
				<el-tag v-for="role in curRoles" :key="role" type="primary" class="role-tag">{{ role }}</el-tag>
				<el-tag v-if="!curRoles.length" type="info">无角色</el-tag>
			</div>
			<div class="checks">
				<el-tag :type="isAdmin() ? 'success' : 'info'">isAdmin() = {{ isAdmin() }}</el-tag>
				<el-tag :type="hasRole(['admin', 'editor']) ? 'success' : 'info'">hasRole(['admin','editor']) = {{ hasRole(['admin', 'editor']) }}</el-tag>
			</div>
			<p class="tips">角色数据来自 <code>/permission</code>（store/session/permission），本页路由 meta.roles: ['admin'] 仅 admin 可见</p>
		</div>

		<!-- 按钮权限点演示 -->
		<div class="block">
			<div class="block-title">权限点 hasPerm（admin 不自动放行，按接口 permissions 逐点控制）</div>
			<div class="btn-list">
				<el-button type="primary" v-if="hasPerm('example:create')">example:create</el-button>
				<el-button v-if="hasPerm('example:edit')">example:edit</el-button>
				<el-button type="danger" v-if="hasPerm('example:delete')">example:delete</el-button>
				<el-button type="info" v-if="hasPerm('example:view')">example:view</el-button>
			</div>
			<p class="tips">admin 拥有全部 4 个点；editor 仅 example:view</p>
		</div>

		<!-- 数组聚合模式演示 -->
		<div class="block">
			<div class="block-title">hasPerm 数组聚合（any / all）</div>
			<div class="checks">
				<el-tag :type="hasPerm(['example:create', 'example:view'], { mode: 'any' }) ? 'success' : 'info'">
					any(['example:create','example:view'])
				</el-tag>
				<el-tag :type="hasPerm(['example:create', 'example:edit'], { mode: 'all' }) ? 'success' : 'info'">
					all(['example:create','example:edit'])
				</el-tag>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue"

import { hasPerm, hasRole, isAdmin } from "@/common/permission"
import { session } from "@/store"

defineOptions({
	name: "Permission",
})

/** 当前角色列表（响应式：session.permission 非响应式，此页由路由守卫保证进入前已加载） */
const curRoles = computed(() => session.permission.get().roles)
</script>

<style lang="scss" scoped>
.permission-page {
	padding: 20px 30px;
}
.block {
	margin-bottom: 24px;
	.block-title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 12px;
	}
	.role-list {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
	}
	.btn-list {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.checks {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.tips {
		font-size: 12px;
		color: var(--el-text-color-secondary);
		margin-top: 10px;
	}
	code {
		background: var(--el-fill-color-light);
		padding: 0 4px;
		border-radius: 4px;
	}
}
</style>