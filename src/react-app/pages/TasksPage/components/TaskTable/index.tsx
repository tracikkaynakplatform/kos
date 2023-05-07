import { Children } from "react";
import { TaskTableProps } from "./types";

export function TaskTable(props: TaskTableProps) {
	return (
		<table className="[&>*>*>*]:p-5 w-full bg-gray-100 dark:bg-gray-600 shadow-lg overflow-hidden">
			<thead className="bg-gray-300 dark:bg-gray-800">
				<tr className="text-left text-black dark:text-white">
					<th>Description</th>
					<th>Current Status</th>
					<th>Progress</th>
					{/* <th>Cancel</th> */}
				</tr>
			</thead>
			<tbody>
				{Children.count(props.children) == 0 ? (
					<tr className="text-black dark:text-white">
						<td>There are not any task</td>
					</tr>
				) : (
					props.children
				)}
			</tbody>
		</table>
	);
}
