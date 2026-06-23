<template>
  <div>
    <div class="text">user name: {{ context.userInfo.name }}</div>
    <p>inject('context')与import { ctx as context } from '@/store'等效</p>
    <!-- <div class="text">{{ context.tagsView.length }}</div> -->

    <div class="text">{{ ctx.o.a }}|{{ ctx.a[0] }}</div>
    <p>测试keepAlive，返回页面时，数字变为2.即缓存页面成功</p>

    <div class="text">
      <button @click="routerChange">Click to change form page query</button>
    </div>
    <p>给标签页加参数，看看再次进入标签页参数是否丢失（这里点击侧边栏二次进入标签页会丢失，这种场景不考虑）</p>

    <div class="text">
      <button @click="avatarChange">Click to change form userInfo.avatar</button>
    </div>
    <p>点击清空用户头像 模拟图片动态变化</p>
      
		<div style="width:100px;height:100px;">
			<img-load :src="ctx.src"  backgroundColor="var(--el-fill-color-light)" defaultColor="var(--el-color-primary)" />
		</div>
		
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
// import { ctx as context } from '@/store'
const context = inject('context') // import store 和 inject的方式是一样的效果
const router = useRouter()

const obj = { a: 1 }
const arr = [1]
const ctx = reactive({
    o: obj,
    a: arr,
		src: '',
})

setTimeout(function () {
    // 下面的修改不会引起页面变化
    // obj.a = 2
    // arr[0] = 2

    // 这样才可以
    ctx.o.a = 2
    ctx.a[0] = 2

    console.log(ctx.o.a, ctx.a[0]) // 这里的值始终是更新了的
}, 3000)

////////////////////
let v = 0
const routerChange = () => {
    v++
    router.push({
        name: 'Form',
        // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
        // params: { pathMatch: this.$route.path.substring(1).split('/') },
        // 保留现有的查询和 hash 值，如果有的话
        query: { name: v },
        // hash: { t: 2 },
    })
}

let avatar = ''
const avatarChange = () => {
    if(avatar){
        context.userInfo.avatar = avatar
        avatar = ''
				ctx.src = undefined
    }else{
        avatar = context.userInfo.avatar
        context.userInfo.avatar = ''
				ctx.src = avatar
    }
}
</script>

<style lang="scss" scoped>
.text {
    margin: 30px 30px 0;
    font-size: 30px;
    line-height: 1.3em;
}
button {
    font-size: 16px;
}
p {
    margin: 0 30px;
}
</style>
