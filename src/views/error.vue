<template>
	<div class="container">
		<div class="bullshit">
			<div class="title">
				{{ current.title }}<sup>{{ code }}</sup>
			</div>
			<div class="info">{{ current.info }}</div>
			<div class="tips">{{ current.tips }}</div>
			<span class="btn-home" @click="onBack">Back to home</span>
		</div>
	</div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router"
const route = useRoute()
const router = useRouter()

const code = route.params.code || "404"

const messages = {
	403: {
		title: "Forbidden",
		info: "Sorry, you don't have permission to access this page.",
		tips: "Please contact the administrator if you believe this is a mistake.",
	},
	404: {
		title: "Not Found",
		info: "Sorry, the page you visited does not exist.",
		tips: "Please check the URL, or click the button below to return home.",
	},
	500: {
		title: "Server Error",
		info: "Sorry, something went wrong on our end.",
		tips: "Please try again later, or contact the administrator.",
	},
}

const current = messages[code]

const onBack = () => {
	router.push("/")
}
</script>
<style lang="scss" scoped>
.container {
	min-height: 100vh;
	max-width: 1200px;
	overflow: hidden;
	margin: auto;
}

.bullshit {
	max-width: 400px;
	padding: 80px 50px;

	.title {
		font-size: 32px;
		font-weight: bold;
		line-height: 1.3em;
		color: var(--el-color-primary);
		margin-bottom: 20px;
		sup {
			font-size: 12px;
			vertical-align: super;
			margin-left: 4px;
		}
	}

	.info {
		font-size: 20px;
		line-height: 1.3em;
		color: var(--el-text-color-primary);
		font-weight: bold;
		margin-bottom: 10px;
	}

	.tips {
		font-size: 13px;
		line-height: 1.4em;
		color: var(--el-text-color-secondary);
		margin-bottom: 30px;
	}

	.btn-home {
		display: block;
		width: 110px;
		height: 36px;
		line-height: 36px;
		background: var(--el-color-primary);
		border-radius: 100px;
		text-align: center;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
	}
}
</style>
