export async function getClusterKubeconfig(managementClusterName: string, clusterName: string): Promise<string> {
	return await window["managementClusterAPI"]["getClusterKubeconfig"](managementClusterName, clusterName);
}
