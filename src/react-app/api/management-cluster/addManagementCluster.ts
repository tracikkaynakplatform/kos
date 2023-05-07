export async function addManagementCluster(managementClusterName: string, kubeconfig: string, configuration?: any) {
	return await window["managementClusterAPI"]["addManagementCluster"](managementClusterName, kubeconfig, configuration);
}
