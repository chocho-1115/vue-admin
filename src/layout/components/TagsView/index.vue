<template>
  <div class="tags-view-container" id="tags-view-container" ref="tagsRootDom">
    <scroll-pane @scroll="handleScroll" class="tags-view-wrapper" ref="scrollPaneDom">
      <router-link
        :class="isActive(tag)?'active':''"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        @contextmenu.prevent.native="openMenu(tag,$event)"
        class="tags-view-item"
        ref="tagsDom"
        v-for="tag in ctx.tagsView"
      >
        {{ tag.title }}
        <el-icon
          @click.prevent.stop="closeSelectedTag(tag)"
          class="el-icon-close"
          v-if="!isAffix(tag) && ctx.tagsView.length > 1"
        >
          <i-ep-Close />
        </el-icon>
      </router-link>
    </scroll-pane>
    <ul
      :style="{left: menu.left+'px',top: menu.top+'px'}"
      class="contextmenu"
      v-show="menu.visible"
    >
      <li @click="reloadAppMain">Refresh</li>
      <li
        @click="closeSelectedTag(selectedTag)"
        v-if="!isAffix(selectedTag) && ctx.tagsView.length > 1"
      >Close</li>
      <li @click="closeOthersTags" v-if="ctx.tagsView.length > 1">Close Others</li>
    </ul>
  </div>
</template>
<script setup>
import { ref, reactive, inject, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import path from 'path-browserify-esm'

import ScrollPane from './ScrollPane.vue'
import { dispatch, ctx } from '@/store'

const reloadAppMain = inject('reloadAppMain')

const router = useRouter()
const route = useRoute()

const tagsDom = ref(null)
const scrollPaneDom = ref(null)
const tagsRootDom = ref(null)

const menu = reactive({
    visible: false,
    top: 0,
    left: 0,
})

let selectedTag = null
let affixTags = []

watch(
    () => route.fullPath,
    () => {
        addTags()
        moveToCurrentTag()
    }
)

watch(
    () => menu.visible,
    (value) =>
        value
            ? document.body.addEventListener('click', closeMenu)
            : document.body.removeEventListener('click', closeMenu)
)

onMounted(() => {
    initTags()
    addTags()
})

const isActive = (view) => {
    return view.path === route.path
}
const isAffix = (tag) => {
    if (!tag) return false
    return tag.meta && tag.meta.affix
}

const filterAffixTags = (routes, basePath = '/') => {
    let tags = []
    routes.forEach((route) => {
        const tagPath = path.join(basePath, route.path)
        if (route.children) {
            const tempTags = filterAffixTags(route.children, tagPath)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
            // } else if (route.meta && route.name) {
        } else if (route.meta && route.name && route.meta.affix) {
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta },
            })
        }
    })
    return tags
}
const initTags = () => {
    affixTags = filterAffixTags(router.options.routes)
    for (const tag of affixTags) {
        dispatch.tagsView.add(tag)
    }
}

const addTags = () => {
    const { name } = route
    if (name) {
        dispatch.tagsView.add(route)
    }
    return false
}
const closeSelectedTag = (view) => {
    dispatch.tagsView.remove(view)
    if (isActive(view)) {
        toLastView()
    }
}
const toLastView = () => {
    const latestView = ctx.tagsView.slice(-1)[0]
    latestView && router.push(latestView.fullPath)
}
const closeOthersTags = () => {
    dispatch.tagsView.removeOthers(selectedTag)
    router.push(selectedTag)
}
const openMenu = (tag, e) => {
    const menuMinWidth = 105
    const offsetLeft = tagsRootDom.value.getBoundingClientRect().left // container margin left
    const offsetWidth = tagsRootDom.value.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right

    if (left > maxLeft) {
        menu.left = maxLeft
    } else {
        menu.left = left
    }

    menu.top = e.clientY
    menu.visible = true
    selectedTag = tag
}
const closeMenu = () => {
    menu.visible = false
}
const handleScroll = () => {
    if (!menu.visible) return
    closeMenu()
}

const moveToCurrentTag = async () => {
    await nextTick()
    for (const tag of tagsDom.value) {
        if (tag.to.path === route.path) {
            scrollPaneDom.value.moveToTarget(tag, tagsDom)
            // when query is different then update
            if (tag.to.fullPath !== route.fullPath) {
                dispatch.tagsView.update(route)
            }
            break
        }
    }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    border-top: 1px solid var(--el-border-color-extra-light);
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border-radius: 2px;
            color: #495060;
            
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            &:first-of-type {
                margin-left: 15px;
            }
            &:last-of-type {
                margin-right: 15px;
            }
            &.active {
                background-color: var(--el-color-primary);
                // border-color: #42b983;
                color: #fff;
            }
            .el-icon-close {
                margin-left: 2px;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                &:hover {
                    background-color: var(--el-fill-color-light);
                    color: var(--el-color-primary);
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
