/**
 * EventBus - 事件总线
 * 用于组件/模块间的发布订阅通信，解耦HTTP层与业务逻辑
 */
export const EventBus = {
	events: {},

	/**
	 * 订阅事件
	 * @param {string} event - 事件名称
	 * @param {function} callback - 回调函数
	 * @returns {function} 取消订阅的函数
	 */
	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = []
		}
		this.events[event].push(callback)
		return () => this.off(event, callback)
	},

	/**
	 * 取消订阅
	 * @param {string} event - 事件名称
	 * @param {function} callback - 回调函数
	 */
	off(event, callback) {
		if (!this.events[event]) return
		this.events[event] = this.events[event].filter((cb) => cb !== callback)
	},

	/**
	 * 发布事件
	 * @param {string} event - 事件名称
	 * @param {any} data - 传递的数据
	 */
	emit(event, data) {
		if (!this.events[event]) return
		this.events[event].forEach((cb) => cb(data))
	},

	/**
	 * 订阅事件（只触发一次）
	 * @param {string} event - 事件名称
	 * @param {function} callback - 回调函数
	 */
	once(event, callback) {
		const wrapper = (data) => {
			callback(data)
			this.off(event, wrapper)
		}
		this.on(event, wrapper)
	},
}

export default EventBus
