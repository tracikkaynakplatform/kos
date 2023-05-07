import { DashboardLayout, ReversibleLayout } from "kos-fe/layout";
import { CircularProgress, IconButton } from "kos-fe/components/UI";
import { Cluster } from "kos-fe/models/Cluster";
import { Fab } from "kos-fe/components/UI/Fab";
import { ClusterTable, ClusterRow } from "./components/";
import { useViewModel } from "./viewmodel";

export function ManagementClusterDetailsPage() {
	const viewModel = useViewModel();

	return (
		<DashboardLayout>
			<ReversibleLayout>
				<Fab
					onClick={viewModel.openCreateClusterWizard}
					horizontalAlign="right"
					verticalAlign="bottom"
					icon="mdi:vector-square-add"
				/>
				<div className="h-[100px]" />
				<div className="w-full h-screen p-2 flex justify-start items-start flex-col gap-y-4 text-gray-700 dark:text-white">
					<div className="w-full min-h-[4rem] flex justify-between items-center px-4">
						<span className="text-2xl font-bold ">{viewModel.managementClusterName}</span>
						<div className="flex flex-row gap-x-4"></div>
					</div>
					<div className="w-full flex justify-between items-center px-4">
						<span>Workload Clusters</span>
						<IconButton onClick={viewModel.openConfiguration} icon="grommet-icons:document-config">
							Configuration
						</IconButton>
					</div>
					{viewModel.isLoading ? (
						<div className="w-full h-full flex items-center justify-center">
							<div className="w-[150px] h-[150px]">
								<CircularProgress color="yellowgreen" text="Loading..." />
							</div>
						</div>
					) : (
						<ClusterTable>
							{viewModel.clusters.map((cluster: Cluster, index: number) => (
								<ClusterRow cluster={cluster} key={index} />
							))}
						</ClusterTable>
					)}
				</div>
			</ReversibleLayout>
		</DashboardLayout>
	);
}
