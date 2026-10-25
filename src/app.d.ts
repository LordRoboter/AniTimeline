// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			userState: UserState | null;
		}

		interface PageData {
			userState: UserState | null;
		}
	}
}

export {};