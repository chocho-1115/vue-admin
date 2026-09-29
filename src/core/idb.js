// 用法：给一张抽屉开个零参句柄，失败绝不 throw，回默认值（false / [] / 0）。
//   const logStore = openIDBStore({ dbName: "my-db", storeName: "logs", keyPath: "id" })
//   await logStore.put(entry | [entry, ...])   // 落一批
//   await logStore.getAll(qty = 200, "prev" | "next") // 取一批，默认倒序（最新在前），"next" 为最旧在前
//   await logStore.del(key | [key, ...])        // 删一批（需 keyPath 自持主键）
//   await logStore.count()                     // 条数
//   await logStore.clear()                     // 清空
//   await logStore.close()                     // 关连接（可选）
//
// 纪律：
//   - 同 (dbName|version) 只开一条连接，操作完不关，页面卸载自动收尾
//   - 建 store 只在 onupgradeneeded 里（若改 schema，请整体升 version 并重建抽屉）
//   - 同库多 store：共用同一 version，首次 open 前把各 openIDBStore 构造完毕（构造即在蓝图登记），
//     一次升级全建出；open 之后才构造的店不会自动建，请手动升 version
//   - 别人升了版本：本页自动断连并清连接缓存，绝不阻塞对方；旧抽屉要继续用需按新版重建
//   - 接正式日志系统：setIDBLogger(fn) 覆盖默认 console.error 打点
//   - 要按记录删/改，主键必须自己生成（keyPath: "id"）；autoIncrement 拿不到 key，只能追加


const dbs = new Map() // `${dbName}|${version}` → Promise<IDBDatabase>
const schemas = new Map() // `${dbName}|${version}` → Map<storeName, {keyPath?|autoIncrement}>

let report = console.error // 错误打点出口，默认 console.error，setIDBLogger 可换

/** 打开/复用连接；upgrade 里按蓝图（schemas）把该版本注册过的 store 一次建齐。 */
function openDB({ dbName, version }) {
	const vkey = `${dbName}|${version}`
	if (dbs.has(vkey)) return dbs.get(vkey)

	const opened = new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version)
		request.onupgradeneeded = () => {
			// 解构出内层Map的key和value
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

function resultOf(request) {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}

function txDone(tx) {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve()
		tx.onabort = () => reject(tx.error || new Error("transaction aborted"))
		tx.onerror = () => reject(tx.error || new Error("transaction error"))
	})
}

/** 落一批。任一写入失败 → 回滚整批（all-or-nothing），回 false。 */
async function put(ctx, entries) {
	let tx = null
	try {
		const db = await openDB(ctx)
		tx = db.transaction(ctx.storeName, "readwrite")
		const store = tx.objectStore(ctx.storeName)
		for (const entry of (Array.isArray(entries) ? entries : [entries])) {
			store.put(entry) // 非法 key 会在调用栈里同步抛
		}
		await txDone(tx)
		return true
	} catch (err) {
		try {
			tx?.abort()
		} catch {
			// 事务已终结，忽略
		}
		report(err)
		return false
	}
}

/** 取一批：direction 默认 "prev" 倒序（最新在前），传 "next" 正序（最旧在前，便于裁剪）。 */
async function getAll(ctx, qty = 200, direction = "prev") {
	try {
		const db = await openDB(ctx)
		const tx = db.transaction(ctx.storeName, "readonly")
		const store = tx.objectStore(ctx.storeName)
		const out = []
		const request = store.openCursor(null, direction)
		await new Promise((resolve, reject) => {
			request.onsuccess = () => {
				const cursor = request.result
				if (!cursor || out.length >= qty) {
					resolve()
					return
				}
				out.push(cursor.value)
				cursor.continue()
			}
			request.onerror = () => reject(request.error)
		})
		await txDone(tx)
		return out
	} catch (err) {
		report(err)
		return []
	}
}

/** 删一批：keys 支持数组或单个 key，回 false。注意 delete 对不存在的 key 是幂等的（不报错），不会回滚整批。 */
async function del(ctx, keys) {
	let tx = null
	try {
		const db = await openDB(ctx)
		tx = db.transaction(ctx.storeName, "readwrite")
		const store = tx.objectStore(ctx.storeName)
		for (const key of Array.isArray(keys) ? keys : [keys]) {
			store.delete(key) // 非法 key 会在调用栈里同步抛
		}
		await txDone(tx)
		return true
	} catch (err) {
		try {
			tx?.abort()
		} catch {
			// 事务已终结，忽略
		}
		report(err)
		return false
	}
}

async function clearStore(ctx) {
	try {
		const db = await openDB(ctx)
		const tx = db.transaction(ctx.storeName, "readwrite")
		tx.objectStore(ctx.storeName).clear()
		await txDone(tx)
		return true
	} catch (err) {
		report(err)
		return false
	}
}

async function countStore(ctx) {
	try {
		const db = await openDB(ctx)
		const tx = db.transaction(ctx.storeName, "readonly")
		const n = await resultOf(tx.objectStore(ctx.storeName).count())
		await txDone(tx)
		return n
	} catch (err) {
		report(err)
		return 0
	}
}

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

/** 给一张抽屉开句柄。构造即登记建仓蓝图，dbName/storeName 绑定进闭包，之后调用一律零参。 */
export function openIDBStore({ dbName, storeName, keyPath = "time", version = 1, autoIncrement = false }) {
	// 构造时就把这家店写进蓝图：同库多店在首次 open 前各自构造完毕，升级即可一次建齐
	const vkey = `${dbName}|${version}`
	if (!schemas.has(vkey)) schemas.set(vkey, new Map())
	schemas.get(vkey).set(storeName, autoIncrement ? { autoIncrement: true } : { keyPath })

	const ctx = { dbName, storeName, keyPath, version, autoIncrement }
	return {
		put: (entries) => put(ctx, entries),
		getAll: (qty = 200, direction = "prev") => getAll(ctx, qty, direction),
		del: (keys) => del(ctx, keys),
		clear: () => clearStore(ctx),
		count: () => countStore(ctx),
		close: () => closeDB(ctx),
	}
}

/** 覆盖错误打点（默认 console.error）。改的是模块级全局单例，多个调用方会互相覆盖。 */
export function setIDBLogger(logger) {
	report = typeof logger === "function" ? logger : report
}

export default openIDBStore