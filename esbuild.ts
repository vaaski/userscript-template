const [, , mode] = process.argv

import * as esbuild from "esbuild"

import { hostname } from "node:os"
import { author, description, name, userscript, version } from "./package.json"

const buildDate = new Date()
const HOSTNAME = hostname()

const esbuildConfig: esbuild.BuildOptions = {
	entryPoints: ["src/index.user.ts"],
	bundle: true,
	outfile: "dist/index.user.js",
	loader: { ".css": "text" },
	splitting: false,
	format: "iife",
	platform: "browser",
	define: {
		"window.env.BUILT_UNIX": `"${buildDate.getTime().toString()}"`,
		"window.env.HOSTNAME": `"${HOSTNAME}"`,
		"window.env.NAME": `"${name}"`,
	},

	banner: {
		js: [
			"// ==UserScript==",
			`// @name         ${name}`,
			`// @description  ${description}`,
			`// @version      ${version}`,
			`// @author       ${author}`,
			`// @icon         ${userscript.icon}`,
			...userscript.matches.map((v) => `// @match        ${v}`),
			"// ==/UserScript==",
		].join("\n"),
	},
}

if (mode === "dev") {
	const ctx = await esbuild.context(esbuildConfig)

	console.log("watching...")
	const server = await ctx.serve()
	console.log(`http://localhost:${server.port}`)

	await ctx.watch()
} else {
	await esbuild.build(esbuildConfig)
	console.log(`built ${esbuildConfig.outfile}`)
}
