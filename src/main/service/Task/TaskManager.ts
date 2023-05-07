import { Task } from "./Task";

export class TaskManager {
	private tasks: Task[] = [];
	private static instance: TaskManager | null;

	public constructor() {
		if (TaskManager.instance) {
			return TaskManager.instance;
		}

		TaskManager.instance = this;
	}

	public addTask(task: Task) {
		this.tasks.push(task);
	}

	public getTask(id?: string): Task | undefined {
		return this.tasks.find((task) => task.id == id);
	}

	public getTasks(): Task[] {
		return this.tasks;
	}

	public deleteTask(id: string) {
		this.tasks = this.tasks.filter((task) => task.id != id);
	}
}

export const taskManager = new TaskManager();
