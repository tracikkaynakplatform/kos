import ManagementCluster from "../services/config/ManagementCluster";
import { PROVIDER_TYPE } from "../providers";
import Kubectl from "../services/Kubectl";
import KubeConfig from "../k8s/KubeConfig";
import fs from "fs";
import dirCheck, { DIRS } from "../utils/dir-checker";

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

export default [getManagementClusters, getSupportedProviders, getClusters];
