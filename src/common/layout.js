const { body } = document
const WIDTH = 768 // refer to Bootstrap's responsive design

export const getDevice = () => {
	const rect = body.getBoundingClientRect()
	return rect.width - 1 < WIDTH ? "mobile" : "desktop"
}
