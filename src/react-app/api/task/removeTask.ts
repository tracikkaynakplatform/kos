import { Task } from "kos-fe/models/Task";

export async function removeTask(id?: string): Promise<Task> {
	return await window["taskAPI"]["removeTask"](id);
}
