export async function upgradeControlPlane(managementClusterName: string, clusterName: string, newVersion: string): Promise<void> {
	return await window["managementClusterAPI"]["upgradeControlPlane"](managementClusterName, clusterName, newVersion);
}
