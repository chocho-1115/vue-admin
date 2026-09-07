import { setupAuthGuard } from "./auth"
import { setupPermissionGuard } from "./permission"
import { setupTitleGuard } from "./title"
import { setupUserGuard } from "./user"
// import { setupErrorHandler } from './error'

export function setupGuards(router) {
	setupAuthGuard(router)
	setupPermissionGuard(router)
	setupTitleGuard(router)
	setupUserGuard(router)
	// setupErrorHandler(router)
}
