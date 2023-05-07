import { ManagementCluster } from "kos/service/ManagementCluster";

export async function updateManagementCluster(managementClusterName: string, kubeconfig?: string, configuration?: any): Promise<any> {
	const cluster = new ManagementCluster(managementClusterName);
	await cluster.load();

	if (kubeconfig && cluster.kubeconfig.content != kubeconfig) {
		cluster.kubeconfig.content = kubeconfig;
	}

	if (configuration) {
		for (const configField of Object.keys(configuration)) {
			cluster.configuration[configField] = configuration[configField];
		}
	}

	await cluster.save();
}
