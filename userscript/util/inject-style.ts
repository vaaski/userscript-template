export const injectStyle = (css: string) => {
	if (!css || typeof document === "undefined") throw new Error("document is not defined")

	const head = document.head || document.getElementsByTagName("head")[0]
	const style = document.createElement("style")
	head.appendChild(style)

	style.appendChild(document.createTextNode(css))

	return () => style.remove()
}
