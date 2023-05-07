export type SidebarMenuItem = {
	label: string;
	path: string;
	icon: string;
};

export const menuItems: SidebarMenuItem[] = [
	{
		label: "Management Clusters",
		path: "/management-clusters",
		icon: "grommet-icons:cluster",
	},
	{
		label: "Background Tasks",
		path: "/tasks",
		icon: "fluent-mdl2:process-meta-task",
	},
	{
		label: "Settings",
		path: "/settings",
		icon: "mdi:settings",
	},
];
