import { Task } from "kos-fe/models/Task";
import { CreateClusterParams } from "kos-fe/models/api/CreateClusterParams";

export async function createCluster(managementClusterName: string, clusterName: string, params: CreateClusterParams): Promise<Task> {
	return await window["managementClusterAPI"]["createCluster"](managementClusterName, {
		name: clusterName,
		...params,
	});
}
