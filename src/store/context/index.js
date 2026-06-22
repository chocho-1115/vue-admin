import {
  reactive,
} from 'vue'

import login from './login'
import userInfo from './user'
import sidebar from './sidebar'
import tagsView from './tagsView'

export default reactive({
  device: 'desktop',
  login,
  userInfo,
  sidebar,
  tagsView,
})
