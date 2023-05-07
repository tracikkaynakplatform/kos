import { Task } from "kos-fe/models/Task";

export async function getTask(id?: string): Promise<Task> {
	return await window["taskAPI"]["getTask"](id);
}

export async function getTasks(): Promise<Task[]> {
	return await window["taskAPI"]["getTask"]();
}
