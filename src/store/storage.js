const tokenCacheKey = 'VA_token'
const themeCacheKey = 'VA_theme'
const miniSidebarCacheKey = 'VA_mini-sidebar'

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

export function getMiniSidebar() {
  const status = localStorage.getItem(miniSidebarCacheKey)
  return status ? !!+status : false
}

export function setMiniSidebar(status) {
  localStorage.setItem(miniSidebarCacheKey, status ? 1 : 0)
}


