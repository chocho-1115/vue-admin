<template>
  <div :class="classObj" class="app-wrapper">
    <div
      @click="handleClickOutside"
      class="drawer-bg"
      v-if="ctx.device==='mobile'&&ctx.sidebar.opened"
    />
		<div class="sidebar">
			<Sidebar />
		</div>
    <div :class="{hasTagsView: needTagsView}" class="container">
      <header :class="{'fixed-header': fixedHeader}">
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
import { ref, inject, provide, nextTick, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Sidebar, Navbar, AppMain, TagsView } from './components'
import { isMobile, resizeHandler } from './mixin/ResizeHandler'
import { sctx, dispatch } from '@/store'

const ctx = inject('context')
const route = useRoute()

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
		hideSidebar: !ctx.sidebar.opened,
		openSidebar: ctx.sidebar.opened,
		withoutAnimation: ctx.sidebar.withoutAnimation,
		mobile: ctx.device === 'mobile',
	}
})

watch(
	() => route.path,
	() => {
		if (ctx.device === 'mobile' && ctx.sidebar.opened) {
				dispatch.sidebar.close({ withoutAnimation: false })
		}
	}
)

onMounted(() => {
	window.addEventListener('resize', resizeHandler)
	if (isMobile()) {
		ctx.device = 'mobile'
		dispatch.sidebar.close({ withoutAnimation: true })
	}
})

onUnmounted(() => {
	window.removeEventListener('resize', resizeHandler)
})

const handleClickOutside = () => {
	dispatch.sidebar.close({ withoutAnimation: false })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as v;
@use '@/styles/mixin.scss' as *;

.app-wrapper {
	@include clearfix;
	position: relative;
	height: 100%;
	width: 100%;
	&.mobile.openSidebar {
		position: fixed;
		top: 0;
	}
}
.container{
	min-height: 100%;
	transition: margin-left .28s;
	margin-left: v.$sideBarWidth;
	position: relative;
	z-index: 1;
}
.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 2;
}
.sidebar {
	transition: width 0.28s;
	width: v.$sideBarWidth !important;
	border-right: 1px solid var(--el-color-info-light-9);
	background: var(--el-fill-color-extra-light);
	height: 100%;
	position: fixed;
	font-size: 0px;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 3;
	overflow: hidden;
}

.hideSidebar {
	.sidebar {
		width: 54px !important;
	}
	.container {
		margin-left: 54px;
	}
}

// mobile responsive
.mobile {
	.container {
		margin-left: 0px;
	}

	.sidebar {
		transition: transform .28s;
		width: v.$sideBarWidth !important;
	}

	&.hideSidebar {
		.sidebar {
			pointer-events: none;
			// transition-duration: 0.3s;
			transform: translate3d(- v.$sideBarWidth, 0, 0);
		}
	}
}

.withoutAnimation {
	.container,
	.sidebar {
		transition: none;
	}
}

/* ########## header ########## */
header{
	background: var(--el-bg-color);
	box-shadow: var(--el-box-shadow-lighter);
	// box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  
}
.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	width: calc(100% - #{v.$sideBarWidth});
	transition: width 0.28s;
}
.hideSidebar .fixed-header {
    width: calc(100% - 54px);
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
	box-sizing: content-box;
	z-index:1;
	// background: var(--el-bg-color-page);
}
.fixed-header + main {
    padding-top: 50px;
}
.hasTagsView {
    main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }
    .fixed-header + main {
        padding-top: 84px;
    }
}

</style>
