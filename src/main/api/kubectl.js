import KubeConfig from "../k8s/KubeConfig";
import Kubectl from "../services/Kubectl";

export async function get(config, ...args) {
	let result = null;
	let kctl = new Kubectl();

	await KubeConfig.tempConfig(kctl.config, config, async () => {
		result = await kctl.get(...args);
	});
	return result;
}

export async function apply(config, yaml, ...args) {
	return new Promise(async (resolve, reject) => {
		let kctl = new Kubectl();
		try {
			await KubeConfig.tempConfig(kctl.config, config, async () => {
				let yamlFile = new KubeConfig(); // TODO: tempfile sınıfı oluşturulacak.
				await KubeConfig.tempConfig(yamlFile, yaml, async () => {
					resolve(await kctl.apply(yamlFile.path, ...args));
				});
			});
		} catch (err) {
			reject(err);
		}
	});
}

export async function currentContext(config) {
	let result = null;
	let kctl = new Kubectl();

	await KubeConfig.tempConfig(kctl.config, config, async () => {
		result = await kctl.currentContext();
	});
	return result;
}

export default [get, currentContext, apply];
