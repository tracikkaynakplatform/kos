import { Task } from "./Task";
import { Clusterctl, GenerateClusterOptions } from "kos/service/Executables/Clusterctl";
import { ManagementCluster } from "kos/service/ManagementCluster";
import { Kubectl } from "kos/service/Executables/Kubectl";
import { Cluster } from "../Cluster";
import { KubeConfig } from "kos/configuration/KubeConfig";
import { Logger } from "kos-shared/Logger";

export class CreateClusterTask extends Task {
	public options: GenerateClusterOptions;
	private _managementClusterName: string;

	public constructor(managementClusterName: string, options: GenerateClusterOptions) {
		super(7);
		this.options = options;
		this._managementClusterName = managementClusterName;
		this.description = `Create cluster (${options.name}) on ${managementClusterName}`;
	}

	protected async operate(): Promise<any> {
		const managementCluster = new ManagementCluster(this._managementClusterName);
		await managementCluster.createCluster(this.options, {
			controller: this.controller,
			progress: (message: string) => {
				this.progress++;
				this.message = message;
			},
		});

		this.progress++;
		this.message = "Waiting the cluster to be ready for CNI installation";
		let cluster: Cluster;
		while (true) {
			try {
				await managementCluster.load(this.controller);
				cluster = managementCluster.clusters.find((x) => x.name == this.options.name);
				if (cluster.checkConditions()) {
					break;
				}
			} catch (err) {
				if (err.name === "AbortError") {
					// TODO: Should we skip CNI installation, or revert the progress (delete cluster).
					this.progress += 2;
					this.message = "Done";
					return;
				}
				throw err;
			}
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}

		this.progress++;
		this.message = "Installing Calico as CNI";

		const clusterctl = new Clusterctl(managementCluster.kubeconfig, this.controller);
		const kubeconfigContent = await clusterctl.getClusterKubeconfig(cluster.name);
		const kubeconfig = new KubeConfig({
			content: kubeconfigContent,
			open: true,
		});
		try {
			const kubectl = new Kubectl(kubeconfig, this.controller);
			await kubectl.apply({
				path: "https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/calico.yaml",
			});
			this.progress++;
			this.message = "Done";
		} catch (err) {
			Logger.error(err);
			throw err;
		} finally {
			kubeconfig.delete();
		}

		// TODO: Should we wait to be ensure calico is installed?
	}
}
