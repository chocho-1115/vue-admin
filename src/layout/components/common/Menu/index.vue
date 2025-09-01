<template>
  <el-scrollbar :height="props.height" class="router-menu">
    <!-- 必须添加background-color属性，因为收起菜单时 悬浮二级菜单默认为白色背景 需要重置 -->
    <!-- :text-color="variables.menuText" -->
    <!--  -->
    <!-- background-color="var(--el-fill-color-extra-light)" -->
    <el-menu
      active-text-color="var(--el-color-primary)"
      text-color="var(--el-text-color-regular)"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      
      :unique-opened="false"
      mode="vertical"

    >
      <item
        :base-path="route.path"
        :info="route"
        :key="route.path"
        v-for="route in routes"
      />
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
  :deep(.svg-icon) {
    flex-shrink: 0;
    margin-right: 16px;
  }
  :deep(.el-menu-icon) {
    font-size: inherit; // el-menu-icon 的字体大小被element主题css设置为了18px 这里改为集成父元素字体大小 与svg-icon自定义svg保持一致
    width: 1em;
    height: 1em;
    margin-right: 16px;
    transform: scale(1.2);// 由于element的icon其viewBox没有顶边，而自定义的svg都顶边了 so通过缩放来保持大小一致
  }
  :deep(.el-menu) {
    border: none;
  }
}
</style>

<style lang="scss">
.hideSidebar {
  .el-sub-menu__icon-arrow {
        display: none;
  }
  .el-menu--collapse {
    width: auto;
  }
  .el-menu--collapse {
    .el-sub-menu__title {
        &>span {
          display:none
        }
    }
  }
}

.el-menu--popup-container {
  .el-menu {
    .svg-icon {
      margin-right: 5px;
    }
    .el-menu-icon {
      font-size: inherit; // el-menu-icon 的字体大小被element主题css设置为了18px 这里改为集成父元素字体大小 与svg-icon自定义svg保持一致
      width:1em;
      transform: scale(1.2);// 由于element的icon其viewBox没有顶边，而自定义的svg都顶边了 so通过缩放来保持大小一致
    }
  }
}
</style>