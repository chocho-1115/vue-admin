<template>
  <logo class="logo-container" :collapse="isCollapse" theme="light" v-if="showLogo" />
  <menu-list :height="showLogo ? 'calc(100% - 50px)' : '100%'" :isCollapse="isCollapse" />
</template>

<script setup>
import { computed, inject } from 'vue'

import { sctx } from '@/store'
import Logo from '../common/Logo.vue'
import MenuList from '../common/Menu/index.vue'

const ctx = inject('context')

const showLogo = sctx.sidebarLogo

const isCollapse = computed(() => {
    return !ctx.sidebar.opened
})

</script>
<style lang="scss" scoped>
.logo-container{
  background: #2b2f3a;
}
</style>