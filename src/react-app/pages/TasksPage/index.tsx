import { DashboardLayout } from "kos-fe/layout";
import { TaskRow, TaskTable } from "./components";
import { useViewModel } from "./viewmodel";
import { TaskStatus } from "kos-fe/models/Task";

export function TasksPage() {
	const viewModel = useViewModel();

	return (
		<DashboardLayout>
			<TaskTable>
				{viewModel.tasks.map((task, index) => (
					<TaskRow key={index} task={task} />
				))}
			</TaskTable>
		</DashboardLayout>
	);
}
