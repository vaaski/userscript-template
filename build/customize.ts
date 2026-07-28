import { cancel, group, intro, outro, spinner, text } from "@clack/prompts"

const packageJson = await Bun.file("package.json").json()

intro("userscript-template setup wizard")

const onCancel = () => {
	cancel("setup cancelled.")
	process.exit(0)
}

// --------------------------------------------------------------------------------------

const info = await group({
	name: () => text({
		message: "What should the userscript be called?",
		placeholder: packageJson.name,
		initialValue: packageJson.name,
		validate: (name = packageJson.name) => {
			if (!name || name.length === 0) {
				return "name is required"
			}

			if (name.length > 214) {
				return "name is too long"
			}

			if (!/^[a-z0-9-][a-z0-9._-]*$/.test(name)) {
				return "name only allows lowercase letters, numbers, hyphens, dots, and underscores"
			}
		},
	}),

	description: () => text({
		message: "Describe it.",
		placeholder: packageJson.description,
		initialValue: packageJson.description,
		validate: (description = packageJson.description) => {
			if (!description || description.length === 0) {
				return "description is required"
			}
		},
	}),

	version: () => text({
		message: "What's the version?",
		placeholder: packageJson.version,
		initialValue: packageJson.version,
		validate: (version = packageJson.version) => {
			if (!version || version.length === 0) {
				return "version is required"
			}
		},
	}),

	author: () => text({
		message: "Who made it?",
		placeholder: packageJson.author,
		initialValue: packageJson.author,
		validate: (author = packageJson.author) => {
			if (!author || author.length === 0) {
				return "author is required"
			}
		},
	}),
}, { onCancel })

// --------------------------------------------------------------------------------------

const spin = spinner()

spin.start("updating package.json")

await Bun.file("package.json").write(JSON.stringify({
	...packageJson,
	...info,
	userscript: {
		...packageJson.userscript,
	},
}, undefined, 2))
await Bun.spawn(["bun", "x", "eslint", "--fix", "package.json"]).exited

spin.stop("wrote package.json")

outro("userscript set up")
