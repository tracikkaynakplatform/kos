export async function deleteCluster(managementClusterName: string, clusterName: string) {
	return await window["managementClusterAPI"]["deleteCluster"](managementClusterName, clusterName);
}
