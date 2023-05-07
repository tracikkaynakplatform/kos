import { Infrastructure } from "kos/model/Infrastructure";
import { Cluster } from "./Cluster";
import { KubeConfig } from "kos/configuration/KubeConfig";
import { Directories, Environment } from "./Environment";
import { Kubectl, KubectlResource } from "kos/service/Executables/Kubectl";
import { accessSync, constants, readFileSync, readdirSync, rmSync, writeFileSync } from "original-fs";
import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";
import { KubeconfigNotFoundError } from "kos/error/KubeconfigNotFoundError";
import { Logger } from "kos-shared/Logger";
import { Clusterctl, GenerateClusterOptions } from "./Executables/Clusterctl";
import { MachineNode } from "kos/model/MachineNode";
import { Version } from "kos/model/Version";

type ClusterInformation = {
	workerNode?: MachineNode;
	controlPlaneNode?: MachineNode;
};

export type AsyncOperationOptions = {
	controller?: AbortController;
	progress?: (message: string) => void;
};

export interface Configuration {
	[configurationName: string]: string;
}

export class ManagementCluster {
	public name: string;
	public supportedInfrastructures: Infrastructure[] = [];
	public clusters: Cluster[] = [];
	public kubeconfig: KubeConfig;
	public configuration: Configuration = {};

	private configurationPath: string;

	public constructor(name: string, kubeconfig?: KubeConfig) {
		this.name = name;
		try {
			this.kubeconfig =
				kubeconfig ??
				new KubeConfig({
					path: `${Environment.checkDirectory(Directories.ManagementClusterConfig)}/${this.name}.kubeconfig`,
					open: true,
				});
			this.configurationPath = `${Environment.checkDirectory(Directories.ManagementClusterConfig)}/${this.name}.json`;
		} catch (err) {
			if (err instanceof KubeconfigNotFoundError) {
				throw new ClusterNotFoundError(this.name);
			} else {
				throw err;
			}
		}
	}

	private loadInfrastructures(pods: any) {
		pods.items.forEach((pod: any) => {
			switch (pod.metadata.namespace) {
				case "capd-system":
					this.supportedInfrastructures.push(Infrastructure.Docker);
					break;
				case "capa-system":
					this.supportedInfrastructures.push(Infrastructure.AWS);
					break;
			}
		});
	}

	private async loadClusterInformation(infrastructure: Infrastructure, cluster: any, kubectl: Kubectl): Promise<ClusterInformation> {
		try {
			switch (infrastructure) {
				case Infrastructure.AWS:
					const kubeadmControlPlane = await kubectl.get({
						resource: KubectlResource.KubeadmControlPlane,
						name: cluster.spec.controlPlaneRef.name,
					});
					const deployment = await kubectl.get({
						resource: KubectlResource.MachineDeployment,
						options: {
							label: `cluster.x-k8s.io/cluster-name=${cluster.metadata.name}`,
						},
					});
					return {
						controlPlaneNode: {
							name: kubeadmControlPlane.metadata.name,
							count: kubeadmControlPlane.spec.replicas,
							version: Version.fromString(kubeadmControlPlane.spec.version),
							instanceType: "",
						},
						workerNode: {
							name: deployment.items[0].metadata.name,
							count: deployment.items[0].spec.replicas,
							version: Version.fromString(deployment.items[0].spec.template.spec.version),
							instanceType: "",
						},
					};
			}
			return {};
		} catch (err) {
			Logger.error(err);
			return {};
		}
	}

	private async loadClusters(clusters: any, kubectl: Kubectl) {
		this.clusters = await Promise.all(
			clusters.items.map(async (cluster: any) => {
				let infrastructure: Infrastructure = Infrastructure.Unknown;
				let clusterInformation: ClusterInformation;

				switch (cluster.spec.infrastructureRef.kind) {
					case "DockerCluster":
						infrastructure = Infrastructure.Docker;
						break;
					case "AWSCluster":
						infrastructure = Infrastructure.AWS;
						break;
					case "AWSManagedCluster":
						infrastructure = Infrastructure.AWS_EKS;
						break;
				}

				clusterInformation = await this.loadClusterInformation(infrastructure, cluster, kubectl);

				return new Cluster({
					name: cluster.metadata.name,
					controlPlaneNode: clusterInformation?.controlPlaneNode,
					workerNode: clusterInformation?.workerNode,
					status: cluster.status.phase,
					conditions: cluster.status.conditions.map((condition: any) => ({
						message: condition.message,
						status: condition.status == "True",
					})),
					infrastructure: infrastructure,
					managementClusterConfig: this.kubeconfig,
					managementClusterName: this.name,
				});
			})
		);
	}

	private loadConfiguration() {
		try {
			accessSync(this.configurationPath, constants.F_OK);
		} catch (err) {
			this.configuration = {};
			return;
		}

		const content = readFileSync(this.configurationPath, { encoding: "utf-8" });
		this.configuration = JSON.parse(content);
	}

