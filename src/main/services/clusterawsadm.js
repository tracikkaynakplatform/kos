
import { execFile } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { logger } from "../logger";


/**
 * Represents clusterawsadm executable.
 * NOTE: awsconfig object should be set, at least, before any call that needs credentials.
 * Should be constructed once used that way (cached).
 */
export class Clusterawsadm extends ClientExecutable {

	constructor(awsconfig) {
		super(
			"https://api.github.com/repos/kubernetes-sigs/cluster-api-provider-aws/releases/latest",
			"clusterawsadm"
		);
		this.awsconfig = awsconfig;
		if (awsconfig) {
			this.checkSetEncodedCredentials();
		}
  }


	/**
	 * 
	 * @returns {string} aws_b64encoded_credentials
	 */
	async checkSetEncodedCredentials() {
		if (! this.awsconfig.aws_b64encoded_credentials) {
			return await this.#setEncodedCredentials();
		}
	}

	async #setEncodedCredentials() {
		const args = ['bootstrap', 'credentials', 'encode-as-profile'];
		this.awsconfig.aws_b64encoded_credentials = 
				await this.exec(args, this.awsconfig.toEnvObject());
		return this.awsconfig.aws_b64encoded_credentials;
	}

	/**
	 * Returns public AMI IDs for that region, k8s version and operating system combination.
	 * @param {string} kubernetesVersion 
	 * @param {string} os 
	 * @param {string} region 
	 * @param {Object} env 
	 * @returns {Promise<String>} AWSAMIList object containing list of AMIs.
	 */
	async listPublicAMIs( { 
		kubernetesVersion, 
		os, 
		region=this.awsconfig.aws_region, 
		env = {}
	  } ) {

		// constructor calls this, iff called with a valid config, but to be sure:
		// should be called before ANY operation requiring CREDENTIALS !!
		await this.checkSetEncodedCredentials();

		let args = ['ami', 'list'];
		if (kubernetesVersion) { args.push("--kubernetes-version", kubernetesVersion); }
		args.push("--region", (region ? region : config.aws_region));
		if (os) { args.push("--os", os); }

		return this.jsonExec( { args, env: this.awsconfig.toEnvObject() } );

	}


}