import { Infrastructure } from "./Infrastructure";
import { MachineNode } from "./MachineNode";

export interface StatusCondition {
	message: string;
	status: boolean;
}

export interface Cluster {
	name: string;
	workerNode?: MachineNode;
	controlPlaneNode?: MachineNode;
	status: string;
	infrastructure: Infrastructure;
	conditions: StatusCondition[];
}
