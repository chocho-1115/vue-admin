import { getRouter } from "../runtime"
import { whiteList } from "../config"

const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const normalizePath = (p) => p.replace(/\/+$/g, "") || "/"

function globToRegExp(glob) {
	const segments = glob.replace(/^\/+|\/+$/g, "").split("/")
	let re = "^"
	segments.forEach((seg) => {
		if (seg === "**")
			re += "(?:/[^/]+)*" // 0+ 段
		else if (seg === "*" || seg.startsWith(":"))
			re += "/[^/]+" // 1 段
		else re += "/" + escapeReg(seg)
	})
	return new RegExp(`${re}$`)
}

// whiteList.push('/test/**/b/*/a')
const whitePageRegs = whiteList.map(globToRegExp)

const isWhitePage = (path) => {
	const router = getRouter()
	const route = router.currentRoute.value.path
	return whitePageRegs.some((re) => re.test(normalizePath(path || route.path)))
}

// console.log(isWhitePage('/test/404'))
// console.log(isWhitePage('/test/b/f/a'))
// console.log(isWhitePage('/test/404/5/b'))

export default isWhitePage
