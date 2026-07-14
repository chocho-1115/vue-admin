/*
 * @desc 时间格式化
 * @param {string} format 例如："yyyy/MM/dd"
 * @param {number} [timestamp] 时间戳，精确到毫秒
 * @returns {string}
 */
function formatTime(format, timestamp) {
	const d = timestamp ? new Date(timestamp) : new Date()
	const o = {
		'M+': d.getMonth() + 1, // month
		'd+': d.getDate(), // day
		'h+': d.getHours(), // hour
		'm+': d.getMinutes(), // minute
		's+': d.getSeconds(), // second
		'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
		S: d.getMilliseconds(), // millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, `${d.getFullYear()}`.substring(4 - RegExp.$1.length))
	for (const k in o)
		if (new RegExp(`(${k})`).test(format))
			format = format.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substring(`${o[k]}`.length),
			)
	return format
}

export default formatTime
