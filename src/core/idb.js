// IndexedDB 薄封装。给一张 objectStore（下面叫「抽屉」）开句柄：构造时定好库和表，之后
// put / getAll / del / count / clear / close 一律零参调用；失败绝不 throw，只回安全默认值。
//   const logStore = openIDBStore({ dbName: "my-db", storeName: "logs", keyPath: "id" })
// 三个坑：
//   - 同库多抽屉共用一个 version，必须在首次 open 前各自构造完（构造即登记蓝图），一次升级全建出来；
//     open 之后才构造的不会自动建，得手动升 version
//   - 别人升版本时本页自动断连重开，不阻塞对方
//   - 要按记录删/改，主键必须自持（keyPath: "id"）；autoIncrement 拿不到 key，只能追加

const dbs = new Map() // `${dbName}|${version}` → Promise<IDBDatabase>
const schemas = new Map() // `${dbName}|${version}` → Map<storeName, {keyPath?|autoIncrement}>

let report = console.error // 错误打点出口，默认 console.error，setIDBLogger 可换

/** 打开/复用连接；upgrade 里按蓝图（schemas）把该版本注册过的抽屉一次建齐。 */
function openDB({ dbName, version }) {
	const vkey = `${dbName}|${version}`
	if (dbs.has(vkey)) return dbs.get(vkey)

	const opened = new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version)
		request.onupgradeneeded = () => {
			for (const [name, options] of schemas.get(vkey)) {
				if (!request.result.objectStoreNames.contains(name)) {
					request.result.createObjectStore(name, options)
				}
			}
		}
		request.onsuccess = () => {
			const db = request.result
			db.onversionchange = () => {
				dbs.delete(vkey) // 连接已作废，下一口操作自动重开
				try {
					db.close() // 被升版本 → 主动关，别堵别人
				} catch {
					// 已关，忽略
				}
			}
			resolve(db)
		}
		request.onerror = () => reject(request.error)
	})
	dbs.set(vkey, opened)
	opened.catch(() => dbs.delete(vkey))
	return opened
}

/** 等事务落地：提交成功才 resolve，abort / error 都 reject。 */
function txDone(tx) {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve()
		tx.onabort = () => reject(tx.error || new Error("transaction aborted"))
		tx.onerror = () => reject(tx.error || new Error("transaction error"))
	})
}

/** 把 IDBRequest 变成 Promise。 */
function resultOf(request) {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}

/** 游标取一批：取满 qty 或到头就停。 */
function readCursor(store, qty, direction) {
	return new Promise((resolve, reject) => {
		const out = []
		const request = store.openCursor(null, direction)
		request.onsuccess = () => {
			const cursor = request.result
			if (!cursor || out.length >= qty) {
				resolve(out)
				return
			}
			out.push(cursor.value)
			cursor.continue()
		}
		request.onerror = () => reject(request.error)
	})
}

/** 事务统一壳：开连接 → 开事务 → work 干活 → 等落地。work 返回值即成功结果，出错则回滚 + 打点 + 回 fallback。 */
async function runOp(ctx, mode, fallback, work) {
	let tx = null
	try {
		const db = await openDB(ctx)
		tx = db.transaction(ctx.storeName, mode)
		const out = await work(tx.objectStore(ctx.storeName))
		await txDone(tx)
		return out
	} catch (err) {
		try {
			tx?.abort()
		} catch {
			// 事务已终结，忽略
		}
		report(err)
		return fallback
	}
}

/** 写一批。任一写入失败 → 回滚整批（all-or-nothing），回 false。 */
function put(ctx, entries) {
	return runOp(ctx, "readwrite", false, (store) => {
		for (const entry of (Array.isArray(entries) ? entries : [entries])) {
			store.put(entry) // 非法 key 会在调用栈里同步抛
		}
		return true
	})
}

/** 取一批：默认倒序（最新在前），传 "next" 为最旧在前。 */
function getAll(ctx, qty, direction) {
	return runOp(ctx, "readonly", [], (store) => readCursor(store, qty, direction))
}

/** 删一批：keys 支持数组或单个 key。delete 对不存在的 key 幂等，不会回滚整批。 */
function del(ctx, keys) {
	return runOp(ctx, "readwrite", false, (store) => {
		for (const key of Array.isArray(keys) ? keys : [keys]) {
			store.delete(key) // 非法 key 会在调用栈里同步抛
		}
		return true
	})
}

function clearStore(ctx) {
	return runOp(ctx, "readwrite", false, (store) => {
		store.clear()
		return true
	})
}

const countStore = (ctx) => runOp(ctx, "readonly", 0, (store) => resultOf(store.count()))

async function closeDB(ctx) {
	const vkey = `${ctx.dbName}|${ctx.version}`
	const opened = dbs.get(vkey)
	dbs.delete(vkey)
	if (opened) {
		try {
			;(await opened).close()
		} catch {
			// 连接已坏，忽略
		}
	}
}

// ---------------- 对外接口 ----------------

/** 给一张抽屉开句柄。构造即登记蓝图，dbName/storeName 绑进闭包，之后零参调用。 */
export function openIDBStore({ dbName, storeName, keyPath = "time", version = 1, autoIncrement = false }) {
	const vkey = `${dbName}|${version}`
	if (!schemas.has(vkey)) schemas.set(vkey, new Map())
	schemas.get(vkey).set(storeName, autoIncrement ? { autoIncrement: true } : { keyPath })

	const ctx = { dbName, storeName, version }
	return {
		put: (entries) => put(ctx, entries),
		getAll: (qty = 200, direction = "prev") => getAll(ctx, qty, direction),
		del: (keys) => del(ctx, keys),
		clear: () => clearStore(ctx),
		count: () => countStore(ctx),
		close: () => closeDB(ctx),
	}
}

/** 覆盖错误打点（默认 console.error）。模块级全局单例，多个调用方会互相覆盖。 */
export function setIDBLogger(logger) {
	report = typeof logger === "function" ? logger : report
}
