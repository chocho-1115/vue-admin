<template>
  <div class="logo-container" :theme="theme">
    <transition name="sidebarLogoFade">
      <router-link to="/" v-if="collapse">
        <img class="logo" src="@/assets/logo.svg" />
      </router-link>
      <router-link to="/" v-else>
        <img class="logo" src="@/assets/logo.svg" />
        <h1 class="title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
    collapse: {
        type: Boolean,
        default: false,
    },
    theme: {
        type: String,
        default: 'dark', // dark light
    },
})
const title = ref('Vue Admin')
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

// .sidebarLogoFade-leave-to 
.sidebarLogoFade-enter-from{
  opacity: 0;
}

.logo-container {
  position: relative;
  // width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  color: var(--el-text-color-primary);
  .logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    
  }
  .title {
    display: inline-block;
    margin: 0;
    padding-left: 12px;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
