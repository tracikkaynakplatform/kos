export async function getPossibleControlPlaneVersions(managementClusterName: string, clusterName: string): Promise<string[]> {
	return await window["managementClusterAPI"]["getPossibleControlPlaneVersions"](managementClusterName, clusterName);
}
