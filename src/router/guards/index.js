import { setupAuthGuard } from "./auth"
import { setupTitleGuard } from "./title"
import { setupUserGuard } from "./user"
// import { setupErrorHandler } from './error'

export function setupGuards(router) {
	setupAuthGuard(router)
	setupTitleGuard(router)
	setupUserGuard(router)
	// setupErrorHandler(router)
}
