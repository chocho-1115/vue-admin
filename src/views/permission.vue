<template>
	<div class="permission-page">
		<!-- 角色展示 -->
		<div class="block">
			<div class="block-title">当前角色 hasRole / isAdmin</div>
			<div class="role-list">
				<el-tag v-for="role in curRoles" :key="role" type="primary">{{ role }}</el-tag>
				<el-tag v-if="!curRoles.length" type="info">无角色</el-tag>
			</div>
			<div class="checks">
				<el-tag :type="isAdmin() ? 'success' : 'info'">isAdmin() = {{ isAdmin() }}</el-tag>
				<el-tag :type="hasRole(['admin', 'editor']) ? 'success' : 'info'">hasRole(['admin','editor']) = {{ hasRole(['admin', 'editor']) }}</el-tag>
			</div>
			<p class="tips">角色来自 <code>/permission</code>；本页 admin / editor 均可访问，用于对比按钮级差异。</p>
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
			<p class="tips">admin 全 4 个点可见；editor 无 delete，该按钮隐藏。</p>
		</div>

		<!-- 数组聚合模式演示 -->
		<div class="block">
			<div class="block-title">hasPerm 数组聚合（any / all）</div>
			<div class="checks">
				<el-tag :type="hasPerm(['example:create', 'example:view'], { mode: 'any' }) ? 'success' : 'info'">
					any(['example:create','example:view'])
				</el-tag>
				<el-tag :type="hasPerm(['example:create', 'example:delete'], { mode: 'all' }) ? 'success' : 'info'">
					all(['example:create','example:delete'])
				</el-tag>
			</div>
			<p class="tips">any 任一命中即通过；all 需全部命中（本例 admin 为 true、editor 为 false）。</p>
		</div>

		<!-- 路由级守卫演示 -->
		<div class="block">
			<div class="block-title">路由级守卫 meta.roles（新窗格演示）</div>
			<div class="btn-list">
				<el-button type="warning" @click="onOpenTest">前往 Test 演示页（目标路由仅 admin 可访问）</el-button>
			</div>
			<p class="tips">
				test 路由配置 meta.roles: ['admin']，且已从 editor 的菜单过滤。admin 点击可正常进入；editor 点击后由权限守卫重定向到 /error/403。
			</p>
		</div>

		<!-- 原始权限数据 -->
		<div class="block">
			<div class="block-title">store/session/permission 原始数据</div>
			<pre class="raw">{{ JSON.stringify(session.permission.get(), null, 2) }}</pre>
			<p class="tips">roles 驱动路由级权限与菜单过滤，permissions 驱动按钮级显隐，routes 为动态路由预留字段。</p>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { session } from "@/store"

import { hasPerm, hasRole, isAdmin } from "@/common/permission"

const router = useRouter()

/** 当前角色列表（session/permission 为非响应式容器，进入页面时由 permission 守卫前置加载完成） */
const curRoles = session.permission.get().roles

/** 新窗格打开 test 页：admin 正常进入，editor 被路由守卫重定向到 /error/403 */
const TEST_PATH = "/example/test"
/** router.resolve 的 href 会拼接 createWebHistory 的 base，部署在 /admin 下也能正确打开 */
const onOpenTest = () => window.open(router.resolve(TEST_PATH).href, "_blank")
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
	.raw {
		background: var(--el-fill-color-light);
		padding: 12px 16px;
		border-radius: 6px;
		font-size: 13px;
		line-height: 1.5;
		overflow-x: auto;
		margin: 0;
	}
}
</style>