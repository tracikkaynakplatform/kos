export async function updateWorker(managementClusterName: string, clusterName: string, newReplicaCount: number): Promise<void> {
	return await window["managementClusterAPI"]["updateWorker"](managementClusterName, clusterName, newReplicaCount);
}
