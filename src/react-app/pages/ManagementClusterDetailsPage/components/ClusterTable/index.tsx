import { Children } from "react";
import { ClusterTableProps } from "./types";

export function ClusterTable(props: ClusterTableProps) {
	return (
		<table className="[&>*>*>*]:p-5 w-full bg-gray-100 dark:bg-gray-600 rounded-lg shadow-lg overflow-hidden">
			<thead className="bg-gray-300 dark:bg-gray-800">
				<tr className="text-left text-black dark:text-white">
					<th>Name</th>
					<th>Infrastructure</th>
					<th>Status</th>
					<th>Operations</th>
				</tr>
			</thead>
			<tbody>
				{Children.count(props.children) == 0 ? (
					<tr className="text-black dark:text-white">
						<td>There are no clusters yet</td>
					</tr>
				) : (
					props.children
				)}
			</tbody>
		</table>
	);
}
