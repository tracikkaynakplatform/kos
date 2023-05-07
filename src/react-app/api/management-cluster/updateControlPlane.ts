export async function updateControlPlane(managementClusterName: string, clusterName: string, newReplicaCount: number): Promise<void> {
	return await window["managementClusterAPI"]["updateControlPlane"](managementClusterName, clusterName, newReplicaCount);
}
