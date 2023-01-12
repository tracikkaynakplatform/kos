import { execFile } from "child_process";
import { ClientExecutable } from "./base/ClientExecutable";
import { KubeConfig } from "../k8s/KubeConfig";
import { logger } from "../logger";
import { basePath } from "../utils/dir-check";

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
			logger.debug(
				`Executing clusterctl: ${path} ${args.join(" ")} ${
					env
						? `with ${Object.keys(env ?? {}).map(
								(x) => `${x}=${env[x]}`
						  )}environment variables`
						: ""
				}`
			);
			execFile(
				path,
				args,
				{
					env: {
						KUBECONFIG: this.config.path,
						...env,
					},
					cwd: basePath,
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
	 * @param	{Number}			controlPlaneCount
	 * @param	{Number}			workerCount
	 * @param	{String}			infrastructure
	 * @param	{String}			flavor
	 * @param	{Object}			variables			Additional variables for defining cluster spec.
	 * @returns {Promise<String>}						Output of clusterctl.
	 */
	async generateCluster(
		clusterName,
		kubernetesVersion,
		controlPlaneCount,
		workerCount,
		infrastructure,
		flavor,
		variables
	) {
		let args = ["generate", "cluster", clusterName];

		if (flavor) args.push("--flavor", flavor);
		if (infrastructure) args.push("--infrastructure", infrastructure);
		if (kubernetesVersion)
			args.push("--kubernetes-version", kubernetesVersion);
		if (controlPlaneCount)
			args.push("--control-plane-machine-count", controlPlaneCount);
		if (workerCount) args.push("--worker-machine-count", workerCount);
		return await this.#execClusterctl(variables, ...args);
	}
}
