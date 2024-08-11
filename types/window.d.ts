export interface Env {
	BUILT_UNIX: string
	HOSTNAME: string
	NAME: string
}

export declare global {
	interface Window {
		env: Env
	}
}
