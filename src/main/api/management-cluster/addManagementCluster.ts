import { ManagementCluster } from "kos/service/ManagementCluster";
import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";
import { KubeConfig } from "kos/configuration/KubeConfig";

async function checkExistence(managementClusterName: string) {
	try {
		new ManagementCluster(managementClusterName);
		return true;
	} catch (err) {
		if (err instanceof ClusterNotFoundError) {
			return false;
		} else {
			throw err;
		}
	}
}

export async function addManagementCluster(managementClusterName: string, kubeconfig: string, configuration?: any): Promise<any> {
	if (await checkExistence(managementClusterName)) {
		throw new TypeError("There is a management cluster has same name");
	}

	const config = new KubeConfig({
		content: kubeconfig,
		open: true,
	});

	try {
		const cluster = new ManagementCluster(managementClusterName, config);
		await cluster.load();

		if (cluster.supportedInfrastructures.length == 0) {
			throw new TypeError(`The cluster '${managementClusterName}' is not a management cluster`);
		}

		if (configuration) {
			for (const configField of Object.keys(configuration)) {
				cluster.configuration[configField] = configuration[configField];
			}
		}

		cluster.save();
	} catch (err) {
		throw err;
	} finally {
		config.delete();
	}
}