	public toPlainObject(): any {
		return {
			name: this.name,
			supportedInfrastructures: this.supportedInfrastructures,
			clusters: this.clusters.map((cluster) => cluster.toPlainObject()),
			configuration: this.configuration,
		};
	}

	public async createCluster(clusterOptions: GenerateClusterOptions, { controller, progress }: AsyncOperationOptions) {
		const clusterctl = new Clusterctl(this.kubeconfig, controller);

		progress?.("Generating yaml file");
		const yaml = await clusterctl.generateCluster(clusterOptions);

		progress?.("Applying yaml file to management cluster");
		const kubectl = new Kubectl(this.kubeconfig, controller);
		await kubectl.apply({
			content: yaml,
		});

		progress?.("Done");
	}

	public async upgradeControlPlane(clusterName: string, newVersion: string, controller?: AbortController) {
		const kubectl = new Kubectl(this.kubeconfig, controller);
		const clusterResource = await kubectl.get({
			name: clusterName,
			resource: KubectlResource.Cluster,
		});

		await kubectl.patch({
			resource: KubectlResource.KubeadmControlPlane,
			name: clusterResource.spec.controlPlaneRef.name,
			patch: {
				spec: { version: newVersion },
			},
			type: "merge",
		});
	}

	public async upgradeWorker(clusterName: string, newVersion: string, controller?: AbortController) {
		const kubectl = new Kubectl(this.kubeconfig, controller);

		const machineDeployment = await kubectl.get({
			resource: KubectlResource.MachineDeployment,
			options: {
				label: `cluster.x-k8s.io/cluster-name=${clusterName}`,
			},
		});

		await kubectl.patch({
			resource: KubectlResource.MachineDeployment,
			name: machineDeployment.items[0].metadata.name,
			patch: { spec: { template: { spec: { version: newVersion } } } },
			type: "merge",
		});
	}

	public async updateWorker(clusterName: string, newReplicaCount: number, controller?: AbortController) {
		const kubectl = new Kubectl(this.kubeconfig, controller);
		const machineDeployment = await kubectl.get({
			resource: KubectlResource.MachineDeployment,
			options: {
				label: `cluster.x-k8s.io/cluster-name=${clusterName}`,
			},
		});

		await kubectl.patch({
			resource: KubectlResource.MachineDeployment,
			name: machineDeployment.items[0].metadata.name,
			patch: { spec: { replicas: newReplicaCount } },
			type: "merge",
		});
	}

	public async updateControlPlane(clusterName: string, newReplicaCount: number, controller?: AbortController) {
		const kubectl = new Kubectl(this.kubeconfig, controller);
		const clusterResource = await kubectl.get({
			name: clusterName,
			resource: KubectlResource.Cluster,
		});

		await kubectl.patch({
			resource: KubectlResource.KubeadmControlPlane,
			name: clusterResource.spec.controlPlaneRef.name,
			patch: {
				spec: { replicas: newReplicaCount },
			},
			type: "merge",
		});
	}

	/**
	 * Saves cluster kubeconfig to configuration directory.
	 */
	public save() {
		new KubeConfig({
			path: `${Environment.checkDirectory(Directories.ManagementClusterConfig)}/${this.name}.kubeconfig`,
			content: this.kubeconfig.content,
			open: true,
		});
		writeFileSync(this.configurationPath, JSON.stringify(this.configuration), { encoding: "utf-8", mode: 0o600 });
	}

	/**
	 * Removes management cluster kubeconfig and configuration.
	 */
	public remove() {
		rmSync(`${Environment.checkDirectory(Directories.ManagementClusterConfig)}/${this.name}.kubeconfig`, { force: true });
		rmSync(this.configurationPath, { force: true });
	}

	/**
	 * Loads cluster information.
	 */
	public async load(abortController?: AbortController) {
		try {
			const kubectl = new Kubectl(this.kubeconfig, abortController);
			const pods = await kubectl.get({ resource: KubectlResource.Pod, options: { allNamespaces: true } });
			const clusters = await kubectl.get({ resource: KubectlResource.Cluster });

			this.loadInfrastructures(pods);
			await this.loadClusters(clusters, kubectl);
			this.loadConfiguration();
		} catch (err) {
			if (err instanceof KubeconfigNotFoundError) {
				throw new ClusterNotFoundError(this.name);
			} else {
				throw err;
			}
		}
	}

	public static async getManagementClusters(): Promise<ManagementCluster[]> {
		const clusters: ManagementCluster[] = [];
		const files = readdirSync(Environment.checkDirectory(Directories.ManagementClusterConfig));
		const kubeconfigFiles = files.filter((file: string) => file.endsWith(".kubeconfig"));
		const clusterNames = kubeconfigFiles.map((kubeconfigFile: string) => kubeconfigFile.substring(0, kubeconfigFile.lastIndexOf(".")));

		for (const clusterName of clusterNames) {
			const cluster = new ManagementCluster(clusterName);
			try {
				await cluster.load();
				clusters.push(cluster);
			} catch (err) {
				Logger.error(`Error when loading cluster ${clusterName}`);
				Logger.error(err);
			}
		}
		return clusters;
	}
}
