import KubeConfig from "../k8s/KubeConfig";
import dirCheck, { DIRS } from "../utils/dir-checker";

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
	defaultConfig,
	defaultConfigPath,
	saveManagementConfig,
	saveConfig,
	loadManagementConfig,
];
