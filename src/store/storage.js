const tokenCacheKey = 'VA_token'
const themeCacheKey = 'VA_theme'
const sidebarOpenedCacheKey = 'VA_mini-sidebar'

export function getToken() {
  return localStorage.getItem(tokenCacheKey)
}

export function saveToken(token) {
  return localStorage.setItem(tokenCacheKey, token)
}

export function removeToken() {
  return localStorage.removeItem(tokenCacheKey)
}

export function setTheme(tName) {
  localStorage.setItem(themeCacheKey, tName)
}

export function getTheme() {
  return localStorage.getItem(themeCacheKey) || ''
}

export function getSidebarStatus() {
  const status = localStorage.getItem(sidebarOpenedCacheKey)
  return status ? !!+status : true
}

export function setSidebarStatus(status) {
  localStorage.setItem(sidebarOpenedCacheKey, status ? 1 : 0)
}


