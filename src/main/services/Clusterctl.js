import { cwd } from "process";
import { execFile } from "child_process";
import fs from "fs";
import KubeConfig from "../k8s/KubeConfig";
import dirCheck, { DIRS } from "../utils/dir-checker";
import ClientExecutable from "./base/client-executable";

/**
 * clusterctl ile işlemler yapmaya yarayan sınıf.
 */
export default class Clusterctl extends ClientExecutable {
	constructor() {
		super(
			"https://api.github.com/repos/kubernetes-sigs/cluster-api/releases/latest",
			"clusterctl"
		);

		/**
		 * @type {KubeConfig}
		 * @public
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
				(err, stdout, stderr) => {
					if (err) reject(err);
					resolve(stdout);
				}
			);
		});
	}

	async getClusterConfig(clusterName) {
		return await this.#execClusterctl({}, "get", "kubeconfig", clusterName);
	}

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
