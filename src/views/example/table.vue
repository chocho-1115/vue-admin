<template>
	<div class="app-container">
		<el-table :data="table.list" border fit highlight-current-row v-loading="table.listLoading">
			<el-table-column align="center" label="ID" width="95">
				<template v-slot="scope">{{ scope.$index }}</template>
			</el-table-column>

			<el-table-column label="Title" prop="title" />
			<el-table-column align="center" label="Author" prop="author" width="110" />
			<el-table-column align="center" label="Pageviews" prop="pageviews" width="110" />

			<el-table-column align="center" class-name="status-col" label="Status" width="110">
				<template v-slot="scope">
					<el-tag :type="statusFilter(scope.row.status)">{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="Display_time" prop="display_time" width="200" />
		</el-table>
	</div>
</template>

<script setup>
import { onMounted, reactive } from "vue"
import { getList } from "@/api/table"

const table = reactive({
	list: null,
	listLoading: true,
})

const statusFilter = (status) => {
	const statusMap = {
		published: "success",
		draft: "primary",
		deleted: "danger",
		// ["primary", "success", "info", "warning", "danger"]
	}
	return statusMap[status]
}

onMounted(() => {
	fetchData()
})
const fetchData = () => {
	table.listLoading = true
	getList().then((res) => {
		table.list = res.data.items
		table.listLoading = false
	})
}
</script>
