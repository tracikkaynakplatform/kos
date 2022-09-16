import ManagementCluster from "../services/config/ManagementCluster";

async function getManagementClusters() {
	return await ManagementCluster.getManagementClusters();
}

export default [
	{
		name: "clusterConfig:getManagementClusters",
		action: getManagementClusters,
	},
];
