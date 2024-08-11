export const styleInject = (name: string, css: string) => {
	if (typeof document === "undefined") return
	const style = document.createElement("style")

	document.head.appendChild(style)
	style.appendChild(document.createTextNode(css))
	style.setAttribute("id", `${window.env.NAME}-${name}`)

	console.log(`injected ${name}`, style)
}
