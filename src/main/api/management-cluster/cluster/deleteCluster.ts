import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";
import { ManagementCluster } from "kos/service/ManagementCluster";
import { CreateClusterTask } from "kos/service/Task/CreateClusterTask";
import { taskManager } from "kos/service/Task/TaskManager";

export async function deleteCluster(managementClusterName: string, clusterName: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.load();

	const cluster = managementCluster.clusters.find((cls) => cls.name == clusterName);
	if (!cluster) {
		throw new ClusterNotFoundError(clusterName);
	}

	const createClusterTasks: CreateClusterTask[] = taskManager
		.getTasks()
		.filter((task) => task instanceof CreateClusterTask) as CreateClusterTask[];

	for (const task of createClusterTasks) {
		if (task.options.name == clusterName) {
			task.abort();
			taskManager.deleteTask(task.id);
		}
	}

	await cluster.delete();
}
