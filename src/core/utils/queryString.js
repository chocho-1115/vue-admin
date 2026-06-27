// 获取地址参数
function queryString(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  let r = window.location.search.substring(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

export default queryString
