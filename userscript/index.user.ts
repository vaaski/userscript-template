import { loadStyle } from "~~/build/styles" with { type: "macro" }
import { injectStyle } from "~~/userscript/util/inject-style"

let removeInjection: (() => void) | undefined = injectStyle(loadStyle("styles/main.css"))

GM.registerMenuCommand(
	"Toggle CSS injection",
	() => {
		if (removeInjection) {
			removeInjection()
			removeInjection = undefined
		} else {
			removeInjection = injectStyle(loadStyle("styles/main.css"))
		}
	},
	{
		icon: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
		autoClose: false,
		title: "Example menu command",
	},
)
