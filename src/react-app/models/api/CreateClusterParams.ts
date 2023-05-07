import { Infrastructure } from "kos-fe/models/Infrastructure";

export interface CreateClusterParams {
	kubernetesVersion: string;
	controlPlaneCount: number;
	workerCount: number;
	infrastructure: Infrastructure;
	region?: string;
	sshKeyName?: string;
	controlPlaneMachineType?: string;
	workerMachineType?: string;
}
