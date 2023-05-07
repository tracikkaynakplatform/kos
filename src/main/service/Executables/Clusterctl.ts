import { ClientExecutable } from "./ClientExecutable";
import { platform } from "../Platform";
import { KubeConfig } from "kos/configuration/KubeConfig";
import { Infrastructure } from "kos/model/Infrastructure";

export type GenerateClusterOptions = {
	name: string;
	kubernetesVersion: string;
	controlPlaneCount: number;
	workerCount: number;
	infrastructure: Infrastructure;
	region?: string;
	sshKeyName?: string;
	controlPlaneMachineType?: string;
	workerMachineType?: string;
};

export class Clusterctl extends ClientExecutable {
	private _config: KubeConfig;

	public constructor(config: KubeConfig, abortController?: AbortController) {
		super("clusterctl", abortController);
		this._config = config;
	}

	/**
	 * Get kubeconfig of cluster which has name `clusterName`.
	 * @param clusterName Cluster name.
	 * @returns Kubeconfig content of cluster.
	 */
	public async getClusterKubeconfig(clusterName: string) {
		return await this.exec(["get", "kubeconfig", clusterName]);
	}

	/**
	 * Generate yaml file for cluster creation.
	 * @returns An yaml file content that applicable to management cluster.
	 */
	public async generateCluster(options: GenerateClusterOptions): Promise<string> {
		const args: string[] = [
			"generate",
			"cluster",
			options.name,
			"--infrastructure",
			options.infrastructure,
			"--kubernetes-version",
			options.kubernetesVersion,
			"--control-plane-machine-count",
			options.controlPlaneCount?.toString(),
			"--worker-machine-count",
			options.workerCount?.toString(),
		];

		const env: any = {};

		switch (options.infrastructure) {
			case Infrastructure.Docker:
				args.push("--flavor", "development");
				break;
			case Infrastructure.AWS:
				env.AWS_REGION = options.region;
				env.AWS_SSH_KEY_NAME = options.sshKeyName;
				env.AWS_CONTROL_PLANE_MACHINE_TYPE = options.controlPlaneMachineType;
				env.AWS_NODE_MACHINE_TYPE = options.workerMachineType;
				break;
		}

		return await this.exec(args, env);
	}

	public async exec(args?: any[], env?: any): Promise<string> {
		return await super.exec(args, { KUBECONFIG: this._config.path, ...env });
	}

	protected async getDownloadUrl(): Promise<string> {
		const response = await fetch("https://api.github.com/repos/kubernetes-sigs/cluster-api/releases/latest", {
			headers: {
				"User-Agent": "kos",
			},
		});

		if (response.ok) {
			const body = await response.json();
			const releaseInformation = body?.assets.find((item: any) => item.name.search(platform.osFamily) !== -1);

			if (releaseInformation) {
				return releaseInformation.browser_download_url;
			} else {
				throw new Error("Couldn't parse response");
			}
		}
	}
}
