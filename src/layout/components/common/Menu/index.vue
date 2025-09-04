<template>
  <el-scrollbar :height="props.height" class="router-menu">
    <!-- 必须添加background-color属性，因为收起菜单时 悬浮二级菜单默认为白色背景 需要重置 -->
    <!-- :text-color="variables.menuText" -->
    <!--  -->
    <!-- background-color="var(--el-fill-color-extra-light)" -->
    <el-menu
      background-color="transparent"
      active-text-color="var(--el-color-primary)"
      text-color="var(--el-text-color-regular)"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      
      :unique-opened="false"
      mode="vertical"

    >
      <template :key="route.path" v-for="route in routes">
        <item
          :base-path="route.path"
          :info="route"
          v-if="!route.hidden"
        />
      </template>
      
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { onBeforeRouteUpdate } from 'vue-router'

import Item from './Item.vue'

const props = defineProps({
    height: {
        type: String,
        default: '100%',
    },
    isCollapse: {
        type: Boolean,
        default: false,
    },
})

const routes = useRouter().options.routes
const route = useRoute()

const activeMenu = computed(() => {
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu
    }
    return path
})
</script>
<style lang="scss" scoped>
.router-menu {
  :deep(.el-menu) {
    border-right: none;
  }
  // 触屏设备上去掉hover效果
  @media (any-hover: none) {
    :deep(.el-menu-item:hover) {
      background-color: transparent !important;
    }
  }
}
</style>
