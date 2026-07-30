import { styleText } from "node:util"
import { autocompleteMultiselect, cancel, confirm, group, intro, isCancel, outro, spinner, text } from "@clack/prompts"

const packageJson = await Bun.file("package.json").json()

console.log()
intro(styleText("gray", "userscript-template setup wizard"))

const onCancel = () => {
	cancel("setup cancelled.")
	process.exit(0)
}

// --------------------------------------------------------------------------------------

const defaultName = "epic-userscript"
const defaultDescription = "makes the web more usable"
const defaultVersion = "1.0.0"
const defaultAuthor = "someone <someone@example.com>"

const info = await group({
	name: () => text({
		message: "What should the userscript be called?",
		placeholder: defaultName,
		initialValue: defaultName,
		validate: (name = defaultName) => {
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
		placeholder: defaultDescription,
		initialValue: defaultDescription,
		validate: (description = defaultDescription) => {
			if (!description || description.length === 0) {
				return "description is required"
			}
		},
	}),

	version: () => text({
		message: "What's the version?",
		placeholder: defaultVersion,
		initialValue: defaultVersion,
		validate: (version = defaultVersion) => {
			if (!version || version.length === 0) {
				return "version is required"
			}
		},
	}),

	author: () => text({
		message: "Who made it?",
		placeholder: defaultAuthor,
		initialValue: defaultAuthor,
		validate: (author = defaultAuthor) => {
			if (!author || author.length === 0) {
				return "author is required"
			}
		},
	}),
}, { onCancel })

let previousMatch = Array.isArray(packageJson.userscript.match) ? packageJson.userscript.match[0] : packageJson.userscript.match
if (typeof previousMatch !== "string") {
	previousMatch = ""
}

const match = await text({
	message: "Where should it run?",
	placeholder: previousMatch,
	initialValue: previousMatch,
	validate: (description = previousMatch) => {
		if (!description || description.length === 0) {
			return "match is required"
		}
	},
})

if (isCancel(match)) {
	onCancel()
	process.exit(0)
}

const matchURL = new URL(match)

const autoIcon = await confirm({
	message: [
		"Should the icon be automatically fetched? (Using Google favicon API)",
		`e.g. ${styleText("gray", "https://www.google.com/s2/favicons?sz=64&domain=")}${styleText("bold", matchURL.host)}`,
	].join("\n"),
})

if (isCancel(autoIcon)) {
	onCancel()
	process.exit(0)
}

const autoIconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${matchURL.host}`
const icon = autoIcon
	? autoIconUrl
	: await text({
			message: "What's the icon URL then?",
			placeholder: autoIconUrl,
			initialValue: autoIconUrl,
			validate: (icon = packageJson.userscript.icon) => {
				if (!icon || icon.length === 0) {
					return "icon is required"
				}
			},
		})

if (isCancel(icon)) {
	onCancel()
	process.exit(0)
}

const availablePermissions = ["GM.addStyle", "GM.addElement", "GM.cookie", "GM.registerMenuCommand", "GM.deleteValue", "GM.deleteValues", "GM.download", "GM.getResourceUrl", "GM.getValue", "GM.getValues", "GM.info", "GM.listValues", "GM.notification", "GM.openInTab", "GM.setClipboard", "GM.setValue", "GM.setValues", "GM.xmlHttpRequest"]
const grant = await autocompleteMultiselect({
	message: "Any special permissions?",
	placeholder: "Type to search...",
	initialValues: availablePermissions.filter(permission => packageJson.userscript.grant.includes(permission)),
	maxItems: 8,
	options: [
		...availablePermissions.map(permission => ({
			value: permission,
		})),
	],
})

if (isCancel(grant)) {
	onCancel()
	process.exit(0)
}

// --------------------------------------------------------------------------------------

const spin = spinner()

spin.start("updating package.json")

await Bun.file("package.json").write(JSON.stringify({
	...packageJson,
	...info,
	userscript: {
		...packageJson.userscript,
		icon,
		match: [match],
		grant,
	},
}, undefined, 2))
await Bun.spawn(["bun", "x", "eslint", "--fix", "package.json"]).exited

spin.stop("wrote package.json")

outro(`${styleText("gray", "userscript customized")} ${styleText("green", "✓")}`)
