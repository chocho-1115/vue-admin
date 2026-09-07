import { createRouter } from "vue-router"

import { setRouter } from "./runtime"
import { setupGuards } from "./guards"
import { config } from "./config"

const router = createRouter(config)
setRouter(router)   // 在 setupGuards 之前或之后都行
setupGuards(router)

export default router

