import { ipcMain } from "electron";
import kubeConfig from "../k8s/KubeConfig";
import kindConfig, { KindSteps } from "../k8s/KindConfig";
import clusterctlConfig from "../k8s/ClusterctlConfig";
import kubectlService from "../services/Kubectl";

const apis = [
	// Kubectl API
	{
		name: "kubectl:check",
		action: () => kubectlService.check(),
	},
	{
		name: "kubectl:download",
		action: async (_) => {
			try {
				await kubectlService.download();
				return true;
			} catch (err) {
				return false;
			}
		},
	},
	{
		name: "kubectl:get",
		action: (_, resourceType, data) => {
			kubeConfig.loadFromString(data);
			return kubeConfig.get(resourceType);
		},
	},
	{
		name: "kubeConfig:loadFromDefault",
		action: () => {
			kubeConfig.loadFromDefault();
			return kubeConfig.config;
		},
	},

	// Clusterctl API
	{
		name: "clusterctl:generate",
		action: async (_, config) => {
			clusterctlConfig.setManagementClusterConfig(
				config.managementConfig
			);
			console.log(
				await clusterctlConfig.generateCluster(
					config.name,
					config.kubernetesVersion,
					config.masterCount,
					config.workerCount,
					config.isDocker
				)
			);
		},
	},

	// Provider API
	{
		name: "providers:getProviders",
		action: (_, data) => {
			kubeConfig.loadFromString(data);

			let providers = [];
			let pods = kubeConfig.get("pods", "-A"); // --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' -A

			for (let i of pods.items) {
				switch (i.metadata.namespace) {
					case "capd-system":
						providers.push("docker");
						break;
					case "capdo-system":
						providers.push("digitalocean");
						break;
				}
			}
			return providers;
		},
	},
];

export function initApis() {
	apis.map((api) => ipcMain.handle(api.name, api.action));
}
