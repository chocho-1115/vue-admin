/*
 * @desc 日期格式化
 * @param {string} format 例如："yyyy/MM/dd"
 * @param {number} [timestamp] 时间戳，精确到毫秒
 * @returns {string}
 */
export function formatDate(format, timestamp) {
  let d = timestamp ? new Date(timestamp) : new Date()
  let o = {
    'M+': d.getMonth() + 1, // month   
    'd+': d.getDate(), // day   
    'h+': d.getHours(), // hour   
    'm+': d.getMinutes(), // minute   
    's+': d.getSeconds(), // second   
    'q+': Math.floor((d.getMonth() + 3) / 3), // quarter   
    'S': d.getMilliseconds() // millisecond   
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (d.getFullYear() + '').substring(4 - RegExp.$1.length))
  for (let k in o)
    if (new RegExp('(' + k + ')').test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ('00' + o[k]).substring(('' + o[k]).length))
  return format
}
