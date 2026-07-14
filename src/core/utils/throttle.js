// 函数节流 多次触发时减少触发频次 此函数会执行第一次触发
function throttle(method, delay) {
	let timer = null
	let starttime = Date.now()
	return function (...args) {
		const curTime = Date.now() // 当前时间
		const remaining = delay - (curTime - starttime) // 从上一次到现在，还剩下多少多余时间
		clearTimeout(timer)
		if (remaining <= 0) {
			method.apply(this, args)
			starttime = Date.now()
		} else {
			timer = setTimeout(() => {
				method.apply(this, args)
			}, remaining)
		}
	}
}

export default throttle
