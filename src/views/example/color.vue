<template>
	<div class="app-container">
    <div class="list" v-for="_ of elementColos" :key="_">
      <div class="title">
        {{ _.title }}
      </div>
      <div class="grid">
        <el-tooltip v-for="item of _.list" :key="item" placement="top" :content="item.value" :disabled="disabled">
          <div class="icon-item" :style="item.style" @click="handleClipboard(item.value)">
            <span>{{ item.description }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  copyText
} from '@/utils'

const disabled = ref(false)
const elementColos = reactive([])

const addColor = (name, variables, cssFactory) => {
  const res = {
    title: name,
    list: []
  }
  variables.map((item)=>{
    const value = item ? `--el-${name}-${item}` : `--el-${name}`
    res.list.push({
      value,
      description: value.replace('--el-', ""),
      style: cssFactory(value)
    })
  })
  elementColos.push(res)
}
// node_modules/element-plus/theme-chalk/src/dark/var.scss
const EL_BOX_SHADOW_WEIGHT = ['', 'light', 'lighter', 'dark'];
const EL_BG_WEIGHT = ['page', '', 'overlay'];
const EL_TEXT_WEIGHT = ['primary', 'regular', 'secondary', 'placeholder', 'disabled'];
const EL_BORDER_WEIGHT = ['darker', 'dark',  '', 'light', 'lighter', 'extra-light'];
const EL_FILL_WEIGHT = ['darker', 'dark',  '', 'light', 'lighter', 'extra-light', 'blank'];
const EL_MASK_WEIGHT = ['', 'extra-light'];

addColor('box-shadow', EL_BOX_SHADOW_WEIGHT, variables => ({ boxShadow: `var(${variables})` }))
addColor('bg-color', EL_BG_WEIGHT, variables => ({ backgroundColor: `var(${variables})` }))
addColor('text-color', EL_TEXT_WEIGHT, variables => ({ backgroundColor: `var(${variables})` }))
addColor('border-color', EL_BORDER_WEIGHT, variables => ({ backgroundColor: `var(${variables})` }))
addColor('fill-color', EL_FILL_WEIGHT, variables => ({ backgroundColor: `var(${variables})` }))
addColor('mask-color', EL_MASK_WEIGHT, variables => ({ backgroundColor: `var(${variables})` }))

const handleClipboard = (text) => {
	disabled.value = true
	copyText(text, () => {
		ElMessage({
			message: 'Copied!',
			type: 'success',
			duration: 2 * 1000,
			onClose(){
				disabled.value = false
			}
    })
	})
}

</script>

<style lang="scss" scoped>
.grid {
	position: relative;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 0));
}
.icon-item {
	margin: 20px;
	height: 85px;
	text-align: center;
	width: 140px;
	
  display:flex;
  align-items: center;
  justify-content: center;
	color: #6b778c;
  font-size: 12px;
	cursor: pointer;
}
</style>
