<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :key="item.path" v-for="(item,index) in level.list">
        <span
          class="no-redirect"
          v-if="item.redirect==='noRedirect'||index==level.list.length-1"
        >{{ item.meta.title }}</span>
        <a @click.prevent="handleLink(item)" v-else>{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// import pathToRegexp from 'path-to-regexp'
// import path from 'path-browserify-esm'

const route = useRoute()
const router = useRouter()
const level = reactive({
    list: [],
})

onMounted(() => {
    getBreadcrumb()
})

watch(
    () => route.path,
    () => {
        getBreadcrumb()
    }
)

const getBreadcrumb = () => {
    // only show routes with meta.title
    let matched = route.matched.filter((item) => item.meta && item.meta.title)
    const first = matched[0]
    if (!isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
    }
    level.list = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    )
}
const isDashboard = (route) => {
    const name = route && route.name

    if (!name) {
        return false
    }
    return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}
// const pathCompile = (path) => {
//     const { params } = route
//     var toPath = pathToRegexp.compile(path)
//     return toPath(params)
// }
const handleLink = (item) => {
    const { redirect, path } = item
    if (redirect) {
        router.push(redirect)
        return
    }
    router.push(path)
    // router.push(pathCompile(path))
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
