<template>
  <div :class="{'collapse': props.collapse}" class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link to="/" v-if="props.collapse">
        <img class="sidebar-logo" src="@/assets/logo.svg" v-if="showLogo" />
        <h1 class="sidebar-title" v-else>{{ title }}</h1>
      </router-link>
      <router-link to="/" v-else>
        <img class="sidebar-logo" src="@/assets/logo.svg" v-if="showLogo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
    collapse: {
        type: Boolean,
        required: true,
    },
})
const title = ref('Vue Admin')
const showLogo = ref(true)
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 12px;
    }

    .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>
