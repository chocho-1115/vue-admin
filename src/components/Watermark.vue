<script setup>
import { reactive, watch } from 'vue'
import { ctx } from "@/store"

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})

watch(
  () => ctx.theme.isDark,
  (v) => {
    font.color = v
      ? 'rgba(255, 255, 255, .15)'
      : 'rgba(0, 0, 0, .15)'
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <el-watermark :font="font">
    <slot/>
  </el-watermark>
</template>
