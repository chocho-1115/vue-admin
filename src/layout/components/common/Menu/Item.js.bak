import {
  h
} from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const RenderTemplate = (props, context) => {
  console.log(props, context)

  const {
    icon,
    title
  } = props
  const vnodes = []
  if (icon) {
    if (typeof icon === 'string') {
      vnodes.push(
        h(SvgIcon, {
          icon: icon,
        })
      )
    } else {
      vnodes.push(
        h('i', {
          class: 'el-icon el-menu-icon',
        }, [
          h(icon)
        ])
      )
    }
  }
  if (title) {
    // vnodes.push(h('div', {}, title))
    vnodes.push(h('div', null, {
      title: () => h('div', 'title', title),
      // default: () => title + 3,
    }))
  }
  return vnodes
}

RenderTemplate.props = ['icon', 'title']

export default RenderTemplate
