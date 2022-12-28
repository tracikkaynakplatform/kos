import { execFile, execFileSync } from "child_process";
import { ClientExecutable } from "./base/client-executable";
import { logger } from "../logger";
import { downloadFile } from "../utils/download-file";
import { dirCheck, DIRS } from "../utils/dir-check";
import decompress from "decompress";
import { renameSync, rmSync, unlinkSync, writeFileSync } from "fs";
import { platform } from "./base/platform";

/**
 * Represents aws (aws client) executable.
 * NOTE: awsconfig object should be set, at least, before any call that needs credentials.
 * Should be constructed once used that way (cached).
 */
export class Aws extends ClientExecutable {
	constructor(awsconfig) {
		switch (platform.osFamily) {
			case "linux":
				super(
					"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip",
					"aws"
				);
				this.path = `${dirCheck(DIRS.bin)}/aws/dist/aws`;
				break;
			case "darwin":
				super("https://awscli.amazonaws.com/AWSCLIV2.pkg", "aws");
				this.path = `${dirCheck(DIRS.bin)}/aws/aws`;
				break;
		}
		this.awsconfig = awsconfig;
	}

	async download() {
		if (platform.osFamily !== "linux" && platform.osFamily !== "darwin")
			throw new Error(
				"KOS doesn't support auto-download feature for aws-cli for client operating systems other than Linux and MacOS."
			);

		const binPath = dirCheck(DIRS.bin);
		switch (platform.osFamily) {
			case "linux":
				const zipPath = `${binPath}/awscli.zip`;

				await downloadFile(this.url, zipPath);
				await decompress(zipPath, `${binPath}`);
				await rmSync(zipPath);
				break;
			case "darwin":
				const pkgPath = `${binPath}/awscli.pkg`;
				const xmlPath = `${binPath}/choise.xml`;
				await downloadFile(this.url, pkgPath);
				writeFileSync(
					xmlPath,
					`
				<?xml version="1.0" encoding="UTF-8"?>
				<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
				<plist version="1.0">
				<array>
					<dict>
					<key>choiceAttribute</key>
					<string>customLocation</string>
					<key>attributeSetting</key>
					<string>${binPath}</string>
					<key>choiceIdentifier</key>
					<string>default</string>
					</dict>
				</array>
				</plist>
				`
				);
				execFileSync("installer", [
					"-pkg",
					pkgPath,
					"-target",
					"CurrentUserHomeDirectory",
					"-applyChoiceChangesXML",
					xmlPath,
				]);
				rmSync(xmlPath);
				rmSync(pkgPath);
				renameSync(`${binPath}/aws-cli`, `${binPath}/aws`);
				break;
		}
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
