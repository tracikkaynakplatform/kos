import { DashboardLayout } from "kos-fe/layout/DashboardLayout";
import { CircularProgress, Fab } from "kos-fe/components/UI";
import { ManagementClusterCard } from "./components/ManagementClusterCard";
import { useViewModel } from "./viewmodel";

export function ManagementClustersPage() {
	const { managementClusters, isLoading, navigateToAddCluster } = useViewModel();

	return (
		<DashboardLayout>
			<Fab onClick={navigateToAddCluster} horizontalAlign="right" verticalAlign="bottom" icon="fluent:apps-add-in-24-regular" />
			<div className="flex flex-col p-5 items-center gap-5 overflow-auto h-screen">
				{isLoading ? (
					<div className="w-[200px] h-[200px]">
						<CircularProgress text="Loading..." />
					</div>
				) : managementClusters.length > 0 ? (
					managementClusters.map((managementCluster, index) => <ManagementClusterCard key={index} {...managementCluster} />)
				) : (
					<div className="text-xl italic font-bol text-black dark:text-white">You didn't add any management clusters yet.</div>
				)}
			</div>
		</DashboardLayout>
	);
}
