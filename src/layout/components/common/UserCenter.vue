<template>
  <el-dropdown trigger="click">
    <div class="avatar-container" :style="{
        width: size,
        height: size
    }">
      <img-load :src="ctx.userInfo.avatar" defaultName="user" backgroundColor="rgba(0, 0, 0, .05)" :defaultColor="variables.menuActiveText" defaultWidth="50%" defaultHeight="50%" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>Home</el-dropdown-item>
        </router-link>
        <a href="https://github.com/chocho-1115/vue-admin" target="_blank">
          <el-dropdown-item>Github</el-dropdown-item>
        </a>
        <el-dropdown-item @click.native="onLogout" divided>
          <span style="display:block;">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { logout } from '@/api/user'
import { dispatch } from '@/store'
import variables from '@/styles/variables.module.scss'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  size: {
    type: String,
    default: '32px',
  },
})

const ctx = inject('context')
const redirect = route.fullPath || '/'

const onLogout = async () => {
  logout().then(() => {
    dispatch.user.removeInfo()
    router.push(`/account/login?redirect=${redirect}`)
  })
}
</script>

<style lang="scss" scoped>
.avatar-container {
  cursor: pointer;
  display: inline-block;
  border-radius: 10px;
  overflow: hidden;
}
</style>
