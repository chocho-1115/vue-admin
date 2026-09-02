import { getThemeName } from "@/store/storage"

const name = getThemeName()

export default {
	name,
	isDark: name === "dark" ? true : false
	// color: "",
}
