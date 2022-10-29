import { KubeConfig } from "../k8s/KubeConfig";
import Kubectl from "../services/Kubectl";

async function execKube(config, callback) {
	let result = null;
	let kctl = new Kubectl();

	await KubeConfig.tempConfig(kctl.config, config, async () => {
		result = await callback(kctl);
	});
	return result;
}

export async function get(config, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.get(...args);
	});
}

export async function delete_(config, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.delete_(...args);
	});
}

export async function currentContext(config) {
	return await execKube(config, async (kctl) => {
		return await kctl.currentContext();
	});
}

export async function applyFile(config, file, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.apply(file, ...args);
	});
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

export default [get, currentContext, apply, applyFile, delete_];
