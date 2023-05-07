import { KubeConfig } from "kos/configuration/KubeConfig";
import { Kubectl } from "../Executables/Kubectl";
import { Task } from "./Task";
import { Clusterctl } from "kos/service/Executables/Clusterctl";
import { platform } from "../Platform";
import { AwsCli } from "../Executables/AwsCli";

export class DownloadExecutablesTask extends Task {
	public constructor() {
		super(4);
		this.description = "Download necessary clients";
	}

	protected async operate(): Promise<any> {
		this.message = "Downloading Kubectl";

		const kubectl = new Kubectl(new KubeConfig());
		if (!kubectl.isExists()) {
			await kubectl.download();
		}

		this.progress++;
		this.message = "Downloading Clusterctl";

		const clusterctl = new Clusterctl(new KubeConfig());
		if (!clusterctl.isExists()) {
			await clusterctl.download();
		}

		this.progress++;
		this.message = "Downloading aws-cli";
		if (platform.osFamily != "windows") {
			const aws = new AwsCli({ AWS_ACCESS_KEY_ID: "", AWS_B64ENCODED_CREDENTIALS: "", AWS_REGION: "", AWS_SECRET_ACCESS_KEY: "" });

			if (!aws.isExists()) {
				await aws.download();
			}
		}

		this.progress++;
		this.message = "Operation done";
	}
}
