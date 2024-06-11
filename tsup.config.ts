import { hostname } from "node:os"
import { defineConfig } from "tsup"
import { author, description, name, version } from "./package.json"

const MATCHES = ["https://www.google.com/*"]
const ICON = "https://www.google.com/s2/favicons?sz=64&domain=google.com"

const buildDate = new Date()
const HOSTNAME = hostname()

export default defineConfig({
	entry: ["src/index.user.ts"],
	splitting: false,
	clean: true,
	format: ["iife"],
	outExtension: () => ({ js: ".js" }),
	injectStyle: true,
	platform: "browser",
	minify: false,
	env: {
		BUILT_UNIX: buildDate.getTime().toString(),
		HOSTNAME,
	},
	banner: () => ({
		js: [
			"// ==UserScript==",
			`// @name         ${name}`,
			`// @description  ${description}`,
			`// @version      ${version}`,
			`// @author       ${author}`,
			`// @icon         ${ICON}`,
			...MATCHES.map((v) => `// @match        ${v}`),
			"// ==/UserScript==",
		].join("\n"),
	}),
})
