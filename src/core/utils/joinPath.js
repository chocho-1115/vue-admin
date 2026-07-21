const joinPath = (...args) => {
	return args.filter(Boolean).join("/").replace(/\/+/g, "/").replace(/\/$/, "") || "/"
}
export default joinPath
