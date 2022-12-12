import { KubeConfig } from "../k8s/KubeConfig";
import { DIRS, dirCheck } from "../utils/dir-check";
import { exportHelper } from "./exportHelper";

export async function defaultConfig() {
	return await KubeConfig.defaultConfig();
}

export async function defaultConfigPath() {
	return await KubeConfig.defaultConfigPath();
}

export async function saveManagementConfig(config, name) {
	return await saveConfig(
		config,
		`${await dirCheck(DIRS.managementClusters)}/${name}.kubeconfig`
	);
}

export async function saveConfig(config, path) {
	const kc = new KubeConfig();
	if (path) kc.path = path;
	await kc.changeContent(config);
	return kc.path;
}

export async function loadManagementConfig(name) {
	const kc = new KubeConfig();
	await kc.changePath(
		`${await dirCheck(DIRS.managementClusters)}/${name}.kubeconfig`
	);
	return kc.config;
}

export default [
	exportHelper("defaultConfig", defaultConfig),
	exportHelper("defaultConfigPath", defaultConfigPath),
	exportHelper("saveManagementConfig", saveManagementConfig),
	exportHelper("saveConfig", saveConfig),
	exportHelper("loadManagementConfig", loadManagementConfig),
];
