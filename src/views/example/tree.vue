<template>
	<div class="app-container">
		<p>
			The following example is from
			<a href="https://element-plus.org/zh-CN/component/tree.html#树节点过滤" target="_blank">
				<el-text type="primary">element plus</el-text>
			</a>
		</p>
		<el-divider />

		<el-input
			class="w-60 mb-2"
			placeholder="Filter keyword"
			style="margin-bottom: 30px"
			v-model="filterText"
		/>

		<el-tree
			:data="data"
			:filter-node-method="filterNode"
			:props="defaultProps"
			class="filter-tree"
			ref="treeRef"
			style="max-width: 600px"
			default-expand-all
		/>
	</div>
</template>

<script setup>
import { ref, useTemplateRef, watch } from "vue"

const filterText = ref("")
const treeRef = useTemplateRef("treeRef")

const defaultProps = {
	children: "children",
	label: "label",
}

watch(filterText, (val) => {
	treeRef.value.filter(val)
})

const filterNode = (value, data) => {
	if (!value) return true
	return data.label.includes(value)
}

const data = [
	{
		id: 1,
		label: "Level one 1",
		children: [
			{
				id: 4,
				label: "Level two 1-1",
				children: [
					{
						id: 9,
						label: "Level three 1-1-1",
					},
					{
						id: 10,
						label: "Level three 1-1-2",
					},
				],
			},
		],
	},
	{
		id: 2,
		label: "Level one 2",
		children: [
			{
				id: 5,
				label: "Level two 2-1",
			},
			{
				id: 6,
				label: "Level two 2-2",
			},
		],
	},
	{
		id: 3,
		label: "Level one 3",
		children: [
			{
				id: 7,
				label: "Level two 3-1",
			},
			{
				id: 8,
				label: "Level two 3-2",
			},
		],
	},
]
</script>
