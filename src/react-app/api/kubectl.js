// Servis tarafına dönülmesi durumunda buradaki API'ler değiştirilebilir.

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

export default {
	get,
	delete_,
	currentContext,
	apply,
	applyFile,
};
