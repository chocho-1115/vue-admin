import { ctx, dispatch, session } from "@/store"
import { isWhitePage, goLogin } from "@/router/helpers"

export const logout = () => {
	ctx.loggedIn = false
	session.token.removeStorage()
	session.permission.clear()
	dispatch.user.removeInfo()
	if (!isWhitePage()) {
		goLogin()
	}
}
