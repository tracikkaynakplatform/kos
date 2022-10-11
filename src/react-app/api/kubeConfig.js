export async function defaultConfig() {
	return await kubeConfigAPI.defaultConfig();
}

export async function defaultConfigPath() {
	return await kubeConfigAPI.defaultConfigPath();
}

export async function saveManagementConfig(config, name) {
	return await kubeConfigAPI.saveManagementConfig(config, name);
}

export async function saveConfig(config, path) {
	return await kubeConfigAPI.saveConfig(config, path);
}

export async function loadManagementConfig(name) {
	return await kubeConfigAPI.loadManagementConfig(name);
}

export default {
	defaultConfig,
	defaultConfigPath,
	saveManagementConfig,
	saveConfig,
	loadManagementConfig,
};
