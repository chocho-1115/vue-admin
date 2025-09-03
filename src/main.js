import 'normalize.css/normalize.css' // CSS resets
import '@/styles/main.scss' // global css

// import 'element-plus/theme-chalk/dark/css-vars.css' // dark theme
// dark theme 动态的dark模式样式文件 // theme/index.scss 也将起效 
// 参见 https://juejin.cn/post/7442573821444390949
import 'element-plus/theme-chalk/src/dark/css-vars.scss' 

import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import SvgIcon from './components/SvgIcon.vue'
import {
  ctx
} from './store'
import './permission'

async function enableMocking() {
  // if (import.meta.env.MODE !== 'development') {
  //   return
  // }

  const {
    worker
  } = await import('../mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    // quiet: true, // Disables all the logging from the library (e.g. the activation message, the intercepted requests’ messages).
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    // Decide how to react to unhandled requests (i.e. those that do not have a matching request handler).
    // filter warnings
    onUnhandledRequest(request, print) {
      const url = new URL(request.url)
      if (url.pathname.includes('/dev-api')) {
        print.warning()
      }
      return
    },
  })
}

enableMocking().then(async () => {
  // await import('@/permission')

  const app = createApp(App)
  app.use(router) // It must be after the enablemock function

  app.provide('context', ctx)
  app.component('svg-icon', SvgIcon)

  app.mount('#app')
})
