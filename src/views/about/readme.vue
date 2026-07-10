<template>
  <Markdown>
    <div v-html="htmlContent"></div>
  </Markdown>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

import Markdown from '@/components/Markdown.vue'
import rawMd from '../../../README.md?raw'

const md = new MarkdownIt({ html: true })
const htmlContent = ref('')

onMounted(() => {
  htmlContent.value = md.render(rawMd)
})
</script>
