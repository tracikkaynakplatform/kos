export async function getManagementClusters() {
	return await clusterConfigAPI.getManagementClusters();
}

export async function getClusters(managementClusterConfig) {
	return await clusterConfigAPI.getClusters(managementClusterConfig);
}

export async function getSupportedProviders(managementClusterConfig) {
	return await clusterConfigAPI.getSupportedProviders(
		managementClusterConfig
	);
}

export default {
	getManagementClusters,
	getSupportedProviders,
	getClusters,
};
