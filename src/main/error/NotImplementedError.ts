export class NotImplementedError extends Error {
	public constructor(what?: string) {
		super(`Not implemented: ${what}`);
		Object.setPrototypeOf(this, NotImplementedError.prototype);
	}
}
