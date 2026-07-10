<template>
  <Markdown :rawMd="rawMd"></Markdown>
</template>

<script setup>
import Markdown from '@/components/Markdown.vue'
import rawMd from '../../../CHANGELOG.md?raw'
</script>
