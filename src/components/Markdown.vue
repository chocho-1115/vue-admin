<template>
  <div class="container">
    <div class="content" v-html="htmlContent"></div>
  </div>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import MarkdownIt from 'markdown-it'

const props = defineProps({
  htmlContent: {
    type: String,
    default: '',
  },
})

// const md = new MarkdownIt({ html: true })
// const htmlContent = ref('')

// onMounted(() => {
//   htmlContent.value = md.render(props.rawMd)
// })

</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
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
