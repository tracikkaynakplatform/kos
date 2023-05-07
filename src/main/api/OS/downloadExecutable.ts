import { DownloadExecutablesTask } from "kos/service/Task/DownloadExecutablesTask";
import { taskManager } from "kos/service/Task/TaskManager";

export async function downloadExecutable(): Promise<any> {
	const task = new DownloadExecutablesTask();
	taskManager.addTask(task);
	task.run();
	return task.toPlainObject();
}
