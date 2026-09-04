export const setupTitleGuard = (router) => {
  router.afterEach(async (to) => {
    // set page title
    document.title = to.meta.title ? `${to.meta.title} - Vue Admin` : `Vue Admin`
  })
}