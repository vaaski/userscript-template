export const tableize = (obj: Array<[string, string | string[]]>, distance = 2) => {
	const entries = [] as [string, string][]

	for (const [key, value] of obj) {
		if (typeof value === "string") {
			entries.push([key, value])
		} else {
			for (const v of value) {
				entries.push([key, v])
			}
		}
	}

	const longestKey = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0)

	return entries.map(([key, value]) => `${key.padEnd(longestKey)}${" ".repeat(distance)}${value}`)
}

export const makeMetadataBlock = (config: Record<string, string | string[]>) => {
	return tableize(Object.entries(config)).map(line => `// @${line}`)
}
