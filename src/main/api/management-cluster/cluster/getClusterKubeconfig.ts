import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";
import { Clusterctl } from "kos/service/Executables/Clusterctl";
import { ManagementCluster } from "kos/service/ManagementCluster";

export async function getClusterKubeconfig(managementClusterName: string, clusterName: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.load();

	const cluster = managementCluster.clusters.find((cluster) => cluster.name === clusterName);

	if (!cluster) {
		throw new ClusterNotFoundError(clusterName);
	}

	const clusterctl = new Clusterctl(managementCluster.kubeconfig);
	const kubeconfig = await clusterctl.getClusterKubeconfig(clusterName);

	return kubeconfig;
}
