import { ManagementCluster } from "kos/service/ManagementCluster";

export async function getManagementCluster(managementClusterName?: string): Promise<any> {
	if (!managementClusterName) {
		const clusters = await ManagementCluster.getManagementClusters();
		return clusters.map((cluster) => cluster.toPlainObject());
	}
	const cluster = new ManagementCluster(managementClusterName);
	await cluster.load();

	return cluster.toPlainObject();
}
