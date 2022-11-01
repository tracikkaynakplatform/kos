/**
 * Performs `clusterctl generate cluster ...`
 * @param	{String}			managementClusterConfig	Kubeconfig content of the target management cluster.
 * @param	{String}			clusterName
 * @param	{String}			kubernetesVersion
 * @param	{Number}			controlPlaneCount
 * @param	{Number}			workerCount
 * @param	{String}			infrastructure
 * @param	{String}			flavor
 * @param	{Object}			variables				Additional variables for cluster properties.
 * @returns {Promise<String>}							Output of clusterctl.
 */
export async function generateCluster(
	managementClusterConfig,
	clusterName,
	kubernetesVersion,
	controlPlaneCount,
	workerCount,
	infrastructure,
	flavor,
	variables
) {
	return await clusterctlAPI.generateCluster(
		managementClusterConfig,
		clusterName,
		kubernetesVersion,
		controlPlaneCount,
		workerCount,
		infrastructure,
		flavor,
		variables
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
