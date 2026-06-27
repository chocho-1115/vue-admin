<template>
	
	<div class="login-container">
		<el-form :model="loginForm" :rules="loginRules" class="login-form" ref="formDom">
			<div class="title-container">
				<h3 class="title">Login Form</h3>
			</div>
			<!-- 'large' | 'default' | 'small' -->
			<el-form-item prop="username">
				<el-input size="large" autocomplete="on" name="username" placeholder="Username" tabindex="1" type="text" v-model="loginForm.username">
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

			<el-button size="large" :loading="loading" @click.prevent="handleLogin" style="width:100%;margin-bottom:30px;" type="primary">Login</el-button>

			<div class="tips">
				<span style="margin-right:20px;">username: admin</span>
				<span>password: any</span>
			</div>
		</el-form>
	</div>

	<div class="gradient-bg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
    <div class="gradients-container">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div class="interactive"></div>
    </div>
  </div>

</template>

<script setup>
import { reactive, ref, useTemplateRef, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { validUsername } from '@/common/validate'
import { login } from '@/api/login'
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

const passwordDom = useTemplateRef('passwordDom')
const formDom = useTemplateRef('formDom') //该变量名必须等于el-form的ref属性值，才能获取到表单实例。

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
					dispatch.login.saveToken(res.body.token)
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

<style lang="scss" scoped>
.login-container {
	min-height: 100vh;
	width: 100%;
	background-color: var(--el-bg-color);
	overflow: hidden;
	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 25vh 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}
	.tips {
		font-size: 14px;
		color: var(--el-text-color-regular);
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
			color: var(--el-text-color-primary);
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}
}

@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

.gradient-bg {
  --color-bg1: rgb(108, 0, 162);
  --color-bg2: rgb(0, 17, 82);
  --color1: 18, 113, 255;
  --color2: 221, 74, 255;
  --color3: 100, 220, 255;
  --color4: 200, 50, 50;
  --color5: 180, 180, 50;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}

.gradient-bg {
	z-index: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  top: 0;
  left: 0;
	opacity: 0.25;
	pointer-events: none;
  svg {
    position: fixed;
    top:0;
    left:0;
    width: 0;
    height: 0;
  }

  .gradients-container {
    filter: url(#goo) blur(40px) ;
    width: 100%;
    height: 100%;
  }

  .g1 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: center center;
    animation: moveVertical 30s ease infinite;

    opacity: 1;
  }

  .g2 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;

    opacity: 1;
  }

  .g3 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);

    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;

    opacity: 1;
  }

  .g4 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;

    opacity: 0.7;
  }

  .g5 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));

    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;

    opacity: 1;
  }

  .interactive {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color-interactive), 0.8) 0, rgba(var(--color-interactive), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;

    opacity: 0.7;
  }
}

</style>
