import staticContext from "./static"
import context from "./context"
import session from "./session"
import dispatchList from "./dispatch"

export const sctx = staticContext
export const ctx = context
export { session }
export const dispatch = dispatchList
