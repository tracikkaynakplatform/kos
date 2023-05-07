import { Navigate, createHashRouter } from "react-router-dom";
import {
	NotFoundPage,
	ManagementClustersPage,
	AddClusterPage,
	ManagementClusterDetailsPage,
	DownloadExecutablesPage,
	ManagementClusterConfigurationPage,
	TasksPage,
	CreateClusterPage,
	UpgradeClusterPage,
	UpdateClusterPage,
	SettingsPage,
} from "kos-fe/pages";

export const router = createHashRouter([
	{
		path: "/",
		element: <Navigate to="/download-executables" />,
	},
	{
		path: "/download-executables",
		element: <DownloadExecutablesPage />,
	},
	{
		path: "/management-clusters",
		element: <ManagementClustersPage />,
	},
	{
		path: "/management-clusters/:managementClusterName",
		element: <ManagementClusterDetailsPage />,
	},
	{
		path: "/management-clusters/add-cluster",
		element: <AddClusterPage />,
	},
	{
		path: "/management-clusters/:managementClusterName/:clusterName/upgrade",
		element: <UpgradeClusterPage />,
	},
	{
		path: "/management-clusters/:managementClusterName/:clusterName/update",
		element: <UpdateClusterPage />,
	},
	{
		path: "/management-clusters/:managementClusterName/create-cluster",
		element: <CreateClusterPage />,
	},
	{
		path: "/management-clusters/:managementClusterName/configuration",
		element: <ManagementClusterConfigurationPage />,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
	},
	{
		path: "/tasks",
		element: <TasksPage />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
