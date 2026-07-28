export const loadStyle = (filePath: string) => {
	const proc = Bun.spawnSync(["bun", "build", filePath, "--minify"], { stdout: "pipe", stderr: "inherit" })
	return proc.stdout.toString().trim()
}
