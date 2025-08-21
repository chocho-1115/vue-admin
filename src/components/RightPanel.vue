<template>
  <div :class="{show}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const show = ref(false)

watch(show, (val) => {
  if (val) {
    addEventClick() 
  }
  if (val) {
    document.body.classList.add('showRightPanel')
  } else {
    document.body.classList.remove('showRightPanel')
  }
}) 

const addEventClick = () => {  
  window.addEventListener('click', closeSidebar, true)
}
const closeSidebar = (evt) => {
  const parent = evt.target.closest('.rightPanel')
  if (!parent) {
    show.value = false
    window.removeEventListener('click', closeSidebar)
  }
}
  
// 定义一个方法来切换显示/隐藏状态
const toggleVisibility = () => {
  show.value = !show.value;
};

// 暴露方法和变量给父组件
defineExpose({
  toggleVisibility,
});
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  visibility: hidden;
  &.show{
    visibility: visible;
  }
}
.rightPanel-background {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  -webkit-backdrop-filter: blur(2px);
	backdrop-filter: blur(2px);
}
.show {
  .rightPanel-background {
    opacity: 1;
  }
}
.rightPanel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 260px;
  height: 100vh;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: transform .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
}
.show {
  .rightPanel { 
    transform: translate(0);
  }
}
</style>
<!-- 

<div class="right-menu-item hover-effect" @click="rightPanelRef.toggleVisibility">
  <el-icon>
    <i-ep-Bell />
  </el-icon>
</div>

<Teleport to="body">
  <right-panel ref="rightPanelRef">
    <div style="padding:20px;color:#666;">
      Under development
    </div>
  </right-panel>
</Teleport>

import RightPanel from '@/components/RightPanel.vue'
const rightPanelRef = ref(null)

-->