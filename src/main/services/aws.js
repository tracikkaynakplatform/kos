
import { execFile } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { logger } from "../logger";


/**
 * Represents aws (aws client) executable.
 * NOTE: awsconfig object should be set, at least, before any call that needs credentials.
 * Should be constructed once used that way (cached).
 */
export class Aws extends ClientExecutable {

	constructor(awsconfig) {
		super(
			// containes only tags:
			"https://api.github.com/repos/aws/aws-cli/releases/latest",
			"aws"
		);
		this.awsconfig = awsconfig;
  }

	/**
	 * 
	 * @returns list<string> : A list of common 
	 */
	getCommonArguments() {
		return ['--no-cli-pager'];
	}

	/**
	 * Checks available regions for the <service>. For ec2, this is (practically) all the available regions 
	 * @param {string} service: The service we're checking the available regions for. Default is ec2.
	 * @returns 
	 */
	async listRegions({ service="ec2" } = {service:"ec2"}) {
		// check if --no-paginate is needed..
		let args = [service, 'describe-regions', ...this.getCommonArguments()];
		// let args = ['--version'];

		// const rawList = await this.jsonExec( { args: args, env: this.awsconfig.toEnvObject() } );
		const rawList = await this.jsonExec( { args, env: this.awsconfig.toEnvObject() } );
		let result = rawList.Regions.map(({ RegionName }) => RegionName);
		// logger.debug(`rawList = ${rawList}`);
		return result;
	}

	/**
	 * List keypairs (defined for that service) for the default region.
	 * @param {*} param0 service name, ...etc
	 * @returns The list of keypairs, if any exist, empty list otherwise.
	 */
	async listKeyPairs({ service="ec2", region=null } = {service:"ec2", region:null}) {
		// check if --no-paginate is needed..
		let args = [service, 'describe-key-pairs', ...this.getCommonArguments()];
		if (region) {
			args = [...args, '--region', region];
		}
		// let args = ['--version'];

		// const rawList = await this.jsonExec( { args: args, env: this.awsconfig.toEnvObject() } );
		const rawList = await this.jsonExec( { args, env: this.awsconfig.toEnvObject() } );
		return (rawList.KeyPairs);
	}

}