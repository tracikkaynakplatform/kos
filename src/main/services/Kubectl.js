import { ClientExecutable } from "./base/ClientExecutable";
import { get as _get } from "request";
import { downloadFile } from "../utils/download-file";
import { chmod } from "fs";
import { KubeConfig } from "../k8s/KubeConfig";
import { platform } from "./base/Platform";

/**
 * Resource types of Kubernetes
 * @enum {String}
 */
export const ResourceType = {
	Cluster: "cluster",
	Nodes: "nodes",
	Pods: "pods",
	KubeadmControlPlane: "KubeadmControlPlane",
	MachineDeployment: "MachineDeployment",
};

/**
 * Options for kubectl
 * @typedef		{Object}			Options
 * @property	{'json'|'normal'}	outputType
 * @property	{String}			label
 * @property	{boolean}			allNamespaces
 */

/**
 * Version object.
 * @typedef		{Object}			VersionObject
 * @property	{Number}			major
 * @property	{Number}			minor
 * @property	{Number}			patch
 * @property	{String}			gitVersion
 * Options for `kubectl patch`
 * @typedef		{Object}			PatchOptions
 * @property	{'json'|'normal'}				outputType
 * @property	{'merge'|'json'|'strategic'}	type
 * @property	{String|Object}					patch
 * @property	{String}						patchFile
 */

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
		this._version = null;

		/**
		 * @property KubeConfig object that will used by kubectl.
		 * @type {KubeConfig}
		 */
		this.config = new KubeConfig();
	}

	#parseOptions(args, options) {
		let _args = [...args];
		if (options?.outputType === "json") _args.push("-o", "json");
		if (options?.label) args.push("-l", options.label);
		if (options?.allNamespaces) _args.push("-A");
		return _args;
	}

	async #parseOutput(output, options) {
		if (options?.outputType === "json") return await JSON.parse(output);
		return output;
	}

	async #getVersion() {
		return new Promise((resolve, reject) => {
			_get(
				"https://dl.k8s.io/release/stable.txt",
				(error, response, body) => {
					if (error) return reject(error);
					this._version = body;
					resolve(true);
				}
			);
		});
	}

	async #getDownloadUrl() {
		await this.#getVersion();
		this.url = `https://dl.k8s.io/release/${this._version}/bin/${platform.osFamily}/${platform.arch}/kubectl${platform.exeExt}`;
	}

	async exec(args = [], env = {}) {
		return await super.exec(args, { KUBECONFIG: this.config.path, ...env });
	}

	async download() {
		await this.#getDownloadUrl();
		await downloadFile(this.url, this.path);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o755, (err) => {
				if (err) return reject(err);
				resolve(this.path);
			});
		});
	}

	/**
	 * Gets server (cluster) or client (kubectl) verions.
	 * @param	{'server'|'client'} 		_of	Object version that you want to get.
	 * @returns {Promise<VersionObject>}
	 */
	async version(_of = "server") {
		const output = JSON.parse(await this.exec(["version", "-o", "json"]));
		const createVersionObject = (x) => ({
			major: parseInt(x.major),
			minor: parseInt(x.minor),
			patch: parseInt(x.gitVersion.split(".")[2]),
			gitVersion: x.gitVersion,
		});
		if (_of === "client") {
			return createVersionObject(output.clientVersion);
		} else if (_of === "server") {
			return createVersionObject(output.serverVersion);
		} else {
			throw "Unknown argument: " + _of;
		}
	}

	/**
	 * Performs `kubectl config current-context`.
	 * @returns {Promise<String>}			Current context name.
	 */
	async currentContext() {
		return (await this.exec(["config", "current-context"])).trim();
	}

	/**
	 * Performs `kubectl get resource`.
	 * @param	{String}							resource	Resource type. eg. cluster, pods, deployments.
	 * @param	{String}							name		Resource name.
	 * @param	{Options}							options		Additional options for target command.
	 * @returns	{Promise<String>|Promise<Object>}				Output of kubectl.
	 */
	async get(resource, name, options) {
		return await this.#parseOutput(
			await this.exec(
				this.#parseOptions(["get", resource, name], options)
			),
			options
		);
	}

	/**
	 * Performs `kubectl delete resource`.
	 * @param	{String}			resource		Resource type. eg. cluster, pods, deployments.
	 * @param	{String}			name			Target resource name.
	 * @param	{Options}			options			Additional options for target command.
	 * @returns	{Promise<String>|Promise<Object>}	Output of kubectl.
	 */
	async delete_(resource, name, options = {}) {
		return await this.#parseOutput(
			await this.exec(
				this.#parseOptions(["delete", resource, name], options)
			),
			options
		);
	}

	/**
	 * Performs `kubectl apply -f file`.
	 * @param	{String} 			file			The file that will apply to cluster.
	 * @param	{Options}			options			Additional options for target command.
	 * @returns	{Promise<String>|Promise<Object>}	Output of kubectl.
	 */
	async apply(file, options) {
		return await this.#parseOutput(
			await this.exec(this.#parseOptions(["apply", "-f", file], options)),
			options
		);
	}

	/**
	 * Performs `kubectl patch` command and return its output.
	 * @param {String}			resource
	 * @param {ResourceType}	resourceName
	 * @param {PatchOptions}	options
	 */
	async patch(resource, resourceName, options) {
		const parseOptions = this.#parseOptions(
			["patch", resource, resourceName],
			options
		);

		if (options?.type) {
			parseOptions.push("--type", options.type);
		}

		if (options?.patch) {
			parseOptions.push("-p");
			if (typeof options.patch === "object") {
				parseOptions.push(JSON.stringify(options.patch));
			} else {
				parseOptions.push(options.patch);
			}
		} else if (options?.patchFile) {
			parseOptions.push("--patch-file", options.patchFile);
		}
		return await this.#parseOutput(
			await this.exec(parseOptions),
			parseOptions
		);
	}
}
