import { taskManager } from "kos/service/Task/TaskManager";

export async function getTask(id?: string): Promise<any> {
	if (!id) {
		return taskManager.getTasks().map((task) => task.toPlainObject());
	}

	const task = taskManager.getTask(id);
	if (!task) {
		throw new Error("Task doesn't exists");
	}

	return task.toPlainObject();
}
