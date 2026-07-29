import { watch } from "node:fs"
import path from "node:path"
import { parseArgs, styleText } from "node:util"
import { makeMetadataBlock } from "~~/meta"
import { author, description, name, userscript, version } from "../package.json"

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		watch: {
			type: "boolean",
			short: "w",
		},
		minify: {
			type: "boolean",
			short: "m",
		},
	},
})

const build = async () => {
	return await Bun.build({
		entrypoints: ["./userscript/index.user.ts"],
		outdir: "./out",
		env: "inline",
		minify: values.minify,

		banner: [
			"// ==UserScript==",
			...makeMetadataBlock({
				name,
				description,
				version,
				author,
				...userscript,
			}),
			"// ==/UserScript==",
			"\n;(async () => {",
		].join("\n"),
		footer: "})();",
	})
}

const startWatching = (folder: string) => {
	watch(path.join(import.meta.dir, "..", folder), { recursive: true }, async (event, filename) => {
		process.stdout.write(`${styleText("gray", `[${event}]`)} ${folder}/${filename}`)
		await build()
		console.log(styleText("green", " ✓"))
	})
}

build()

if (values.watch) {
	console.log(styleText("gray", "watching..."))

	startWatching("./userscript")
	startWatching("./build")
	startWatching("./styles")
} else {
	console.log(styleText("gray", "done."))
}
