// Servis tarafına dönülmesi durumunda buradaki API'ler değiştirilebilir.

export async function get(config, resourceType, outputType, ...args) {
	return await kubectlAPI.get(config, resourceType, outputType, ...args);
}

export async function delete_(config, ...args) {
	return await kubectlAPI.delete_(config, ...args);
}

export async function apply(config, yaml, ...args) {
	return await kubectlAPI.apply(config, yaml, ...args);
}

export async function applyFile(config, file, ...args) {
	return await kubectlAPI.applyFile(config, file, ...args);
}

export async function currentContext(config) {
	return await kubectlAPI.currentContext(config);
}

export default {
	get,
	delete_,
	currentContext,
	apply,
	applyFile,
};
