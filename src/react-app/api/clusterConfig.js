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

export async function getCluster(managementClusterConfig, clusterName) {
	return await clusterConfigAPI.getCluster(
		managementClusterConfig,
		clusterName
	);
}

export async function setClusterCredentials(
	managementClusterName,
	credentials
) {
	return await clusterConfigAPI.setClusterCredentials(
		managementClusterName,
		credentials
	);
}

export async function getClusterCredentials(managementClusterName) {
	return await clusterConfigAPI.getClusterCredentials(managementClusterName);
}

export default {
	getManagementClusters,
	getSupportedProviders,
	getClusters,
	getCluster,
	getClusterCredentials,
	setClusterCredentials,
};
