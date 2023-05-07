import { Task } from "kos-fe/models/Task";

export async function abortTask(id?: string): Promise<Task> {
	return await window["taskAPI"]["abortTask"](id);
}
