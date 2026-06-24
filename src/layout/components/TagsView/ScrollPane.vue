<template>
  <el-scrollbar :vertical="false" class="scroll-container" ref="scrollContainer">
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits()
const scrollContainer = ref(null)

const tagAndTagSpacing = 4 // tagAndTagSpacing

const scrollWrapper = computed(() => {
    // 滚动条设置了overflow的元素 也可理解为滚动区
    // https://element-plus.org/zh-CN/component/scrollbar.html#exposes
    return scrollContainer.value.$refs.wrapRef
})

onMounted(() => {
    scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
    scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

const emitScroll = () => {
    emit('scroll')
}
defineExpose({
    moveToTarget: (currentTag, tagsDom) => {
        // const $container = scrollContainer.value.$el // 组件ref的$el 可获取到组件的根元素
        const wrapper = scrollWrapper.value // 滚动条设置了overflow的元素

        const offsetWidth = wrapper.offsetWidth
        const scrollWidth = wrapper.scrollWidth
        const scrollLeft = wrapper.scrollLeft
        const tagList = tagsDom.value

        let firstTag = null
        let lastTag = null

        // find first tag and last tag
        if (tagList.length > 0) {
            firstTag = tagList[0]
            lastTag = tagList[tagList.length - 1]
        }

        if (firstTag === currentTag) {
            wrapper.scrollLeft = 0
        } else if (lastTag === currentTag) {
            wrapper.scrollLeft = scrollWidth - offsetWidth
        } else {
            // find preTag and nextTag
            const currentIndex = tagList.findIndex((item) => item === currentTag)
            const prevTag = tagList[currentIndex - 1]
            const nextTag = tagList[currentIndex + 1]

            // the tag's offsetLeft after of nextTag
            const afterNextTagOffsetLeft =
                nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

            // the tag's offsetLeft before of prevTag
            const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

            if (afterNextTagOffsetLeft > scrollLeft + offsetWidth) {
                wrapper.scrollLeft = afterNextTagOffsetLeft - offsetWidth
            } else if (beforePrevTagOffsetLeft < scrollLeft) {
                wrapper.scrollLeft = beforePrevTagOffsetLeft
            }
        }
    },
})
</script>

<style lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    :deep(.el-scrollbar__bar) {
        bottom: 0px;
    }
    :deep(.el-scrollbar__view) {
        height: 100%;
    }
}
</style>
