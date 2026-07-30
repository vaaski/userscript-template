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
		local: {
			type: "boolean",
			short: "l",
		},
	},
	allowPositionals: true,
})

const pathsToCopyFull = [
	"build/",
	"bun.lock",
	"cli/",
	"eslint.config.mjs",
	// "license.md", // todo: recommend adding a license
	"package.json",
	"readme.md",
	"styles/",
	"tsconfig.json",
	"userscript/",
]

const copy = async (paths: string[]) => {
	await Promise.all(paths.map((sourcePath) => {
		return cp(
			path.join(import.meta.dir, "..", sourcePath),
			path.join(process.cwd(), sourcePath),
			{ recursive: true, errorOnExist: !values.force, force: values.force },
		)
	}))
}

let runner = "u9"
const helpMessage = (full = false, ...custom: Parameters<typeof tableize>[0]) => {
	const helpItems = [
		[styleText("gray", "run dev server"), styleText("bold", `${runner} dev`)],
		[styleText("gray", "build for prod"), styleText("bold", `${runner} build`)],
		[styleText("gray", "re-run customizer"), styleText("bold", `${runner} customize`)],
	] as Parameters<typeof tableize>[0]

	if (full) {
		helpItems.unshift(
			[styleText("gray", "minimal setup"), styleText("bold", `${runner} init`)],
			[styleText("gray", "full local setup"), styleText("bold", `${runner} init --local`)],
		)
	}

	return tableize(custom.length > 0 ? custom : helpItems, 3).join("\n")
}

const command = positionals.at(0)
const isLocalSetup = await Bun.file(path.join(process.cwd(), "build/customize.ts")).exists()

/** resolves script path to local or cli setup */
const maybeCliPath = (name: string) => {
	return isLocalSetup ? name : path.join(import.meta.dir, "..", name)
}

// --------------------------------------------------------------------------------------

if (command === "help" || command === "h" || values.help) {
	if (isLocalSetup) runner = "bun run"
	note(helpMessage(true), "available commands")
	process.exit(0)
}

// --------------------------------------------------------------------------------------

if (command === "init" || command === "n") {
	if (values.local) {
		await copy(pathsToCopyFull)

		const spin = spinner()

		spin.start("installing dependencies")
		const installerProcess = Bun.spawn({
			cmd: ["bun", "install"],
			cwd: process.cwd(),
			stderr: "inherit",
		})

		await installerProcess.exited
		spin.stop("local setup initialized")

		const customizerProcess = Bun.spawn({
			cmd: ["bun", "run", "build/customize.ts"],
			cwd: process.cwd(),
			stdio: ["inherit", "inherit", "inherit"],
		})

		await customizerProcess.exited

		runner = "bun run"
		if (customizerProcess.exitCode === 0) note(helpMessage(), "next steps")
	} else {
		note(`minimal setup is WIP, try ${styleText("bold", `${runner} init --local`)} for now.`)
	}
} else if (command === "customize" || command === "c") {
	const customizerProcess = Bun.spawn({
		cmd: ["bun", "run", maybeCliPath("build/customize.ts")],
		cwd: process.cwd(),
		stdio: ["inherit", "inherit", "inherit"],
	})

	await customizerProcess.exited

	if (customizerProcess.exitCode === 0) note(helpMessage(), "next steps")
}
