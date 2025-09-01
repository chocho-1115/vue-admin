<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="avatar-container" :style="{
        width: size,
        height: size
    }">
      <img-load :src="ctx.userInfo.avatar" defaultName="user" backgroundColor="rgba(0, 0, 0, .05)" defaultColor="var(--el-color-primary)" defaultWidth="50%" defaultHeight="50%" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="PersonalCenter">Personal Center</el-dropdown-item>
        <el-dropdown-item command="Notification">Notification</el-dropdown-item>
        
        <el-dropdown-item command="Home" divided>Home</el-dropdown-item>
        <el-dropdown-item command="Github">Github</el-dropdown-item>
        
        <el-dropdown-item  command="LogOut" divided>Log Out</el-dropdown-item>
        <!--  @click.native="onLogout" -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { logout } from '@/api/user'
import { dispatch } from '@/store'

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

const handleCommand = (command) => {
  if(command == 'Home'){
    router.push('/')
  }else if(command == 'Github'){
    window.open('https://github.com/chocho-1115/vue-admin', '_blank')
  }else if(command == 'LogOut'){
    onLogout()
  }else{
    ElMessage(`click on item ${command}`)
  }
  
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
