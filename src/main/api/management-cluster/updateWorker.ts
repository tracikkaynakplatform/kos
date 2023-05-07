import { ManagementCluster } from "kos/service/ManagementCluster";

export async function updateWorker(managementClusterName: string, clusterName: string, newReplicaCount: number): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.updateWorker(clusterName, newReplicaCount);
}
