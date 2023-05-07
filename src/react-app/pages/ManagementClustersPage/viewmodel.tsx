import { getManagementClusters } from "kos-fe/api/management-cluster";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { ManagementCluster } from "kos-fe/models/ManagementCluster";
import { Logger } from "kos-shared/Logger";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useViewModel() {
	const [managementClusters, setManagementClusters] = useState<ManagementCluster[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	useComponentDidMount(async () => {
		try {
			const clusters = await getManagementClusters();
			setManagementClusters(clusters);
		} catch (err) {
			Logger.error(err);
		} finally {
			setIsLoading(false);
		}
	});

	const navigateToAddCluster = () => navigate("/management-clusters/add-cluster");

	return {
		managementClusters,
		isLoading,
		navigateToAddCluster,
	};
}
