export async function generateCluster(managementClusterConfig, ...args) {
	return await clusterctlAPI.generateCluster(
		managementClusterConfig,
		...args
	);
}

export async function getClusterConfig(managementClusterConfig, clusterName) {
	return await clusterctlAPI.getClusterConfig(
		managementClusterConfig,
		clusterName
	);
}

export default {
	getClusterConfig,
	generateCluster,
};
