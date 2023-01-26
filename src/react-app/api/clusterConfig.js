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

export async function isNameValid(managementClusterName) {
	return await clusterConfigAPI.isNameValid(managementClusterName);
}

export async function getCluster(managementClusterConfig, clusterName) {
	return await clusterConfigAPI.getCluster(
		managementClusterConfig,
		clusterName
	);
}

export async function setClusterConfiguration(
	managementClusterName,
	configuration
) {
	return await clusterConfigAPI.setClusterConfiguration(
		managementClusterName,
		configuration
	);
}

export async function getClusterConfiguration(managementClusterName) {
	return await clusterConfigAPI.getClusterConfiguration(
		managementClusterName
	);
}

export async function deleteCluster(managementClusterName) {
	return await clusterConfigAPI.deleteCluster(managementClusterName);
}

export async function upgradeControlPlane({
	managementClusterName,
	clusterName,
	toVersion,
}) {
	return await clusterConfigAPI.upgradeControlPlane(
		managementClusterName,
		clusterName,
		toVersion
	);
}

export async function upgradeWorkerNode({
	managementClusterName,
	clusterName,
	toVersion,
}) {
	return await clusterConfigAPI.upgradeWorkerNode(
		managementClusterName,
		clusterName,
		toVersion
	);
}

export default {
	getManagementClusters,
	getSupportedProviders,
	getClusters,
	getCluster,
	getClusterConfiguration,
	setClusterConfiguration,
	isNameValid,
	deleteCluster,
	upgradeControlPlane,
	upgradeWorkerNode,
};
