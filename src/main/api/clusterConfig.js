import ManagementCluster from "../services/config/ManagementCluster";
import fs from "fs";
import { KubeConfig } from "../k8s/KubeConfig";
import { dirCheck, DIRS } from "../utils/dir-check";

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

export async function getCluster(managementClusterConfig, clusterName) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getClusters();
		}
	);
	for (let cluster of manCluster.clusters)
		if (cluster.name === clusterName) return cluster;
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

export async function setClusterConfiguration(
	managementClusterName,
	credentials
) {
	const path = dirCheck(DIRS.managementClusters);
	fs.writeFileSync(
		`${path}/${managementClusterName}.json`,
		JSON.stringify(credentials),
		{ encoding: "utf-8" }
	);
}

export async function getClusterConfiguration(managementClusterName) {
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".json"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) {
		if (file == managementClusterName) {
			return JSON.parse(
				fs.readFileSync(`${path}/${file}.json`, { encoding: "utf-8" })
			);
		}
	}
}

export async function isNameValid(managementClusterName) {
	// TODO: Add other validation methods
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".kubeconfig"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) if (file == managementClusterName) return false;
	return true;
}

export async function deleteCluster(managementClusterName) {
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".kubeconfig"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) {
		if (file === managementClusterName) {
			try {
				let credPath = `${path}/${file}.json`;
				fs.accessSync(credPath);
				fs.unlinkSync(credPath);
			} catch (err) {}
			fs.unlinkSync(`${path}/${file}.kubeconfig`);
		}
	}
}

export default [
	getManagementClusters,
	getSupportedProviders,
	getClusters,
	getCluster,
	getClusterConfiguration,
	setClusterConfiguration,
	isNameValid,
	deleteCluster,
];
