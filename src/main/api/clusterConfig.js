import { getClusterConfig } from "./clusterctl";
import ManagementCluster from "../services/config/ManagementCluster";
import Kubectl from "../services/Kubectl";
import { KubeConfig } from "../k8s/KubeConfig";

export async function getManagementClusters() {
	return await ManagementCluster.getManagementClusters();
}

export async function getClusters(managementClusterConfig) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getClusters();
		}
	);
	return manCluster.clusters;
}

export async function getControlPlanes(managementClusterConfig, clusterName) {
	const manCluster = new ManagementCluster();
	let controlPlanesList = [];
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			const clusterKC = await getClusterConfig(
				managementClusterConfig,
				clusterName
			);
			const kctl = new Kubectl();
			await KubeConfig.tempConfig(kctl.config, clusterKC, async () => {
				controlPlanesList = (
					await kctl.get(
						"nodes",
						"json",
						"-l",
						"node-role.kubernetes.io/control-plane"
					)
				).items;
			});
		}
	);
	return controlPlanesList;
}

export async function getSupportedProviders(managementClusterConfig) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getSupportedProviders();
		}
	);
	return manCluster.supportedProviders;
}

export default [
	getControlPlanes,
	getManagementClusters,
	getSupportedProviders,
	getClusters,
];
