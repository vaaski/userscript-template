import { loadStyle } from "~~/build/styles" with { type: "macro" }
import { injectStyle } from "~~/userscript/util/inject-style"

injectStyle(loadStyle("styles/main.css"))

GM.registerMenuCommand("Text", () => console.log("text"))
