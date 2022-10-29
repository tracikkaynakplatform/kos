import { ClientExecutable } from "./base/client-executable";
import { execFile } from "child_process";
import { get as _get } from "request";
import { downloadFile } from "../utils/download-file";
import { access, constants, chmod } from "fs";
import { KubeConfig } from "../k8s/KubeConfig";
import { platform } from "./base/platform";

/**
 * Wrapper class for kubectl command line tool.
 */
export default class Kubectl extends ClientExecutable {
	constructor() {
		super("https://dl.k8s.io/release/", "kubectl");

		/**
		 * @property Version number of kubectl.
		 * @type {String}
		 * @private
		 */
		this.#version = null;

		/**
		 * @property KubeConfig object that will used by kubectl.
		 * @type {KubeConfig}
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
				(err, stdout) => {
					if (err) return reject(err);
					resolve(stdout);
				}
			);
		});
	}

	async #getVersion() {
		return new Promise((resolve, reject) => {
			_get(
				"https://dl.k8s.io/release/stable.txt",
				(error, response, body) => {
					if (error) return reject(error);
					this.#version = body;
					resolve(true);
				}
			);
		});
	}

	async #getDownloadUrl() {
		await this.getVersion();
		this.url = `https://dl.k8s.io/release/${this.#version}/bin/${
			platform.osFamily
		}/${platform.arch}/kubectl${platform.exeExt}`;
	}

	async download() {
		await this.getDownloadUrl();
		await downloadFile(this.url, this.path);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o755, (err) => {
				if (err) return reject(err);
				resolve(this.path);
			});
		});
	}

	/**
	 * Performs `kubectl config current-context`.
	 * @returns {Promise<String>} Current context name.
	 */
	async currentContext() {
		return (await this.#execKube("config", "current-context")).trim();
	}

	/**
	 * Performs `kubectl get resource`.
	 * @param	{String}			resource			Resource type. eg. cluster, pods, deployments.
	 * @param	{'json'}			[outputType=json]	Output type of kubectl.
	 * @param	{...String}			additionalArgs		Extra arguments those will pass to kubectl.
	 * @returns	{Promise<String>}						Output of kubectl.
	 */
	async get(resource, outputType = "json", ...additionalArgs) {
		let output = await this.#execKube(
			...this.#createArgs(outputType, "get", resource, ...additionalArgs)
		);
		if (outputType === "json") return JSON.parse(output);
		return output;
	}

	/**
	 * Performs `kubectl delete resource`.
	 * @param	{String}			resource		Resource type. eg. cluster, pods, deployments.
	 * @param	{String}			name			Target resource name.
	 * @param	{...String}			additionalArgs	Extra arguments those will pass to kubectl.
	 * @returns	{Promise<String>}					Output of kubectl.
	 */
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

	/**
	 * Performs `kubectl apply -f file`.
	 * @param	{String} 			file				The file that will apply to cluster.
	 * @param	{'json'}			[outputType=json]	Output type of kubectl.
	 * @param	{...String}			additionalArgs		Extra arguments those will pass to kubectl.
	 * @returns	{Promise<String>}						Output of kubectl.
	 */
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
