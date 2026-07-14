<template>
	<div class="app-container">
		<p>
			The following example is from
			<a href="https://element-plus.org/zh-CN/component/form.html#典型表单" target="_blank">
				<el-text type="primary">element plus</el-text>
			</a>
		</p>
		<el-divider />

		<el-form :model="form" style="max-width: 600px">
			<el-form-item label="Activity name">
				<el-input v-model="form.name" />
			</el-form-item>
			<el-form-item label="Activity zone">
				<el-select placeholder="please select your zone" v-model="form.region">
					<el-option label="Zone one" value="shanghai" />
					<el-option label="Zone two" value="beijing" />
				</el-select>
			</el-form-item>
			<el-form-item label="Activity time">
				<el-col :span="11">
					<el-date-picker
						placeholder="Pick a date"
						style="width: 100%"
						type="date"
						v-model="form.date1"
					/>
				</el-col>
				<el-col :span="2" class="text-center">
					<span class="text-gray-500">-</span>
				</el-col>
				<el-col :span="11">
					<el-time-picker placeholder="Pick a time" style="width: 100%" v-model="form.date2" />
				</el-col>
			</el-form-item>
			<el-form-item label="Instant delivery">
				<el-switch v-model="form.delivery" />
			</el-form-item>
			<el-form-item label="Activity type">
				<el-checkbox-group v-model="form.type">
					<el-checkbox name="type" value="Online activities">Online activities</el-checkbox>
					<el-checkbox name="type" value="Promotion activities">Promotion activities</el-checkbox>
					<el-checkbox name="type" value="Offline activities">Offline activities</el-checkbox>
					<el-checkbox name="type" value="Simple brand exposure">Simple brand exposure</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="Resources">
				<el-radio-group v-model="form.resource">
					<el-radio value="Sponsor">Sponsor</el-radio>
					<el-radio value="Venue">Venue</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="Activity form">
				<el-input type="textarea" v-model="form.desc" />
			</el-form-item>
			<el-form-item>
				<el-button @click="onSubmit" type="primary">Create</el-button>
				<el-button @click="onCancel">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { reactive } from "vue"

// do not use same name with ref
const form = reactive({
	name: "",
	region: "",
	date1: "",
	date2: "",
	delivery: false,
	type: [],
	resource: "",
	desc: "",
})

const onSubmit = () => {
	ElMessage({
		message: "submit!",
		type: "success",
		duration: 2 * 1000,
	})
}
const onCancel = () => {
	ElMessage({
		message: "cancel!",
		type: "warning",
		duration: 2 * 1000,
	})
}
</script>
