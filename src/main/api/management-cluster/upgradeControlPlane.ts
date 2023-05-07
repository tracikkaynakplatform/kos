import { ManagementCluster } from "kos/service/ManagementCluster";

export async function upgradeControlPlane(managementClusterName: string, clusterName: string, newVersion: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.upgradeControlPlane(clusterName, newVersion);
}
