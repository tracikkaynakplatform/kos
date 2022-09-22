import { ipcMain } from "electron";
import kubeConfigAPIs from "./kubeConfig";
import clusterConfigAPIs from "./clusterConfig";
import clusterctlAPIs from "./clusterctl";
import kubectlAPIs from "./kubectl";

export const apis = [
	{
		namespace: "kubeConfig",
		apis: kubeConfigAPIs,
	},
	{
		namespace: "clusterConfig",
		apis: clusterConfigAPIs,
	},
	{
		namespace: "kubectl",
		apis: kubectlAPIs,
	},
	{
		namespace: "clusterctl",
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
