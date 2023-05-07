import { taskManager } from "kos/service/Task/TaskManager";

export async function removeTask(id?: string): Promise<any> {
	taskManager.deleteTask(id);
}
