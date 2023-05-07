import { GenerateClusterOptions } from "kos/service/Executables/Clusterctl";
import { CreateClusterTask } from "kos/service/Task/CreateClusterTask";
import { taskManager } from "kos/service/Task/TaskManager";

export async function createCluster(managementClusterName: string, options: GenerateClusterOptions): Promise<any> {
	const task = new CreateClusterTask(managementClusterName, options);
	taskManager.addTask(task);
	task.run();
	return task.toPlainObject();
}
