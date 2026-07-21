export const joinPath = (...args) => {
	return args.filter(Boolean).join("/").replace(/\/+/g, "/").replace(/\/$/, "") || "/"
}
