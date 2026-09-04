import {
	createRouter,
} from "vue-router"

import { setupGuards } from './guards'
import { config, whiteList } from "./config"

const router = createRouter(config)

setupGuards(router)

export default router

export const isWhitePage = (path) => {
	const route = router.currentRoute.value.path
	return !(whiteList.indexOf(path || route.path) === -1)
}

export const goLogin = () => {
	if (router.currentRoute.value.path === "/account/login") return
	router.push(`/account/login?redirect=${router.currentRoute.value.fullPath || "/"}`)
}