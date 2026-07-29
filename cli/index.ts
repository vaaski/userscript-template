#! /usr/bin/env bun

import { cp } from "node:fs/promises"
import path from "node:path"
import { parseArgs, styleText } from "node:util"
import { note, spinner } from "@clack/prompts"
import { tableize } from "../build/util"

const { values, positionals } = parseArgs({
	args: process.argv.slice(2),
	options: {
		init: {
			type: "boolean",
			short: "n",
		},
		force: {
			type: "boolean",
			short: "f",
		},
		help: {
			type: "boolean",
			short: "h",
		},
	},
	allowPositionals: true,
})

const pathsToCopy = [
	"build/",
	"bun.lock",
	"eslint.config.mjs",
	// "license.md", // todo: recommend adding a license
	"out/",
	"package.json",
	"readme.md",
	"styles/",
	"tsconfig.json",
	"userscript/",
]

let runner = "u9"
const helpMessage = (full = false, ...custom: Parameters<typeof tableize>[0]) => {
	const helpItems = [
		[styleText("gray", "run dev server"), styleText("bold", `${runner} dev`)],
		[styleText("gray", "build for prod"), styleText("bold", `${runner} build`)],
		[styleText("gray", "re-run customizer"), styleText("bold", `${runner} customize`)],
	] as Parameters<typeof tableize>[0]

	if (full) {
		helpItems.unshift(
			[styleText("gray", "local setup"), styleText("bold", `${runner} init`)],
		)
	}

	return tableize(custom.length > 0 ? custom : helpItems, 3).join("\n")
}

const command = positionals.at(0)

// --------------------------------------------------------------------------------------

if (command === "help" || command === "h" || values.help) {
	note(helpMessage(true), "available commands")
	process.exit(0)
}

// --------------------------------------------------------------------------------------

if (command === "init" || command === "n") {
	await Promise.all(pathsToCopy.map((sourcePath) => {
		return cp(
			path.join(import.meta.dir, "..", sourcePath),
			path.join(process.cwd(), sourcePath),
			{ recursive: true, errorOnExist: !values.force, force: values.force },
		)
	}))

	const spin = spinner()

	spin.start("installing dependencies")
	const proc = Bun.spawn({
		cmd: ["bun", "install"],
		cwd: process.cwd(),
		stderr: "inherit",
	})

	await proc.exited
	spin.stop("userscript-template initialized")

	runner = "bun run"
	note(helpMessage(), "next steps")

	process.exit(0)
}

// if ("userscript" in packageJson) {
// 	log.info("userscript is already set up")

// 	process.exit(0)
// }

// await confirm({
// 	message: [
// 		"test",
// 	].join("\n"),
// })

// await import("../build/customize")
