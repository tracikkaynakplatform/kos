export class ClusterNotFoundError extends Error {
	public constructor(clusterName: string) {
		super(`Cluster not fonud: ${clusterName}`);
		Object.setPrototypeOf(this, ClusterNotFoundError.prototype);
	}
}
