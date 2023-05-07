export async function upgradeWorker(managementClusterName: string, clusterName: string, newVersion: string): Promise<void> {
	return await window["managementClusterAPI"]["upgradeWorker"](managementClusterName, clusterName, newVersion);
}
