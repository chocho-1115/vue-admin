<template>
	<div :style="styleExternalIcon" class="svg-external-icon svg-icon" v-if="isExternal" />
	<svg :class="svgClass" aria-hidden="true" v-else>
		<use :href="`/__spritemap#sprite-${icon}`" class="use" />
	</svg>
</template>

<script setup>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { computed } from 'vue'
import { isExternal as isExt } from '@/common/validate'

const props = defineProps({
	icon: {
		// 属性名
		type: String,
		required: true,
	},
	className: {
		type: String,
		default: '',
	},
})
const isExternal = computed(() => {
	return isExt(props.icon)
})
const svgClass = computed(() => {
	if (props.className) {
		return 'svg-icon ' + props.className
	} else {
		return 'svg-icon'
	}
})
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
.svg-external-icon {
	background-color: currentColor;
	mask-size: cover !important;
	display: inline-block;
}
</style>
