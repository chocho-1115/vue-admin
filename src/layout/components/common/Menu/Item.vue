<template>
  <div v-if="!info.hidden">
    <template v-if="!alwaysShow && theOnlyOneChild && !theOnlyOneChild.children">
      <app-link :to="resolvePath(theOnlyOneChild.path)" v-if="theOnlyOneChild.meta">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)" class="submenu-title-noDropdown">
          <template v-if="theOnlyOneChild.meta.icon">
            <svg-icon :icon="theOnlyOneChild.meta.icon" v-if="typeof theOnlyOneChild.meta.icon === 'string'" />
            <el-icon class="el-menu-icon" v-else>
              <component :is="theOnlyOneChild.meta.icon" />
            </el-icon>
          </template>
          <template #title v-if="theOnlyOneChild.meta.title">
            <span>{{ theOnlyOneChild.meta.title }}</span>
          </template>

          <!-- <Item :icon="theOnlyOneChild.meta.icon" :title="1+theOnlyOneChild.meta.title" /> -->
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu :index="resolvePath(info.path)" popper-append-to-body ref="subMenu" v-else>
      <template #title>
        <template v-if="info.meta.icon">
          <svg-icon :icon="info.meta.icon" v-if="typeof info.meta.icon === 'string'" />
          <el-icon class="el-menu-icon" v-else>
            <component :is="info.meta.icon" />
          </el-icon>
        </template>
        <template v-if="info.meta.title">
          <span>{{ info.meta.title }}</span>
        </template>

        <!-- <Item :icon="item.meta.icon" :title="item.meta.title" /> -->
      </template>
      <item :base-path="resolvePath(child.path)" :is-nest="true" :info="child" :key="child.path" class="nest-menu"
        v-for="child in info.children" />
    </el-sub-menu>
  </div>
</template>

<script setup>
import path from 'path-browserify-esm'
import { inject, ref, onMounted } from 'vue'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
// import Item from './Item'

const ctx = inject('context')

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const subMenu = ref(null)

onMounted(() => {
  // fixBugIniOS()
})

/** 是否始终显示根菜单 */
const alwaysShow = props.info.meta?.alwaysShow

/** 显示的子菜单 */
const showingChildren = props.info.children?.filter((child) => !child.meta?.hidden) ?? []

/** 唯一的子菜单项 */
const theOnlyOneChild = (function () {
  const number = showingChildren.length
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren[0]
    default:
      return { ...props.info, path: '' }
  }
})()

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // return path.resolve(props.basePath, routePath)
  return path.join(props.basePath, routePath)
}

const fixBugIniOS = () => {
  if (subMenu.value) {
    ///  handleMouseleave 似乎是有问题的
    const handleMouseleave = subMenu.value.handleMouseleave
    subMenu.value.handleMouseleave = (e) => {
      if (ctx.device === 'mobile') {
        return
      }
      handleMouseleave(e)
    }
  }
}
</script>
