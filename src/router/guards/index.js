import { setupAuthGuard } from "./auth"
import { setupPermissionGuard } from "./permission"
import { setupTitleGuard } from "./title"
import { setupUserGuard } from "./user"

// Guard order matters. beforeEach guards run in registration order via a serialized
// promise chain (each is awaited before the next), and their return value decides
// navigation (undefined/true -> continue, location -> redirect, false -> cancel).
// So the token must be ready before permission runs:
//
//   auth  ->  permission
//
// afterEach guards also run in registration order but are fired with a plain forEach:
// never awaited, return value ignored, no effect on navigation. Guards that use ONLY
// afterEach (title, user) are therefore placed last - pure side effects, no gating.
export function setupGuards(router) {
	setupAuthGuard(router) // beforeEach + afterEach (NProgress start/done)
	setupPermissionGuard(router) // beforeEach (role check -> 403)

	// only afterEach
	setupTitleGuard(router) // only afterEach (page title)
	setupUserGuard(router) // only afterEach (user info)
}