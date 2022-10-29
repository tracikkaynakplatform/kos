import { execFile } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { KubeConfig } from "../k8s/KubeConfig";

/**
 * Wrapper class for clusterctl command line tool.
 */
export default class Clusterctl extends ClientExecutable {
	/**
	 * Instantiate a new Clusterctl object.
	 */
	constructor() {
		super(
			"https://api.github.com/repos/kubernetes-sigs/cluster-api/releases/latest",
			"clusterctl"
		);

		/**
		 * @property Config object that will be used with clusterctl.
		 * @type {KubeConfig}
		 */
		this.config = new KubeConfig();
	}

	async #execClusterctl(env, ...args) {
		let path = await this.check();

		return new Promise((resolve, reject) => {
			execFile(
				path,
				args,
				{
					env: { KUBECONFIG: this.config.path, ...env },
					encoding: "utf-8",
				},
				(err, stdout) => {
					if (err) return reject(err);
					resolve(stdout);
				}
			);
		});
	}

	/**
	 * Performs `clusterctl get kubeconfig clusterName`
	 * @param	{String} clusterName	Name of target cluster.
	 * @returns	{Promise<String>}		Output of clusterctl.
	 */
	async getClusterConfig(clusterName) {
		return await this.#execClusterctl({}, "get", "kubeconfig", clusterName);
	}

	/**
	 * Performs `clusterctl generate cluster ...`
	 * @param	{String}			clusterName
	 * @param	{String}			kubernetesVersion
	 * @param	{Number}			masterCount
	 * @param	{Number}			workerCount
	 * @param	{Boolean}			isDocker			If it is true, adds **--flavor development**.
	 * @param	{String}			infrastructure
	 * @param	{Object}			env					Environment variables those will pass to clusterctl execution.
	 * @returns {Promise<String>}						Output of clusterctl.
	 */
	async generateCluster(
		clusterName,
		kubernetesVersion,
		masterCount,
		workerCount,
		isDocker = false,
		infrastructure = "",
		env = {}
	) {
		let args = ["generate", "cluster", clusterName];

		if (isDocker) args.push("--flavor", "development");

		args.push("--kubernetes-version", kubernetesVersion);
		args.push("--control-plane-machine-count", masterCount);
		args.push("--worker-machine-count", workerCount);

		if (infrastructure) args.push("--infrastructure", infrastructure);

		return await this.#execClusterctl(env, ...args);
	}
}
