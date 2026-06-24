const sidebarOpenedCacheKey = 'VA_mini-sidebar'
const tokenCacheKey = 'VA_token'
const themeCacheKey = 'VA_theme'

export function getTokenStorage() {
  return localStorage.getItem(tokenCacheKey)
}

export function saveTokenStorage(token) {
  return localStorage.setItem(tokenCacheKey, token)
}

export function removeTokenStorage() {
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

