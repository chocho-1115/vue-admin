let watermarkNode = null
let observer = null
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

function observeTamper(options) {
	if (!observer) {
		observer = new MutationObserver(() => {
			const container = document.querySelector("main")
			if (!container) return
			// 水印节点被删除或样式被改动，则重建
			if (!container.contains(watermarkNode) || watermarkNode.style.display === "none") {
				watermarkNode.remove()
				watermarkNode = createWatermarkNode(options)
				container.appendChild(watermarkNode)
			}
		})
	}
	observer.disconnect()
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
	if (!container) return

	// 已挂载且配置一致则跳过
	if (watermarkNode && currentOptions && JSON.stringify(currentOptions) === JSON.stringify(options)) {
		return
	}

	clearWatermark()

	watermarkNode = createWatermarkNode(options)
	container.appendChild(watermarkNode)
	currentOptions = options

	observeTamper(options)
}

export function clearWatermark() {
	if (observer) {
		observer.disconnect()
		observer = null
	}
	if (watermarkNode) {
		watermarkNode.remove()
		watermarkNode = null
	}
	currentOptions = null
}
