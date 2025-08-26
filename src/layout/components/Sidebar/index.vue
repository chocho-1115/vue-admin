<template>
  <div>
    <logo :collapse="isCollapse" v-if="showLogo" />
    <el-scrollbar :height="showLogo ? 'calc(100% - 50px)' : '100%'">
      <el-menu
        :active-text-color="variables.menuActiveText"
        :background-color="variables.menuBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :text-color="variables.menuText"
        :unique-opened="false"
        mode="vertical"
      >
        <sidebar-item
          :base-path="route.path"
          :item="route"
          :key="route.path"
          v-for="route in routes"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { onBeforeRouteUpdate } from 'vue-router'

import { sctx } from '@/store'
import variables from '@/styles/variables.module.scss'
import Logo from '../common/Logo.vue'
import SidebarItem from './SidebarItem.vue'

const ctx = inject('context')

const routes = useRouter().options.routes
const route = useRoute()

const showLogo = sctx.sidebarLogo

const isCollapse = computed(() => {
    return !ctx.sidebar.opened
})

const activeMenu = computed(() => {
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu
    }
    return path
})
</script>
