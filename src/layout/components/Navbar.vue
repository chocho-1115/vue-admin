<template>
  <div class="navbar">
    <hamburger :is-active="ctx.sidebar.opened" @toggleClick="toggleSidebar" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-tooltip content="Under development" effect="dark" placement="bottom">
        <div class="right-menu-item hover-effect">
          <el-icon>
            <i-ep-Search />
          </el-icon>
        </div>
      </el-tooltip>
      <div class="right-menu-item hover-effect" @click="drawer = true">
        <el-icon>
          <i-ep-Bell />
        </el-icon>
      </div>
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <img-load :src="ctx.userInfo.avatar" defaultName="user" backgroundColor="rgba(0, 0, 0, .05)" :defaultColor="variables.menuActiveText" defaultWidth="50%" defaultHeight="50%" />
        </div>
        <template v-slot:dropdown>
          <el-dropdown-menu class="user-dropdown">
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
    </div>
  </div>

  <Teleport to="body">
    <el-drawer v-model="drawer" title="I am the title" :with-header="true">
      <!-- 历史记录、文档类 -->
      <div style="color:#666;">
        Under development
      </div>
    </el-drawer>
  </Teleport>

</template>

<script setup>
import { inject, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumb from '@/components/Breadcrumb.vue'
import Hamburger from '@/components/Hamburger.vue'

import { logout } from '@/api/user'
import { dispatch } from '@/store'
import variables from '@/styles/variables.module.scss'

const ctx = inject('context')
const drawer = ref(false)

const router = useRouter()
const route = useRoute()

const redirect = route.fullPath || '/'

const toggleSidebar = () => {
  dispatch.sidebar.toggle()
}
const onLogout = async () => {
  logout().then(() => {
    dispatch.user.removeInfo()
    router.push(`/account/login?redirect=${redirect}`)
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;

    line-height: 50px;
    margin-right: 15px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-flex;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #888;
      // vertical-align: text-bottom;
      align-items: center;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
      }
    }

    .right-menu-item:nth-last-child(2) {
      margin-right: 8px;
    }

    .avatar-container {
      cursor: pointer;
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
</style>
