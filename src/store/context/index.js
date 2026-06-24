import {
  reactive,
} from 'vue'

import { getDevice } from '@/common/layout'
import login from './login'
import userInfo from './user'
import sidebar from './sidebar'
import tagsView from './tagsView'

export default reactive({
  device: getDevice(),
  login,
  userInfo,
  sidebar,
  tagsView,
})
