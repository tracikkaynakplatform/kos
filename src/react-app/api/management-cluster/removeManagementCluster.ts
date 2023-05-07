export async function removeManagementCluster(managementClusterName: string) {
	return await window["managementClusterAPI"]["removeManagementCluster"](managementClusterName);
}
