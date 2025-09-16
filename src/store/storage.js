const sidebarOpenedCacheKey = 'VA_sidebar_opened'
const tokenCacheKey = 'VA_token'
const themeCacheKey = 'VA_theme'

export function getToken() {
  return localStorage.getItem(tokenCacheKey)
}

export function setToken(token) {
  return localStorage.setItem(tokenCacheKey, token)
}

export function removeToken() {
  return localStorage.removeItem(tokenCacheKey)
}

export function getSidebarStatus() {
  const status = localStorage.getItem(sidebarOpenedCacheKey)
  return status ? !!+status : true
}

export function setSidebarStatus(status) {
  localStorage.setItem(sidebarOpenedCacheKey, status ? 1 : 0)
}

export function setTheme(tName) {
  localStorage.setItem(themeCacheKey, tName)
}

export function getTheme() {
  return localStorage.getItem(themeCacheKey) || ''
}

