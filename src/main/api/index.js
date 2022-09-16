import { ipcMain } from "electron";
import clusterctlAPIs from "./clusterctl";
import kubeConfigAPIs from "./kubeConfig";
import kubectlAPIs from "./kubectl";
import providersAPIs from "./providers";
import clusterConfigAPIs from "./clusterConfig";

const apis = [
	...clusterctlAPIs,
	...kubeConfigAPIs,
	...kubectlAPIs,
	...providersAPIs,
	...clusterConfigAPIs,
];

export function initApis() {
	apis.map((api) => ipcMain.handle(api.name, api.action));
}
