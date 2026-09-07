import { session } from "@/store"

/**
 * 权限点校验（点控：不因角色短路，均以 /permission 返回的数据为准）
 * @param {string|string[]} code 权限点，如 'example:create'；数组按 mode 聚合
 * @param {{ mode?: 'any'|'all' }} [options] 数组聚合方式，默认 'any'
 * @returns {Boolean}
 */
export function hasPerm(code, { mode = "any" } = {}) {
	if (!code) return true
	const list = Array.isArray(code) ? code : [code]
	const permissions = session.permission.get().permissions
	return mode === "all" ? list.every((p) => permissions.includes(p)) : list.some((p) => permissions.includes(p))
}

/**
 * 角色校验（命中任一角色即通过）
 * @param {string|string[]} role 角色，如 'admin'；数组表示任一命中
 * @returns {Boolean}
 */
export function hasRole(role) {
	if (!role) return true
	const list = Array.isArray(role) ? role : [role]
	const roles = session.permission.get().roles
	return list.some((r) => roles.includes(r))
}

/**
 * 是否为管理员角色（基于 /permission 返回的 roles，与 hasRole 同一数据源）
 * @returns {Boolean}
 */
export function isAdmin() {
	return hasRole("admin")
}