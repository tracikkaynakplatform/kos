import { ClientExecutable } from "./base/client-executable";
import { execFile } from "child_process";
import { get as _get } from "request";
import downloadFile from "../utils/download-file";
import { access, constants, chmod } from "fs";
import KubeConfig from "../k8s/KubeConfig";
import {platform} from "./base/platform";

/**
 * kubectl ile işlem yapmaya yarayan sınıf.
 */
export default class Kubectl extends ClientExecutable {
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
	async #getVersion() {
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
	async #getDownloadUrl() {
		await this.getVersion();
		this.url = `https://dl.k8s.io/release/${this.version}/bin/${platform.osFamily}/${platform.arch}/kubectl${platform.exeExt}`
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

	async delete_(resource, name, ...additionalArgs) {
		return await this.#execKube(
			...this.#createArgs(
				undefined,
				"delete",
				resource,
				name,
				...additionalArgs
			)
		);
	}

	async apply(file, outputType = "json", ...additionalArgs) {
		let output = await this.#execKube(
			...this.#createArgs(
				outputType,
				"apply",
				"-f",
				file,
				...additionalArgs
			)
		);
		if (outputType === "json") return JSON.parse(output);
		else return output;
	}
}
