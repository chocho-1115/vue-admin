<template>
  <div class="container">
    <h2 class="title">{{ props.title }}</h2>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
})
</script>

<style lang="scss" scoped>
.container {
    margin: 30px;
}
.title {
    margin: 30px auto;
}
.content {
    font-size: 14px;
    line-height: 1.6em;
    :deep(li) {
        margin-bottom: 8px;
    }
    :deep(a) {
        color: var(--el-color-primary);
        margin: auto 2px;
    }
}
</style>
