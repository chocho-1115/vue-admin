const TOKEN_CACHE_KEY = "VA_token"
const THEME_NAME_CACHE_KEY = "VA_theme-name"
const MINI_SIDEBAR_CACHE_KEY = "VA_mini-sidebar"
const TAGS_VIEW_CACHE_KEY = "VA_tags-view"

export function getToken() {
	return localStorage.getItem(TOKEN_CACHE_KEY)
}

export function saveToken(token) {
	return localStorage.setItem(TOKEN_CACHE_KEY, token)
}

export function removeToken() {
	return localStorage.removeItem(TOKEN_CACHE_KEY)
}

export function getThemeName() {
	return localStorage.getItem(THEME_NAME_CACHE_KEY) || ""
}

export function setThemeName(tName) {
	localStorage.setItem(THEME_NAME_CACHE_KEY, tName)
}

export function getMiniSidebar() {
	const status = localStorage.getItem(MINI_SIDEBAR_CACHE_KEY)
	return status ? !!+status : false
}

export function setMiniSidebar(status) {
	localStorage.setItem(MINI_SIDEBAR_CACHE_KEY, status ? 1 : 0)
}

export function getTagsView() {
	try {
		return JSON.parse(sessionStorage.getItem(TAGS_VIEW_CACHE_KEY) || "[]")
	} catch {
		return []
	}
}

export function setTagsView(tags) {
	sessionStorage.setItem(TAGS_VIEW_CACHE_KEY, JSON.stringify(tags))
}
