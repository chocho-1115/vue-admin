<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
    to: {
        type: String,
        required: true,
    },
})

const isExternalValue = computed(() => {
    return isExternal(props.to)
})

const type = computed(() => {
    if (isExternalValue.value) {
        return 'a'
    }
    return 'router-link'
})

const linkProps = (to) => {
    if (isExternalValue.value) {
        return {
            href: to,
            target: '_blank',
            rel: 'noopener',
        }
    }
    return {
        to: to,
    }
}
</script>
