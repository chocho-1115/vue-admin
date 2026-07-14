/*
 * @desc 生成随机字符串
 * @param {number} 字符串长度
 */
function getRandomStr(len) {
	len = len || 32
	const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678" // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	const maxPos = $chars.length
	let sttr = ""
	for (let i = 0; i < len; i++) {
		sttr += $chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return sttr
}

export default getRandomStr
