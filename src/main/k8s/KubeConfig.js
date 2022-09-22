import { access, constants } from "fs";
import { env, cwd } from "process";
import fs from "fs";

export default class KubeConfig {
	constructor() {
		this.config = "";
		this.path = `${cwd()}/config/kc-${Date.now()}.yaml`;
	}

	async changePath(path) {
		return new Promise((resolve, reject) => {
			access(this.path, constants.F_OK, async (err) => {
				try {
					if (!err) await this.delete();
					this.path = path;
					await this.load();
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		});
	}

	async changeContent(content) {
		this.config = content;
		await this.write();
	}

	async load() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, { encoding: "utf-8" }, (err, data) => {
				if (err) reject(err);
				this.config = data;
				resolve(data);
			});
		});
	}

	async write() {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, this.config, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	async delete() {
		return new Promise((resolve, reject) => {
			fs.unlink(this.path, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	static async tempConfig(config, content, operation) {
		return new Promise(async (resolve, reject) => {
			let err = null;
			await config.changeContent(content);
			try {
				await operation();
			} catch (_err) {
				err = _err;
			} finally {
				try {
					await config.delete();
				} catch (_) {}
				if (err) reject(err);
				resolve();
			}
		});
	}

	static async defaultConfig() {
		return new Promise(async (resolve, reject) => {
			try {
				let path = await KubeConfig.defaultConfigPath();
				fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
					if (err) reject(err);
					resolve(data);
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	static async defaultConfigPath() {
		let path = `${env.HOME}/.kube/config`;

		if (env.KUBECONFIG) path = env.KUBECONFIG;
		return new Promise((resolve, reject) => {
			access(path, constants.F_OK, (err) => {
				if (err)
					reject(
						new Error(
							"Kullanılabilir bir kubeconfig dosyası bulunamadı"
						)
					);
				resolve(path);
			});
		});
	}
}
