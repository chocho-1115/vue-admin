import { reactive } from "vue"

import { getDevice } from "@/common/layout"
import userInfo from "./user"
import sidebar from "./sidebar"
import tagsView from "./tagsView"
import theme from "./theme"

export default reactive({
	device: getDevice(),
	userInfo,
	sidebar,
	tagsView,
	theme,
})
