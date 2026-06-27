<template>
	<div :class="classObj" class="app-wrapper">
		<div class="sidebar">
			<Sidebar />
		</div>
		<div :class="{ hasTagsView: needTagsView }" class="container">
			<header :class="{ 'fixed-header': fixedHeader }">
				<Navbar />
				<TagsView v-if="needTagsView" />
			</header>
			<main>
				<AppMain v-if="isRouterActive" />
			</main>
		</div>
	</div>
</template>

<script setup>
import { ref, inject, provide, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { Sidebar, Navbar, AppMain, TagsView } from './components'
import { getDevice } from '@/common/layout'
import { sctx } from '@/store'

const ctx = inject('context')

const needTagsView = sctx.tagsView
const fixedHeader = sctx.fixedHeader

const isRouterActive = ref(true)

provide('reloadAppMain', () => {
	isRouterActive.value = false
	nextTick(() => {
		setTimeout(() => {
			isRouterActive.value = true
		}, 100)
	})
})

const classObj = computed(() => {
	return {
		'mini-sidebar': !ctx.sidebar.opened,
		'mobile': ctx.device === 'mobile',
	}
})

const resizeHandler = () => {
  if (document.hidden) return
	ctx.device = getDevice()
}

onMounted(() => {
	window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
	window.removeEventListener('resize', resizeHandler)
})

</script>

<style lang="scss" scoped>
@use '@/styles/mixin.scss' as *;

.app-wrapper {
	@include clearfix;
	position: relative;
	min-height: 100vh;
	width: 100%;
}

.container {
	min-height: 100%;
	transition: margin-left .28s;
	margin-left: var(--sidebar-width);
	position: relative;
	z-index: 1;
}

.sidebar {
	transition: width 0.28s, transform 0.28s;
	width: var(--sidebar-width) !important;
	border-right: 1px solid var(--el-border-color-extra-light);
	background: var(--el-fill-color-extra-light);
	height: 100%;
	position: fixed;
	font-size: 0px;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 3;
	overflow: hidden;
	user-select: none; // 禁止选中
	-webkit-tap-highlight-color: transparent; // 移动端点击时避免蓝色高亮（可选）
}

.mini-sidebar {
	.sidebar {
		width: 64px !important;
	}
	.container {
		margin-left: 64px;
	}
}

// mobile responsive
.mobile {
	.container {
		margin-left: 0px;
	}
	.sidebar {
		pointer-events: none;
		transform: translate3d(-100%, 0, 0);
	}
}

/* ########## header ########## */
header {
	background: var(--el-bg-color);
	box-shadow: var(--el-box-shadow-lighter);
	// box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
	user-select: none; // 禁止选中
	-webkit-tap-highlight-color: transparent; // 移动端点击时避免蓝色高亮（可选）
}

.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	width: calc(100% - var(--sidebar-width));
	transition: width 0.28s;
}

.mini-sidebar .fixed-header {
	width: calc(100% - 64px);
}

.mobile .fixed-header {
	width: 100%;
}

/* ########## main ########## */
main {
	/* 50= navbar  50  */
	min-height: calc(100vh - 50px);
	width: 100%;
	position: relative;
	overflow: hidden;
	// box-sizing: content-box;
	z-index: 1;
	// background: var(--el-bg-color-page);
}

.fixed-header+main {
	padding-top: 50px;
}

.hasTagsView {
	main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh - 84px);
	}

	.fixed-header+main {
		padding-top: 84px;
	}
}
</style>
