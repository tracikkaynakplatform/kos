import { ipcMain } from "electron";
import kubeConfigAPIs from "./kubeConfig";
import clusterConfigAPIs from "./clusterConfig";
import clusterctlAPIs from "./clusterctl";
import kubectlAPIs from "./kubectl";
import awsAPIs from "./aws";
import clusterawsadmAPIs from "./clusterawsadm";
import servicesAPIs from "./services";
import envAPIs from "./env";
import osAPIs from "./os";

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
	{
		namespace: "awsAPI",
		apis: awsAPIs,
	},
	{
		namespace: "clusterawsadmAPI",
		apis: clusterawsadmAPIs,
	},
	{
		namespace: "servicesAPI",
		apis: servicesAPIs,
	},
	{
		namespace: "envAPI",
		apis: envAPIs,
	},
	{
		namespace: "osAPI",
		apis: osAPIs,
	},
];

export function initApis() {
	apis.forEach((apiGroup) => {
		const apiNames = new Set();
		apiGroup.apis.forEach((api) => {
			if (!apiNames.has(api.name)) {
				ipcMain.handle(
					`${apiGroup.namespace}:${api.name}`,
					async (_, args) => await api.api(...args)
				);
				apiNames.add(api.name);
			}
		});
	});
}
