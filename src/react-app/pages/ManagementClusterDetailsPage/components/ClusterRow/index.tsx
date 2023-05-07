import { Chip, IconButton } from "kos-fe/components/UI";
import { InfrastructureIcon } from "kos-fe/models/InfrastructureIcon";
import { useViewModel } from "./viewmodel";
import { ClusterRowProps } from "./types";

export function ClusterRow(props: ClusterRowProps) {
	const viewModel = useViewModel(props.cluster);

	return (
		<tr className="odd:bg-gray-200 bg-gray-300 text-black dark:text-white">
			<td>{props.cluster.name}</td>
			<td>
				<Chip iconName={InfrastructureIcon[props.cluster.infrastructure]}>{props.cluster.infrastructure}</Chip>
			</td>
			<td className="flex gap-2 items-center">
				<div
					style={{
						backgroundColor: viewModel.statusColor,
					}}
					className="rounded-full w-[10px] h-[10px]"
				/>
				{props.cluster.status}
			</td>
			<td>
				<div className="flex gap-3">
					<IconButton onClick={viewModel.copyKubeconfig} disabled={!viewModel.isEditable} icon="material-symbols:content-copy" />
					<IconButton onClick={viewModel.updateCluster} disabled={!viewModel.isEditable} icon="mdi:pencil" />
					<IconButton onClick={viewModel.upgradeCluster} disabled={!viewModel.isEditable} icon="mdi:upload" />
					<IconButton onClick={viewModel.deleteCluster} disabled={!viewModel.isDeletable} icon="mdi:delete" />
				</div>
			</td>
		</tr>
	);
}
