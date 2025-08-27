<template>
  <el-scrollbar :height="props.height" id="router-menu">
    <!-- 必须添加background-color属性，因为收起菜单时 悬浮二级菜单默认为白色背景 需要重置 -->
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

import variables from '@/styles/variables.module.scss'
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
<style lang="scss">
@use '@/styles/variables.module.scss' as v;

  #router-menu {
    .svg-icon {
      flex-shrink: 0;
      margin-right: 16px;
    }
    
    .el-menu-icon {
      font-size: inherit; // el-menu-icon 的字体大小被element主题css设置为了18px 这里改为集成父元素字体大小 与svg-icon自定义svg保持一致
      width: 1em;
      height: 1em;
      margin-right: 16px;
      transform: scale(1.2);// 由于element的icon其viewBox没有顶边，而自定义的svg都顶边了 so通过缩放来保持大小一致
    }

    .el-menu {
      border: none;
    }

    // menu hover
    .sub-menu-title-noDropdown,
    .el-sub-menu__title {
      &:hover {
        background-color: v.$menuHover !important;
      }
    }

    .is-active>.el-sub-menu__title {
      color: v.$subMenuActiveText !important;
    }

    .nest-menu .el-sub-menu>.el-sub-menu__title,
    .el-sub-menu .el-menu-item {
      background-color: v.$subMenuBg !important;
      &:hover {
        background-color: v.$subMenuHover !important;
      }
    }
  }

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


// when menu collapsed
.el-menu--vertical {
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