export async function getManagementClusters() {
	return await clusterConfigAPI.getManagementClusters();
}

export async function getClusters(managementClusterConfig) {
	return await clusterConfigAPI.getClusters(managementClusterConfig);
}

export async function getControlPlanes(managementClusterConfig, clusterName) {
	return await clusterConfigAPI.getControlPlanes(
		managementClusterConfig,
		clusterName
	);
}

export async function getSupportedProviders(managementClusterConfig) {
	return await clusterConfigAPI.getSupportedProviders(
		managementClusterConfig
	);
}

export default {
	getControlPlanes,
	getManagementClusters,
	getSupportedProviders,
	getClusters,
};
