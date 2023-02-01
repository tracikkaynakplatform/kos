export async function get(config, resource, name, options) {
	return await kubectlAPI.get(config, resource, name, options);
}

export async function delete_(config, resource, name, options) {
	return await kubectlAPI.delete_(config, resource, name, options);
}

export async function apply(config, yaml, options) {
	return await kubectlAPI.apply(config, yaml, options);
}

export async function applyFile(config, file, options) {
	return await kubectlAPI.applyFile(config, file, options);
}

export async function currentContext(config) {
	return await kubectlAPI.currentContext(config);
}

export async function getMachineDeployments(config, params) {
	return await kubectlAPI.getMachineDeployments(config, params ?? {});
}

export async function getMachineDeploymentVersionInfo(config, params) {
	return await kubectlAPI.getMachineDeploymentVersionInfo(
		config,
		params ?? {}
	);
}

export async function getControlPlaneVersionInfo(config, params) {
	return await kubectlAPI.getControlPlaneVersionInfo(config, params ?? {});
}

export async function isRolloutInProgress(versioning_info) {
	return await kubectlAPI.isRolloutInProgress(versioning_info);
}

export async function getPossibleControlPlaneVersions(config, clusterName) {
	return await kubectlAPI.getPossibleControlPlaneVersions(
		config,
		clusterName
	);
}

export async function getPossibleWorkerVersions(config, clusterName) {
	return await kubectlAPI.getPossibleWorkerVersions(config, clusterName);
}

export default {
	get,
	delete_,
	currentContext,
	apply,
	applyFile,
	getMachineDeployments,
	getMachineDeploymentVersionInfo,
	getControlPlaneVersionInfo,
	isRolloutInProgress,
	getPossibleControlPlaneVersions,
	getPossibleWorkerVersions,
};
