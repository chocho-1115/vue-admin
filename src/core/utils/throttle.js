// 函数节流 多次触发时减少触发频次 此函数会执行第一次触发
function throttle(method, delay) {
  let timer = null
  let starttime = Date.now()
  return function () {
    let curTime = Date.now() // 当前时间
    let remaining = delay - (curTime - starttime) // 从上一次到现在，还剩下多少多余时间
    let context = this
    let args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      method.apply(context, args)
      starttime = Date.now()
    } else {
      timer = setTimeout(function () {
        method.apply(context, args)
      }, remaining)
    }
  }
}

export default throttle
