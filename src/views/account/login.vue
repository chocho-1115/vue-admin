<template>
	<div class="login-container">
		<el-form :model="loginForm" :rules="loginRules" class="login-form" ref="formDom">
			<div class="title-container">
				<h3 class="title">Login Form</h3>
			</div>

			<el-form-item prop="username">
				<el-input size="large" autocomplete="on" name="username" placeholder="Username" ref="username" tabindex="1" type="text" v-model="loginForm.username">
					<template #prefix>
						<svg-icon icon="user" />
					</template>
				</el-input>
			</el-form-item>

			<el-form-item prop="password">
				<el-input size="large" :type="passwordType" autocomplete="on" name="password" placeholder="Password" ref="passwordDom" tabindex="2" v-model="loginForm.password">
					<template #prefix>
						<svg-icon icon="password" />
					</template>
					<template #suffix>
						<span @click="showPwd">
							<svg-icon :icon="passwordType === 'password' ? 'eye' : 'eye-open'" />
						</span>
					</template>
				</el-input>
			</el-form-item>

			<el-button size="large" :loading="loading" @click.native.prevent="handleLogin" style="width:100%;margin-bottom:30px;" type="primary">Login</el-button>

			<div class="tips">
				<span style="margin-right:20px;">username: admin</span>
				<span>password: any</span>
			</div>
		</el-form>
	</div>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { validUsername } from '@/utils/validate'
import { login } from '@/api/user'
import { dispatch } from '@/store'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const passwordType = ref('password')
const redirect = route.query.redirect || '/'

const loginForm = reactive({
	username: 'admin',
	password: '111111',
})

const validateUsername = (rule, value, callback) => {
	if (!validUsername(value)) {
		callback(new Error('Please enter the correct user name'))
	} else {
		callback()
	}
}
const validatePassword = (rule, value, callback) => {
	if (value.length < 6) {
		callback(new Error('The password can not be less than 6 digits'))
	} else {
		callback()
	}
}

const loginRules = reactive({
	username: [{ required: true, trigger: 'blur', validator: validateUsername }],
	password: [{ required: true, trigger: 'blur', validator: validatePassword }],
})

const passwordDom = ref(null)
const formDom = ref() //该变量名必须等于el-form的ref属性值，才能获取到表单实例。

const showPwd = async () => {
	if (passwordType.value === 'password') {
		passwordType.value = ''
	} else {
		passwordType.value = 'password'
	}
	await nextTick()
	passwordDom.value.focus()
}
const handleLogin = () => {
	formDom.value.validate((valid) => {
		if (valid) {
			loading.value = true
			login(loginForm)
				.then((res) => {
					dispatch.user.setToken(res.body.token)
					router.push(redirect)
					loading.value = false
				})
				.catch(() => {
					loading.value = false
				})
		} else {
			console.log('error submit!!')
			return false
		}
	})
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {
	.el-input {
		.el-input__wrapper {
			background: transparent;
			box-shadow: none;
		}

		input {
			-webkit-appearance: none;
			color: $light_gray;
			caret-color: $cursor;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px transparent inset !important;
				-webkit-text-fill-color: $cursor !important;
				transition: background-color 50000s ease-in-out 0s; //背景色透明 生效时长 过渡效果 启用时延迟的时间
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
	}
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
	min-height: 100vh;
	width: 100%;
	background-color: $bg;
	overflow: hidden;

	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}
}
</style>
