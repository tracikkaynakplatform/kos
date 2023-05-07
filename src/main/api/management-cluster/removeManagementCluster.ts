import { ManagementCluster } from "kos/service/ManagementCluster";
import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";

export async function removeManagementCluster(managementClusterName: string): Promise<any> {
	try {
		const cluster = new ManagementCluster(managementClusterName);
		cluster.remove();
	} catch (err) {
		if (!(err instanceof ClusterNotFoundError)) {
			throw err;
		}
	}
}
