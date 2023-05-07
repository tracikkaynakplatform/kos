import { ManagementCluster } from "kos-fe/models/ManagementCluster";

export async function getManagementCluster(managementClusterName: string): Promise<ManagementCluster> {
	return await window["managementClusterAPI"]["getManagementCluster"](managementClusterName);
}

export async function getManagementClusters(): Promise<ManagementCluster[]> {
	return await window["managementClusterAPI"]["getManagementCluster"]();
}
