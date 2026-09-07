import { getRouter } from "../runtime"

const goLogin = () => {
	const router = getRouter()
	if (router.currentRoute.value.path === "/account/login") return
	router.push(`/account/login?redirect=${router.currentRoute.value.fullPath || "/"}`)
}

export default goLogin
