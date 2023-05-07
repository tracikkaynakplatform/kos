import { getManagementCluster } from "kos-fe/api/management-cluster";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { Cluster } from "kos-fe/models/Cluster";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useViewModel() {
	const { managementClusterName } = useParams();
	const [clusters, setClusters] = useState<Cluster[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	const refreshClusters = async () => {
		const managementCluster = await getManagementCluster(managementClusterName);
		setClusters(managementCluster.clusters);
	};

	const openConfiguration = () => navigate(`/management-clusters/${managementClusterName}/configuration`);

	const openCreateClusterWizard = () => navigate(`/management-clusters/${managementClusterName}/create-cluster`);

	useComponentDidMount(() => {
		modalErrorHandler(refreshClusters, null, () => setIsLoading(false));
	});

	useEffect(() => {
		const interval = setInterval(refreshClusters, 5000);
		return () => clearInterval(interval);
	}, []);

	return {
		isLoading,
		clusters,
		managementClusterName,
		openConfiguration,
		openCreateClusterWizard,
	};
}
