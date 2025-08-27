<template>
  <div class="navbar">
    <logo class="logo-container" v-if="ctx.device==='mobile'" />
    <hamburger class="hamburger-container" v-if="ctx.device!=='mobile'" :is-active="ctx.sidebar.opened" @toggleClick="toggleSidebar" />
    <breadcrumb class="breadcrumb-container" v-if="ctx.device!=='mobile'" />
    <div class="right-menu">
      <el-tooltip content="Under development" effect="dark" placement="bottom" v-if="ctx.device!=='mobile'">
        <div class="right-menu-item hover-effect">
          <el-icon>
            <i-ep-Search />
          </el-icon>
        </div>
      </el-tooltip>
      <div class="right-menu-item hover-effect" @click="drawerMessage = true" v-if="ctx.device!=='mobile'">
        <el-icon>
          <i-ep-Bell />
        </el-icon>
      </div>
      <div class="right-menu-item hover-effect" @click="drawerMenu = true" v-if="ctx.device==='mobile'">
        <svg-icon icon="menu" />
      </div>
      <UserCenter v-if="ctx.device!=='mobile'" />
    </div>
  </div>

  <Teleport defer to="body">
    <!-- drawer-menu-container元素是为了:deep样式生效 -->
    <div class="drawer-menu-container">
      <el-drawer v-model="drawerMenu" size="min(400px, max(30%, 240px))" :show-close="false">
        <template #header>
          <div class="menu-header">
            <UserCenter size="40px" />
          </div>
        </template>
        <menu-list />
      </el-drawer>
    </div>
  </Teleport>

  <Teleport defer to="body">
    <el-drawer v-model="drawerMessage" title="I am the title" :with-header="true" size="min(400px, max(30%, 240px))">
      <!-- 历史记录、文档类 -->
      <div style="color:#666;">
        Under development
      </div>
    </el-drawer>
  </Teleport>

</template>

<script setup>
import { inject, ref } from 'vue'

import MenuList from '../common/Menu/index.vue'
import Logo from '../common/Logo.vue'
import Breadcrumb from './Breadcrumb.vue'
import Hamburger from './Hamburger.vue'
import UserCenter from '../common/UserCenter.vue'

import { dispatch } from '@/store'

const ctx = inject('context')
const drawerMenu = ref(false)
const drawerMessage = ref(false)

const toggleSidebar = () => {
  dispatch.sidebar.toggle()
}

</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as v;
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo-container{
    float: left;
    margin-left: 15px;
  }
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
  }
}
.menu-header{
  height:80px;
  display: flex;
  align-items: center;
}

.drawer-menu-container :deep(.el-drawer__header) {margin-bottom:0;padding-top:0;background:rgba(0,0,0,.05);border-bottom:solid 1px rgba(0,0,0,.05)}
.drawer-menu-container :deep(.el-drawer__body) {padding: 0 !important}
.drawer-menu-container :deep(.el-drawer) {background-color: v.$menuBg;}
</style>
