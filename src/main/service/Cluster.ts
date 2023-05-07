import { Infrastructure } from "kos/model/Infrastructure";
import { KubeConfig } from "kos/configuration/KubeConfig";
import { Kubectl, KubectlResource } from "./Executables/Kubectl";
import { MachineNode } from "kos/model/MachineNode";

export interface StatusCondition {
	message: string;
	status: boolean;
}

export type ClusterOptions = {
	name: string;
	workerNode?: MachineNode;
	controlPlaneNode?: MachineNode;
	status: string;
	infrastructure: Infrastructure;
	conditions: StatusCondition[];
	managementClusterConfig: KubeConfig;
	managementClusterName: string;
};

export class Cluster {
	public name: string;
	public workerNode?: MachineNode;
	public controlPlaneNode?: MachineNode;
	public status: string;
	public conditions: StatusCondition[];
	public infrastructure: Infrastructure;
	public managementClusterName: string;

	private managementClusterConfig: KubeConfig;

	public constructor(options: ClusterOptions) {
		this.name = options.name;

		this.workerNode = options.workerNode;
		this.controlPlaneNode = options.controlPlaneNode;

		this.status = options.status;
		this.infrastructure = options.infrastructure;
		this.conditions = options.conditions;

		this.managementClusterName = options.managementClusterName;
		this.managementClusterConfig = options.managementClusterConfig;
	}

	public async delete(controller?: AbortController) {
		const kubectl = new Kubectl(this.managementClusterConfig, controller);
		await kubectl.delete({
			resource: KubectlResource.Cluster,
			name: this.name,
		});
	}

	public checkConditions(): boolean {
		for (const condition of this.conditions) {
			if (!condition.status) {
				return false;
			}
		}
		return true;
	}

	public toPlainObject(): any {
		return {
			name: this.name,
			workerNode: this.workerNode,
			controlPlaneNode: this.controlPlaneNode,
			status: this.status,
			conditions: this.conditions,
			infrastructure: this.infrastructure,
		};
	}
}
