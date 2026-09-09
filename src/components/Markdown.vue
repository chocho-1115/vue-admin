<template>
	<div class="wrapper" v-html="htmlContent"></div>
</template>

<script setup>
defineProps({
	htmlContent: {
		type: String,
		default: "",
	},
})
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 30px;
	font-size: 14px;
	line-height: 1.6em;
	:deep(li) {
		margin-bottom: 8px;
	}
	:deep(a) {
		color: var(--el-color-primary);
		margin: auto 2px;
	}
}
</style>
