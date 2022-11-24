import { access, constants, readFile, unlink, writeFile } from "fs";
import { env } from "process";
import { dirCheck, DIRS } from "../utils/dir-check";
import { customAlphabet } from "nanoid";

const tmpFileName = customAlphabet("1234567890abcdefghijklmnoprstuvyzqwx", 10);

/**
 * Represents a kubeconfig file.
 */
export class KubeConfig {
	/**
	 * Instantiate a new KubeConfig object with a file name that has timestamp under `DIRS.config` directory.
	 */
	constructor() {
		/**
		 * @property Content of the kubeconfig file.
		 * @type {String}
		 */
		this.config = "";

		/**
		 * @property Path of the kubeconfig file.
		 * @type {String}
		 */
		this.path = `${dirCheck(DIRS.config)}/kc-${tmpFileName()}.yaml`;
	}

	/**
	 * Changes the `path` and load new file content to `config`.
	 * @param {String} path	New kubeconfig path.
	 * @throws				Throws if file doesn't exists or cannot read the file.
	 */
	async changePath(path) {
		await this.delete();
		this.path = path;
		await this.load();
	}

	/**
	 * Changes the content of the kubeconfig file that on the `path`
	 * @param {String} content	New kubeconfig content.
	 * @throws					Throws if unable to write file in the `path`
	 */
	async changeContent(content) {
		this.config = content;
		await this.write();
	}

	/**
	 * Writes `config` content to the file in the `path`.
	 * @throws	Throws if unable to write file in the `path`
	 */
	async write() {
		return new Promise((resolve, reject) => {
			writeFile(this.path, this.config, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	/**
	 * Loads content of the file that has been in the `path` and put them into `config`
	 * @throws	Throws exception if error occured while reading the file.
	 */
	async load() {
		return new Promise((resolve, reject) => {
			readFile(this.path, { encoding: "utf-8" }, (err, data) => {
				if (err) return reject(err);
				this.config = data;
				resolve();
			});
		});
	}

	/**
	 * Deletes the kubeconfig file in the `path`.
	 */
	async delete() {
		return new Promise((resolve) => unlink(this.path, () => resolve()));
	}

	/**
	 * Creates a temporarily kubeconfig file using `config` object and runs `func`.
	 * Deletes kubeconfig file after execution of `func` even an error occured.
	 * @param	{KubeConfig}	config	Config object that will be used.
	 * @param	{String}		content	The content will be used as kubeconfig content.
	 * @param	{Function}		func	Function that will run.
	 * @throws							Throws if an error occured in `func`
	 * @static
	 */
	static async tempConfig(config, content, func) {
		return new Promise(async (resolve, reject) => {
			let err = null;
			await config.changeContent(content);
			try {
				await func?.();
			} catch (_err) {
				err = _err;
			} finally {
				try {
					await config.delete();
				} catch (_) {}
				if (err) return reject(err);
				resolve();
			}
		});
	}

	/**
	 * Gets content of KUBECONFIG file in current environment.
	 * @throws						Throws if cannot find a usable KUBECONFIG file or unable to read the file.
	 * @returns {Promise<String>}	Content of KUBECONFIG file in current environment.
	 * @static
	 */
	static async defaultConfig() {
		return new Promise(async (resolve, reject) => {
			try {
				let path = await KubeConfig.defaultConfigPath();
				readFile(path, { encoding: "utf-8" }, (err, data) => {
					if (err) return reject(err);
					resolve(data);
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * Gets absolute path of KUBECONFIG file in current environment.
	 * @throws						Throws if cannot find a usable KUBECONFIG file.
	 * @returns {Promise<String>}	Absolute path of KUBECONFIG file in current environment.
	 * @static
	 */
	static async defaultConfigPath() {
		let path = `${env.HOME}/.kube/config`;

		if (env.KUBECONFIG) path = env.KUBECONFIG;
		return new Promise((resolve, reject) => {
			access(path, constants.F_OK, (err) => {
				if (err)
					return reject(new Error("Couldn't find a kubeconfig file"));
				resolve(path);
			});
		});
	}
}
