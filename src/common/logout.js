import { dispatch, session } from "@/store"
import { isWhitePage, goLogin } from "@/router/helpers"

export const logout = () => {
	session.token.clear()
	session.token.removeStorage()
	session.permission.clear()
	dispatch.user.removeInfo()
	if (!isWhitePage()) {
		goLogin()
	}
}
