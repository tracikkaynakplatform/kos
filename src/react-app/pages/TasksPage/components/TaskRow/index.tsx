import { IconButton } from "kos-fe/components/UI";
import { TaskCardProps } from "./types";
import { TaskStatus } from "kos-fe/models/Task";

export function TaskRow(props: TaskCardProps) {
	return (
		<tr className="dark:odd:bg-gray-600 odd:bg-gray-200 dark:bg-gray-500 bg-gray-300 text-black dark:text-white">
			<td>{props.task.description}</td>
			<td>{props.task.status == TaskStatus.Running ? props.task.message : props.task.status}</td>
			<td>{((props.task.progress / props.task.finishProgress) * 100).toFixed(0)} %</td>
			{/* <td className="flex gap-3">
				<IconButton icon="material-symbols:cancel-outline-rounded" />
			</td> */}
		</tr>
	);
}
