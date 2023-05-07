export class KubeconfigNotFoundError extends Error {
	public constructor(path: string) {
		super(`Kubeconfig file couldn't find: ${path}`);
		Object.setPrototypeOf(this, KubeconfigNotFoundError.prototype);
	}
}
