import { ManagementCluster } from "kos/service/ManagementCluster";

export async function upgradeWorker(managementClusterName: string, clusterName: string, newVersion: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.upgradeWorker(clusterName, newVersion);
}
