import { getTasks, removeTask } from "kos-fe/api/task";
import { Task, TaskStatus } from "kos-fe/models/Task";
import { useEffect, useState } from "react";

export function useViewModel() {
	const [tasks, setTasks] = useState<Task[]>([]);

	const refreshTasks = async () => {
		const taskList = await getTasks();
		for (const task of taskList) {
			if (task.status == TaskStatus.Finish) {
				await removeTask(task.id);
			}
		}
		setTasks(await getTasks());
	};

	useEffect(() => {
		refreshTasks();
		const interval = setInterval(refreshTasks, 2000);
		return () => clearInterval(interval);
	}, []);

	return {
		tasks,
	};
}
