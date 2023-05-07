import decompress from "decompress";
import { execFileSync } from "child_process";
import { renameSync, rmSync, writeFileSync } from "original-fs";
import { platform } from "kos/service/Platform";
import { downloadFile } from "kos/utils/downloadFile";
import { Directories, Environment } from "kos/service/Environment";
import { NotImplementedError } from "kos/error/NotImplementedError";
import { ClientExecutable } from "./ClientExecutable";

export interface AwsConfig {
	AWS_REGION: string;
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;
	AWS_B64ENCODED_CREDENTIALS: string;
}

export enum AwsService {
	EC2 = "ec2",
}

export class AwsCli extends ClientExecutable {
	private _config: AwsConfig;

	public constructor(config: AwsConfig, abortController?: AbortController) {
		super("aws", abortController);

		switch (platform.osFamily) {
			case "linux":
				this.path = `${Environment.checkDirectory(Directories.Binary)}/aws/dist/aws`;
				break;
			case "darwin":
				this.path = `${Environment.checkDirectory(Directories.Binary)}/aws/aws`;
				break;
		}

		this._config = config;
	}

	private async execAws(args?: any[], env?: any): Promise<any> {
		return JSON.parse(await this.exec(args, env));
	}

	public async download(): Promise<void> {
		const binaryPath = Environment.checkDirectory(Directories.Binary);
		switch (platform.osFamily) {
			case "linux":
				const zipPath = `${binaryPath}/awscli.zip`;
				await downloadFile(await this.getDownloadUrl(), zipPath, this.MAX_DOWNLOAD_RETRIES);
				await decompress(zipPath, `${binaryPath}`);
				await rmSync(zipPath);
				break;
			case "darwin":
				const pkgPath = `${binaryPath}/awscli.pkg`;
				const xmlPath = `${binaryPath}/choise.xml`;
				await downloadFile(await this.getDownloadUrl(), pkgPath, this.MAX_DOWNLOAD_RETRIES);
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
					<string>${binaryPath}</string>
					<key>choiceIdentifier</key>
					<string>default</string>
					</dict>
				</array>
				</plist>
				`
				);
				execFileSync("installer", ["-pkg", pkgPath, "-target", "CurrentUserHomeDirectory", "-applyChoiceChangesXML", xmlPath]);
				rmSync(xmlPath);
				rmSync(pkgPath);
				renameSync(`${binaryPath}/aws-cli`, `${binaryPath}/aws`);
				break;
			case "windows":
				throw new NotImplementedError("Download aws-cli on Windows");
		}
	}

	public async exec(args?: any[], env?: any): Promise<string> {
		return super.exec([...args, "--output", "json", "--no-cli-pager"], { ...env, ...this._config });
	}

	public async listRegions(service: AwsService = AwsService.EC2): Promise<any[]> {
		const args = [service.toString(), "describe-regions"];
		const list: any = await this.execAws(args);
		return list.Regions.map((region: any) => region.RegionName);
	}

	public async listKeyPairs(service: AwsService = AwsService.EC2): Promise<string> {
		const args = [service.toString(), "describe-key-pairs"];
		const keys: any = await this.execAws(args);
		return keys.KeyPairs.map((key: any) => key.KeyName);
	}

	public async listMachineTypes(service: AwsService = AwsService.EC2): Promise<any[]> {
		const args = [
			service.toString(),
			"describe-instance-types",
			"--filters",
			"Name=current-generation,Values=true",
			"--query",
			"sort_by(InstanceTypes, &InstanceType)[].InstanceType",
		];
		return await this.execAws(args);
	}

	protected getDownloadUrl(): Promise<string> {
		switch (platform.osFamily) {
			case "linux":
				return Promise.resolve("https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip");
			case "darwin":
				return Promise.resolve("https://awscli.amazonaws.com/AWSCLIV2.pkg");
			case "windows":
				throw new NotImplementedError("Download aws-cli on Windows");
		}
	}
}
