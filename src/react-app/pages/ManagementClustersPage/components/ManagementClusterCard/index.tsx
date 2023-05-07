import { Icon } from "@iconify/react";
import { InfrastructureIcon } from "kos-fe/models/InfrastructureIcon";
import { Chip } from "kos-fe/components/UI";
import { Cluster } from "kos-fe/models/Cluster";
import { Infrastructure } from "kos-fe/models/Infrastructure";
import { useViewModel } from "./viewmodel";
import { ManagementClusterCardProps } from "./types";

export function ManagementClusterCard({ name, clusters, supportedInfrastructures }: ManagementClusterCardProps) {
	const viewModel = useViewModel(name);

	return (
		<div
			className={`w-full flex flex-col border-2 border-gray-600 dark:border-gray-300 rounded-md shadow-xl bg-white dark:bg-gray-800 transition-all duration-200 gap-2 text-black dark:text-white ${
				viewModel.isExpanded ? "h-[220px]" : "h-[47px]"
			}`}
		>
			<div className="h-[250px] overflow-hidden">
				<div onClick={viewModel.toggleExpand} className="flex w-full p-2 justify-between hover:cursor-pointer">
					<div className="text-xl font-bol">{name}</div>
					<Icon
						fontSize="25px"
						icon={
							viewModel.isExpanded
								? "material-symbols:keyboard-arrow-down-rounded"
								: "material-symbols:keyboard-arrow-up-rounded"
						}
					/>
				</div>
				<hr className="border-t-black dark:border-t-gray-200" />
				<div className="p-2 flex flex-col gap-1">
					<div>Supported Infrastructures</div>
					<div className="flex gap-2 flex-wrap w-full h-[40px]">
						{supportedInfrastructures.map((infra: Infrastructure, index: number) => (
							<Chip key={index} iconName={InfrastructureIcon[infra]}>
								{infra}
							</Chip>
						)) || <div>There are not supported infrastructures</div>}
					</div>
				</div>
				<hr className="border-t-black dark:border-t-gray-200" />
				<div className="p-2 flex flex-col gap-1">
					<div>Clusters</div>
					<div className="flex gap-2 flex-wrap justify-between items-center pr-4 w-full h-[40px]">
						<div className="flex w-auto  gap-x-2">
							{clusters.map((cluster: Cluster, index: number) => (
								<Chip key={index} iconName={InfrastructureIcon[cluster.infrastructure]}>
									{cluster.name}
								</Chip>
							)) || <div className="italic">There are no clusters yet.</div>}
						</div>
						<div className="self-end gap-2 flex">
							<button className="w-[80px]" onClick={viewModel.openManagementClusterPage}>
								Details
							</button>
							<button className="w-[80px]" onClick={viewModel.removeManagementCluster}>
								Remove
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
