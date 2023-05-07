import { taskManager } from "kos/service/Task/TaskManager";

export async function abortTask(id?: string): Promise<any> {
	const task = taskManager.getTask(id);
	if (!task) {
		throw new Error("Task doesn't exists");
	}
	task.abort();
}
