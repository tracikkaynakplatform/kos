import { ipcMain } from "electron";
import kubeConfigAPIs from "./kubeConfig";
import clusterConfigAPIs from "./clusterConfig";
import clusterctlAPIs from "./clusterctl";
import kubectlAPIs from "./kubectl";

export const apis = [
	{
		namespace: "kubeConfigAPI",
		apis: kubeConfigAPIs,
	},
	{
		namespace: "clusterConfigAPI",
		apis: clusterConfigAPIs,
	},
	{
		namespace: "kubectlAPI",
		apis: kubectlAPIs,
	},
	{
		namespace: "clusterctlAPI",
		apis: clusterctlAPIs,
	},
];

export function initApis() {
	apis.map((apiGroup) => {
		apiGroup.apis.map((api) =>
			ipcMain.handle(
				`${apiGroup.namespace}:${api.name}`,
				async (_, args) => await api(...args)
			)
		);
	});
}
