// src/common/idb.js —— IndexedDB 极简封装
//
// 用法：给一张抽屉开个零参句柄，失败绝不 throw，回默认值（false / [] / 0）。
//   const logStore = openIDBStore({ dbName: "VA_error-log", storeName: "error-log", autoIncrement: true })
//   await logStore.put(entry | [entry, ...])   // 落一批
//   await logStore.getAll(qty = 200)           // 按主键倒序取最近 qty 条
//   await logStore.count()                     // 条数
//   await logStore.clear()                     // 清空
//   await logStore.close()                     // 关连接（可选）
//
// 纪律：
//   - 同 (dbName|version) 只开一条连接，操作完不关，页面卸载自动收尾
//   - 建 store 只在 onupgradeneeded 里（若改 schema，请整体升 version 并重建抽屉）
//   - 同库多 store：共用同一 version，且首次 open 前都调一遍 openIDBStore，一次升级全建出
//   - 别人升了版本：本页自动关旧连接，绝不阻塞对方
//   - 接正式日志系统：setIDBLogger(fn) 覆盖默认 console.error 打点

const dbs = new Map() // `${dbName}|${version}` → Promise<IDBDatabase>
const schemas = new Map() // `${dbName}|${version}` → Map<storeName, {keyPath?|autoIncrement}>

let report = console.error

/** 覆盖错误打点（默认 console.error）。不改变「绝不 throw」纪律。 */
export function setIDBLogger(logger) {
	report = typeof logger === "function" ? logger : report
}

/** 打开/复用连接；onupgradeneeded 里把该版本注册过的 store 一次建齐。 */
function openDB({ dbName, storeName, keyPath, autoIncrement, version }) {
	const vkey = `${dbName}|${version}`
	if (!schemas.has(vkey)) schemas.set(vkey, new Map())
	schemas.get(vkey).set(storeName, autoIncrement ? { autoIncrement: true } : { keyPath })
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
			db.onversionchange = () => db.close() // 被升版本 → 主动关，别堵别人
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

async function getAll(ctx, qty = 200) {
	try {
		const db = await openDB(ctx)
		const tx = db.transaction(ctx.storeName, "readonly")
		const store = tx.objectStore(ctx.storeName)
		const out = []
		const request = store.openCursor(null, "prev")
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

/** 给一张抽屉开句柄。dbName/storeName 绑定进闭包，之后调用一律零参。 */
export function openIDBStore({ dbName, storeName, keyPath = "time", version = 1, autoIncrement = false }) {
	const ctx = { dbName, storeName, keyPath, version, autoIncrement }
	return {
		put: (entries) => put(ctx, entries),
		getAll: (qty = 200) => getAll(ctx, qty),
		clear: () => clearStore(ctx),
		count: () => countStore(ctx),
		close: () => closeDB(ctx),
	}
}

export default openIDBStore