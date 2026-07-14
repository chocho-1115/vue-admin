// import { defineAsyncComponent } from "vue";

const context = import.meta.glob("./svg/*", {
	eager: true,
	query: "?component",
})

const iconNameList = []
// const iconModules = {}
// const iconComponents = {}

for (const path in context) {
	let [fileName, fileType] = path.match(/([^/]+)$/)[0].split(".")
	if (fileType !== "svg") continue
	iconNameList.push(fileName)
	// iconModules[fileName] = context[path]
	// iconComponents[fileName] = defineAsyncComponent(context[path]);
}

export {
	iconNameList,
	// iconModules,
	// iconComponents
}

// Object.keys(context).map((path) => {
//   context[path]().then((mod) => {
//     console.log(path, mod)
//   })
// })
