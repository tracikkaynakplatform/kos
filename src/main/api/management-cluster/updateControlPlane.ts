import { ManagementCluster } from "kos/service/ManagementCluster";

export async function updateControlPlane(managementClusterName: string, clusterName: string, newReplicaCount: number): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.updateControlPlane(clusterName, newReplicaCount);
}
