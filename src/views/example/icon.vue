<template>
	<div class="app-container">
		<el-tabs class="demo-tabs">
			<el-tab-pane label="Element-Plus Icons">
				<aside>
					<a class="link" href="https://icon-sets.iconify.design/ep/" target="_blank"
						>@iconify-json/ep</a
					>
				</aside>
				<div class="grid">
					<el-tooltip
						placement="top"
						:content="generateElementIconCode(item.name)"
						:disabled="disabled"
						v-for="item of elementIcons"
						:key="item"
					>
						<div class="icon-item" @click="handleClipboard(generateElementIconCode(item.name))">
							<el-icon class="el-menu-icon">
								<component :is="item" />
							</el-icon>
							<span>{{ item.__name }}</span>
						</div>
					</el-tooltip>
				</div>
			</el-tab-pane>
			<el-tab-pane label="Custom Icons">
				<aside>
					<a
						class="link"
						href="https://spiriitlabs.github.io/vite-plugin-svg-spritemap/"
						target="_blank"
						>@spiriit/vite-plugin-svg-spritemap</a
					>
				</aside>
				<div class="grid">
					<el-tooltip
						placement="top"
						:content="generateIconCode(item)"
						:disabled="disabled"
						v-for="item of iconNameList"
						:key="item"
					>
						<div class="icon-item" @click="handleClipboard(generateIconCode(item))">
							<svg-icon :icon="item" />
							<span>{{ item }}</span>
						</div>
					</el-tooltip>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { copyText } from '@/core/utils'
import * as elementIcons from '@element-plus/icons-vue'
import { iconNameList } from '@/icons'

const disabled = ref(false)

const generateIconCode = (symbol) => {
	return `<svg-icon icon="${symbol}" />`
}

const generateElementIconCode = (symbol) => {
	return `<el-icon><i-ep-${symbol} /></el-icon>`
}

const handleClipboard = (text) => {
	disabled.value = true
	copyText(text, () => {
		ElMessage({
			message: 'Copied!',
			type: 'success',
			duration: 2 * 1000,
			onClose() {
				disabled.value = false
			},
		})
	})
}
</script>

<style lang="scss" scoped>
aside {
	background: var(--el-fill-color-lighter);
	padding: 8px 24px;
	margin-bottom: 20px;
	border-radius: 2px;
	display: block;
	line-height: 32px;
	font-size: 16px;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans',
		'Droid Sans', 'Helvetica Neue', sans-serif;
	color: #2c3e50;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	a {
		color: var(--el-color-primary);
		cursor: pointer;

		// &:hover {
		//   color: rgb(32, 160, 255);
		// }
	}
}

.demo-tabs > .el-tabs__content {
	padding: 32px;
	font-weight: 600;
}

.link {
	text-decoration: underline;
	color: var(--el-color-primary);
}

.grid {
	max-width: 1200px;
	position: relative;
	display: grid;
	gap: 30px 10px;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	user-select: none; // 禁止选中
	-webkit-tap-highlight-color: transparent; // 移动端点击时避免蓝色高亮（可选）
}
.icon-item {
	text-align: center;
	color: #6b778c;
	font-size: 42px;
	cursor: pointer;
	span {
		display: block;
		font-size: 14px;
		margin-top: 10px;
	}
}
// 手机：固定 3 列
@media (max-width: 600px) {
	.grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.icon-item {
		font-size: 30px;
		span {
			font-size: 12px;
		}
	}
}

@media (any-hover: hover) {
	.icon-item:hover {
		color: var(--el-color-primary);
	}
}
</style>
