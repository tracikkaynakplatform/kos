import { KubeConfig } from "../k8s/KubeConfig";
import Clusterctl from "../services/Clusterctl";
import { exportHelper } from "./exportHelper";

export async function generateCluster(managementClusterConfig, ...args) {
	let result = null;
	let cctl = new Clusterctl();

	await KubeConfig.tempConfig(
		cctl.config,
		managementClusterConfig,
		async () => (result = await cctl.generateCluster(...args))
	);
	return result;
}

export async function getClusterConfig(managementClusterConfig, clusterName) {
	let result = null;
	let cctl = new Clusterctl();

	await KubeConfig.tempConfig(
		cctl.config,
		managementClusterConfig,
		async () => (result = await cctl.getClusterConfig(clusterName))
	);
	return result;
}

export default [
	exportHelper("getClusterConfig", getClusterConfig),
	exportHelper("generateCluster", generateCluster),
];
