<template>
	<div class="wrap" v-if="info.status" :style="{ 'background-color': backgroundColor }">
		<!-- <img 
            v-if='!info.finishLoadFlag' 
            :src='defaultSrc' 
            :style='{"object-fit": mode, "width": defaultWidth, "height": defaultHeight}' 
        /> -->

		<svg-icon :icon="defaultName" class="icon" v-if='!info.finishLoadFlag'
			:style='{ color: defaultColor, "object-fit": "cover", "width": defaultWidth, "height": defaultHeight }' />

		<!-- 下面src 为空时 会赋值 'loadError' 是为了当src动态变化为空字符串时 触发binderror事件 将info.finishLoadFlag重置为 false -->
		<!-- src='{{src || "loadError"}}'  -->
		<img :src='src ? src + info.XOssProcess : "loadError"' @load='onLoadSuccess' @error='onLoadError'
			:class="{ 'before-load': !info.finishLoadFlag }"
			:style='{ "object-fit": mode, "width": info.finishLoadFlag && width ? width : false, "height": info.finishLoadFlag && height ? height : false }' />
	</div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const info = reactive({
	finishLoadFlag: false,
	XOssProcess: '',
	status: 0, // 为了防止图片加载2次 设置好XOssProcess 后再显示图片
});

const props = defineProps({
	//原始图片
	src: { default: '' },
	//默认图片
	defaultName: {
		default: 'default'
	},
	defaultColor: {
		default: ''
	},
	defaultWidth: { // 属性名
		type: String,
		default: "72%"
	},
	defaultHeight: { // 属性名
		type: String,
		default: "72%"
	},
	width: { // 属性名
		type: String,
		default: "100%"
	},
	height: { // 属性名
		type: String,
		default: "100%"
	},
	mode: { // 属性名
		type: String,
		default: "cover" // cover contain fill none
	},
	backgroundColor: { // 属性名
		type: String,
		default: "transparent"
	},
	// oss图片格式 不传 默认为原图图片格式
	ossFormat: { // 属性名
		type: String,
		default: ""
	},
	// oss图片宽
	ossW: { // 属性名
		type: Number,
		default: 750
	}
})

// watch(() => props.src, (val) => {
//     console.log(val)
//     info.finishLoadFlag = false
//     info.status = 0
// })

// https://help.aliyun.com/zh/oss/user-guide/resize-images-4?spm=a2c4g.11186623.0.0.47353328T327qz
const setOssStr = () => {
	var src = props.src;
	// 远程图片 || 没有参数的
	if (!src.startsWith('http') || src.lastIndexOf('?') !== -1) {
		info.status = 1
		return
	}
	let srcInfo = src.split('.');
	let format = props.ossFormat || srcInfo[srcInfo.length - 1].toLowerCase();// 图片格式

	info.XOssProcess = `?x-oss-process=image/resize,m_lfit,w_${props.ossW}/format,${format}/quality,Q_90`
	info.status = 1

}

const onLoadSuccess = (e) => {
	info.finishLoadFlag = true
}

const onLoadError = (e) => {
	info.finishLoadFlag = false
}

setOssStr();

</script>

<style lang="scss" scoped>
.before-load {
	width: 0 !important;
	height: 0 !important;
	opacity: 0;
}

.wrap {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

}

img{
	transition:opacity .8s;
}
</style>
