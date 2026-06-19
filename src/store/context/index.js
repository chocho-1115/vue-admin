import {
  reactive,
} from 'vue'

import userInfo from './user'
import sidebar from './sidebar'
import tagsView from './tagsView'

export default reactive({
  device: 'desktop',
  token: '',
  userInfo,
  sidebar,
  tagsView,
})
