<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link to="/" v-if="props.collapse">
        <img class="sidebar-logo" src="@/assets/logo.svg" />
      </router-link>
      <router-link to="/" v-else>
        <img class="sidebar-logo" src="@/assets/logo.svg" />
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
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

// .sidebarLogoFade-leave-to 
.sidebarLogoFade-enter-from{
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
    
  }

  .sidebar-title {
    display: inline-block;
    margin: 0;
    padding-left: 12px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
