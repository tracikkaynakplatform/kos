export async function updateManagementCluster(managementClusterName: string, kubeconfig?: string, configuration?: any) {
	return await window["managementClusterAPI"]["updateManagementCluster"](managementClusterName, kubeconfig, configuration);
}
