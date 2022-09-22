import Downloader from "./base/Downloader";
import { execFile } from "child_process";
import { get as _get } from "request";
import downloadFile from "../utils/download-file";
import { access, constants, chmod } from "fs";
import KubeConfig from "../k8s/KubeConfig";

/**
 * kubectl ile işlem yapmaya yarayan sınıf.
 */
export default class Kubectl extends Downloader {
	constructor() {
		super("https://dl.k8s.io/release/", "kubectl");

		/**
		 * @type {string}
		 * @public
		 */
		this.version = null;

		/**
		 * @type {KubeConfig}
		 * @public
		 */
		this.config = new KubeConfig();
	}

	#createArgs(outputType, ...args) {
		let argString = [];
		argString.push(...args);
		if (outputType === "json") argString.push(...["-o", "json"]);
		return argString;
	}

	async #execKube(...args) {
		let path = await this.check();

		return new Promise((resolve, reject) => {
			execFile(
				path,
				args,
				{
					env: { KUBECONFIG: this.config.path },
					encoding: "utf-8",
				},
				(err, stdout, stderr) => {
					if (err) reject(err);
					resolve(stdout);
				}
			);
		});
	}

	/**
	 * Son sürüm kubectl indirilecek dosyanın sürüm numarasını döndürür.
	 * @returns {Promise<boolean>}
	 */
	async getVersion() {
		return new Promise((resolve, reject) => {
			_get(
				"https://dl.k8s.io/release/stable.txt",
				(error, response, body) => {
					if (error) reject(error);
					this.version = body;
					resolve(true);
				}
			);
		});
	}

	/**
	 * Son sürüm kubectl indirirken kullanılacak url'i bind eder.
	 * @returns {Promise<void>}
	 */
	async getDownloadUrl() {
		await this.getVersion();
		switch (this.os) {
			case "darwin":
			case "linux":
				this.url = `https://dl.k8s.io/release/${this.version}/bin/${this.os}/amd64/kubectl`;
				break;
			case "win32":
				this.url = `https://dl.k8s.io/release/${this.version}/bin/windows/amd64/kubectl.exe`;
				break;
		}
	}

	/**
	 * Son sürüm kubectl indirir ve ./bin/ dizinine kayıt eder.
	 */
	async download() {
		await this.getDownloadUrl();
		await downloadFile(this.url, this.path);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o777, (err) => {
				if (err) reject(err);
				resolve(this.path);
			});
		});
	}

	async currentContext() {
		return (await this.#execKube("config", "current-context")).trim();
	}

	async get(resource, outputType = "json", ...additionalArgs) {
		let output = await this.#execKube(
			...this.#createArgs(outputType, "get", resource, ...additionalArgs)
		);
		if (outputType === "json") return JSON.parse(output);
		return output;
	}

	async apply(file, outputType = "json", ...additionalArgs) {
		return new Promise((resolve, reject) => {
			access(file, constants.F_OK, async (err) => {
				if (err) reject(err);
				try {
					let output = await this.#execKube(
						...this.#createArgs(
							outputType,
							"apply",
							"-f",
							file,
							...additionalArgs
						)
					);
					if (outputType === "json") resolve(JSON.parse(output));
					else resolve(output);
				} catch (err) {
					reject(err);
				}
			});
		});
	}
}
