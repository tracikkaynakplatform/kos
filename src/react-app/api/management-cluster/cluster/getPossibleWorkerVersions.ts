export async function getPossibleWorkerVersions(managementClusterName: string, clusterName: string): Promise<string[]> {
	return await window["managementClusterAPI"]["getPossibleWorkerVersions"](managementClusterName, clusterName);
}
