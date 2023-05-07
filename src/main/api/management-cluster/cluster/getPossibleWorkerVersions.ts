import { kubernetesVersions } from "kos/constants/KubernetesVersions";
import { ClusterNotFoundError } from "kos/error/ClusterNotFoundError";
import { Version } from "kos/model/Version";
import { ManagementCluster } from "kos/service/ManagementCluster";

export async function getPossibleWorkerVersions(managementClusterName: string, clusterName: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.load();

	const cluster = managementCluster.clusters.find((cluster) => cluster.name === clusterName);

	if (!cluster) {
		throw new ClusterNotFoundError(clusterName);
	}
	const possibleVersions = kubernetesVersions.filter((version) => {
		const versionObject = Version.fromString(version);

		return (
			versionObject.minor >= cluster.controlPlaneNode.version.minor - 1 &&
			versionObject.patch >= cluster.controlPlaneNode.version.patch - 2 &&
			version != cluster.workerNode.version.toString()
		);
	});

	return possibleVersions;
}
