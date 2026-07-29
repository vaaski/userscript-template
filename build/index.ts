import { watch } from "node:fs"
import { readdir } from "node:fs/promises"
import path from "node:path"
import { parseArgs, styleText } from "node:util"
import { author, description, name, userscript, version } from "../package.json"
import { makeMetadataBlock } from "./util"

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
	const server = Bun.serve({
		routes: {
			"/": new Response(Bun.file(path.join(import.meta.dir, "../build/dev.html"))),
			"/__files": async () => Response.json(await readdir(path.join(import.meta.dir, "../out"))),
			"/favicon.ico": new Response(await fetch(userscript.icon).then(res => res.blob())),
			"/index.user.js": new Response(Bun.file(path.join(import.meta.dir, "../out/index.user.js"))),
		},
	})

	console.log(styleText("gray", "server running at"), styleText("green", server.url.toString()))

	startWatching("./userscript")
	startWatching("./build")
	startWatching("./styles")

	console.log(styleText("gray", "watching..."))
} else {
	console.log(styleText("gray", "output:"), styleText("green", path.join(import.meta.dir, "../out/index.user.js")))
}
