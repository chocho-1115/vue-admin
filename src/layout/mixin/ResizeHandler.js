import {
  ctx,
  dispatch
} from '@/store'

const {
  body
} = document
const WIDTH = 992 // refer to Bootstrap's responsive design




export const isMobile = () => {
  const rect = body.getBoundingClientRect()
  return rect.width - 1 < WIDTH
}

export const resizeHandler = () => {

  console.log()
  if (!document.hidden) {
    const isM = isMobile()
    ctx.device = isM ? 'mobile' : 'desktop'
    if (isM) {
      dispatch.sidebar.close({
        withoutAnimation: true
      })
    }
  }
}
