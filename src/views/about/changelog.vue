<template>
	<Markdown :htmlContent="htmlContent"></Markdown>
</template>

<script setup>
import Markdown from "@/components/Markdown.vue"
import htmlContent from "../../../CHANGELOG.md"
</script>
