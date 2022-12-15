import { execFile } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { logger } from "../logger";
import { downloadFile } from "../utils/download-file";
import { dirCheck, DIRS } from "../utils/dir-check";
import decompress from "decompress";
import { rmSync } from "original-fs";
import { platform } from "./base/platform";

/**
 * Represents aws (aws client) executable.
 * NOTE: awsconfig object should be set, at least, before any call that needs credentials.
 * Should be constructed once used that way (cached).
 */
export class Aws extends ClientExecutable {
	constructor(awsconfig) {
		super(
			// containes only tags:
			platform.osFamily === "linux" // Currently it supports only Linux systems.
				? "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"
				: "",
			"aws"
		);
		this.awsconfig = awsconfig;
		this.path = `${dirCheck(DIRS.bin)}/aws/dist/aws`;
	}

	async download() {
		if (platform.osFamily !== "linux")
			throw new Error(
				"KOS doesn't support auto-download feature for aws-cli on other operating systems expect Linux."
			);

		const binPath = dirCheck(DIRS.bin);
		const zipPath = `${binPath}/awscli.zip`;

		await downloadFile(this.url, zipPath);
		await decompress(zipPath, `${binPath}`);
		await rmSync(zipPath);
	}

	/**
	 *
	 * @returns list<string> : A list of common
	 */
	getCommonArguments() {
		return ["--no-cli-pager"];
	}

	/**
	 * Checks available regions for the <service>. For ec2, this is (practically) all the available regions
	 * @param {string} service: The service we're checking the available regions for. Default is ec2.
	 * @returns
	 */
	async listRegions({ service = "ec2" } = { service: "ec2" }) {
		// check if --no-paginate is needed..
		let args = [service, "describe-regions", ...this.getCommonArguments()];
		// let args = ['--version'];

		// const rawList = await this.jsonExec( { args: args, env: this.awsconfig.toEnvObject() } );
		const rawList = await this.jsonExec({
			args,
			env: this.awsconfig.toEnvObject(),
		});
		let result = rawList.Regions.map(({ RegionName }) => RegionName);
		// logger.debug(`rawList = ${rawList}`);
		return result;
	}

	/**
	 * List keypairs (defined for that service) for the default region.
	 * @param {*} param0 service name, ...etc
	 * @returns The list of keypairs, if any exist, empty list otherwise.
	 */
	async listKeyPairs(
		{ service = "ec2", region = null } = { service: "ec2", region: null }
	) {
		// check if --no-paginate is needed..
		let args = [
			service,
			"describe-key-pairs",
			...this.getCommonArguments(),
		];
		if (region) {
			args = [...args, "--region", region];
		}
		// let args = ['--version'];

		// const rawList = await this.jsonExec( { args: args, env: this.awsconfig.toEnvObject() } );
		const rawList = await this.jsonExec({
			args,
			env: this.awsconfig.toEnvObject(),
		});
		return rawList.KeyPairs;
	}
}
