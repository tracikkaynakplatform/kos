import { writeFileSync } from "original-fs";
import tmp from "tmp";
import { KubeConfig } from "../k8s/KubeConfig";
import Kubectl from "../services/Kubectl";
import { exportHelper } from "./exportHelper";

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
				const file = tmp.fileSync();
				writeFileSync(file.name, yaml, { encoding: "utf-8" });
				let result = await kctl.apply(file.name, ...args);
				file.removeCallback();
				resolve(result);
			});
		} catch (err) {
			reject(err);
		}
	});
}

export default [
	exportHelper("get", get),
	exportHelper("currentContext", currentContext),
	exportHelper("apply", apply),
	exportHelper("applyFile", applyFile),
	exportHelper("delete_", delete_),
];
