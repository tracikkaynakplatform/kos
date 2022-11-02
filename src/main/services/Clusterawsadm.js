
import { execFile } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { logger } from "../logger";


/**
 * Represents clusterawsadm executable.
 */
class Clusterawsadm extends ClientExecutable {

	constructor() {
		super(
			"https://api.github.com/repos/kubernetes-sigs/cluster-api-provider-aws/releases/latest",
			"clusterawsadm"
		);
  }

	/**
	 * Execute clusterawsadm with:
	 * @param {AWSConfig} config 
	 * @param env 
	 * @param args 
	 */
	async exec(config, env, args) {
		const path = await this.check();
		logger.debug(
			`Executing Clusterawsadm ${path} ${args.join(" ")} ${
				env
					? `with ${Object.keys(env ?? {}).map(
							(x) => `${x}=${env[x]}`
						)}environment variables`
					: ""
			}`
		);
		return new Promise((resolve, reject) => {
			execFile(
				path,
				...args,
				{
					env: {
						...config.toEnvObject(),
						...env,
					},
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
	 * Returns public AMI IDs for that region, k8s version and operating system combination.
	 * @param {AWSConfig} config 
	 * @param {string} kubernetesVersion 
	 * @param {string} os 
	 * @param {string} region 
	 * @param {Object} env 
	 * @returns {Promise<String>}
	 */
	async listPublicAMIs(config, kubernetesVersion, os, region="", env={}) {
		let args = ['ami', 'list'];
		if (k8sVersion) { args.push("--kubernetes-version", kubernetesVersion); }
		args.push("--region", (region ? region : config.aws_region));
		if (os) { args.push("--os", os); }
		return await this.exec(config, env, args);
	}

}