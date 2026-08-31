let watermarkNode = null
let observer = null
let pendingOptions = null
let currentOptions = null

const defaultOptions = {
	text: "请勿外传",
	fontSize: 16,
	color: "rgba(0, 0, 0, 0.12)",
	rotate: -15,
	gapX: 160,
	gapY: 80,
	zIndex: 100,
}

function drawCanvas(options) {
	const { text, fontSize, color, rotate, gapX, gapY } = options
	// 图片尺寸与 background-size 对齐（gapX × gapY），保证平铺不变形
	const width = gapX
	const height = gapY
	const dpr = window.devicePixelRatio || 1

	const canvas = document.createElement("canvas")
	canvas.width = width * dpr
	canvas.height = height * dpr
	const ctx = canvas.getContext("2d")
	ctx.scale(dpr, dpr)

	ctx.font = `${fontSize}px sans-serif`
	ctx.fillStyle = color
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.translate(width / 2, height / 2)
	ctx.rotate((rotate * Math.PI) / 180)
	ctx.fillText(text, 0, 0)

	return canvas.toDataURL("image/png")
}

function createWatermarkNode(options) {
	const dataUrl = drawCanvas(options)
	const el = document.createElement("div")
	el.setAttribute("data-watermark", "true")
	el.style.cssText = `
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: ${options.zIndex};
		background-image: url(${dataUrl});
		background-repeat: repeat;
		background-size: ${options.gapX}px ${options.gapY}px;
	`
	return el
}

function destroyObserver() {
	if (observer) {
		observer.disconnect()
		observer = null
	}
}

// 建立全局观察器，负责：1) main 出现后补挂水印 2) 水印被删/改后重建
function ensureObserver() {
	if (observer) return

	observer = new MutationObserver(() => {
		const container = document.querySelector("main")

		// 有待挂载需求但 main 尚不存在 -> 等待下一次
		if (pendingOptions && !container) return

		// main 已出现且有待挂载需求 -> 补挂
		if (pendingOptions && container) {
			const options = pendingOptions
			pendingOptions = null
			watermarkNode = createWatermarkNode(options)
			container.appendChild(watermarkNode)
			return
		}

		// 常规防篡改：水印被删或样式被改则重建
		if (watermarkNode && container && !container.contains(watermarkNode)) {
			watermarkNode.remove()
			watermarkNode = createWatermarkNode(currentOptions)
			container.appendChild(watermarkNode)
			return
		}
		if (watermarkNode && container && watermarkNode.style.display === "none") {
			watermarkNode.remove()
			watermarkNode = createWatermarkNode(currentOptions)
			container.appendChild(watermarkNode)
		}
	})

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["style", "class"],
	})
}

export function setWatermark(custom = {}) {
	const options = { ...defaultOptions, ...custom }
	const container = document.querySelector("main")

	// 已挂载且配置一致则跳过
	if (watermarkNode && currentOptions && JSON.stringify(currentOptions) === JSON.stringify(options)) {
		return
	}

	// 确有差异，先清理旧状态（会断开旧 observer，随后重建）
	clearWatermark()
	currentOptions = options

	if (container) {
		watermarkNode = createWatermarkNode(options)
		container.appendChild(watermarkNode)
	} else {
		// main 尚未挂载（如整页刷新时 afterEach 触发过早），待其出现后补挂
		pendingOptions = options
	}

	ensureObserver()
}

export function clearWatermark() {
	pendingOptions = null
	currentOptions = null
	if (watermarkNode) {
		watermarkNode.remove()
		watermarkNode = null
	}
	destroyObserver()
}
