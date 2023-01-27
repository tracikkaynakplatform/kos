import ManagementCluster from "../services/config/ManagementCluster";
import fs from "fs";
import { KubeConfig } from "../k8s/KubeConfig";
import { dirCheck, DIRS } from "../utils/dir-check";
import { exportHelper } from "./exportHelper";
import { loadManagementConfig } from "./kubeConfig";
import { ResourceType } from "../services/Kubectl";
import { execKube } from "./kubectl";
import { Task } from "../tasks/task";

export async function getManagementClusters() {
	return await ManagementCluster.getManagementClusters();
}

export async function getClusters(managementClusterConfig) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getClusters();
		}
	);
	return manCluster.clusters;
}

export async function getCluster(managementClusterConfig, clusterName) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getClusters();
		}
	);
	for (let cluster of manCluster.clusters)
		if (cluster.name === clusterName) return cluster;
}

export async function getSupportedProviders(managementClusterConfig) {
	const manCluster = new ManagementCluster();
	await KubeConfig.tempConfig(
		manCluster.config,
		managementClusterConfig,
		async () => {
			await manCluster.getSupportedProviders();
		}
	);
	return manCluster.supportedProviders;
}

export async function setClusterConfiguration(
	managementClusterName,
	credentials
) {
	const path = dirCheck(DIRS.managementClusters);
	const filePath = `${path}/${managementClusterName}.json`;
	fs.writeFileSync(filePath, JSON.stringify(credentials), {
		encoding: "utf-8",
	});
	fs.chmodSync(filePath, 0o600);
}

export async function getClusterConfiguration(managementClusterName) {
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".json"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) {
		if (file == managementClusterName) {
			return JSON.parse(
				fs.readFileSync(`${path}/${file}.json`, { encoding: "utf-8" })
			);
		}
	}
}

export async function isNameValid(managementClusterName) {
	// TODO: Add other validation methods
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".kubeconfig"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) if (file == managementClusterName) return false;
	return true;
}

export async function deleteCluster(managementClusterName) {
	const path = dirCheck(DIRS.managementClusters);
	const files = fs
		.readdirSync(path)
		.filter((x) => x.endsWith(".kubeconfig"))
		.map((x) => x.substring(0, x.lastIndexOf(".")));
	for (let file of files) {
		if (file === managementClusterName) {
			try {
				let credPath = `${path}/${file}.json`;
				fs.accessSync(credPath);
				fs.unlinkSync(credPath);
			} catch (err) {}
			fs.unlinkSync(`${path}/${file}.kubeconfig`);
		}
	}
}

export function upgradeWorkerNode({
	managementClusterName,
	clusterName,
	toVersion,
}) {
	if (this.task) {
		const task = this.task.toPlainObject();

		if (task.finish) {
			this.task = undefined;
		}

		return task;
	}
	this.task = new Task([
		async (t) => {
			t.changeStatus("Yönetim kümesi config dosyası alınıyor");
			return await loadManagementConfig(managementClusterName);
		},
		async (t, values) => {
			t.changeStatus("Kümenin makina bilgileri alınıyor");
			return await execKube(values[0], async (kctl) => {
				return await kctl.get(ResourceType.Machine, "", {
					label: [
						`cluster.x-k8s.io/cluster-name=${clusterName}`,
						"!cluster.x-k8s.io/control-plane",
					],
					outputType: "json",
				});
			});
		},
		async (t, values) => {
			t.changeStatus("MachineDeployment kaynakları bulunuyor");
			const machines = values[1]?.items;
			const deployments = new Set();
			for (const machine of machines) {
				const deploymentName =
					machine.metadata.labels["cluster.x-k8s.io/deployment-name"];
				deployments.add(deploymentName);
			}
			return deployments;
		},
		async (t, values) => {
			const deployments = values[2];
			for (const deployment of deployments) {
				t.changeStatus(`${deployment} yamalanıyor`);
				await execKube(
					values[0],
					async (kctl) =>
						await kctl.patch(
							ResourceType.MachineDeployment,
							deployment,
							{
								patch: {
									spec: {
										template: {
											spec: {
												version: toVersion,
											},
										},
									},
								},
								type: "merge",
							}
						)
				);
			}
		},
	]);

	this.task.run();
	return this.task.toPlainObject();
}

export function upgradeControlPlane({
	managementClusterName,
	clusterName,
	toVersion,
}) {
	if (this.task) {
		const task = this.task.toPlainObject();

		if (task.finish) {
			this.task = undefined;
		}

		return task;
	}

	this.task = new Task([
		async (t) => {
			t.changeStatus("Yönetim kümesi config dosyası alınıyor");
			return await loadManagementConfig(managementClusterName);
		},
		async (t, values) => {
			t.changeStatus("Cluster kaynağı alınıyor");
			return await execKube(
				values[0],
				async (kctl) =>
					await kctl.get(ResourceType.Cluster, clusterName, {
						outputType: "json",
					})
			);
		},
		async (t, values) => {
			t.changeStatus("Küme versiyonu yamalanıyor");
			return await execKube(
				values[0],
				async (kctl) =>
					await kctl.patch(
						ResourceType.KubeadmControlPlane,
						values[1].spec.controlPlaneRef.name,
						{
							patch: { spec: { version: toVersion } },
							type: "merge",
						}
					)
			);
		},
	]);

	this.task.run();
	return this.task.toPlainObject();
}

// *Plane = ControlPlane OR WorkloadPlane..
//
// get*Object and get*Version get_resource (input) object
// {
//	 cluster_name: "name of the cluster: eg: capi-quickstart",
//   resource_name: "name of the subject, if there is many of them. Null for controlplane.."
// }
//
// versioning_info object (returned and filtered):
// replicas: 3: number (last applied/set value..)
// version: v1.25.5: string (last applied/set value..)
// rolloutStrategy:   ## kept for future rollout progress testing..
//   rollingUpdate:
// 	  maxSurge: 1
//    maxUnavailable: 0
//   type: RollingUpdate
// status:
//   version: v1.24.9: string (min version for controlPlane, nil in workloadPlanes)
//   observedGeneration: 2: number (increased with each patch/apply)
//   readyReplicas: 3: number (will be 3 or 4, with 1 surge rollout deployment)
//   updatedReplicas: 3: number (will be 1,2,3 for a 3 node *Plane, ==replicas in a stable one)

// returns tristate: true, false or nil (unknown)
export function isRolloutInProgress(versioning_info) {
	if ( versioning_info.status.version && 
		   versioning_info.status.version != versioning_info.version) {

		// upgrading controlPlane:
		return true;
	}

	if ( versioning_info.status.updatedReplicas < versioning_info.replicas ) {
		// any rolling update on *Plane:
		return true;
	}

	if ( versioning_info.status.updatedReplicas == versioning_info.replicas &&
			 versioning_info.status.version && 
			 versioning_info.status.version == versioning_info.version
		 ) {
		
		// nothing on controlPlane
		return false;
	}

	// could not determine... 
	//   Still, WorkloadPlane is probably not in a rollout progress..
	return null;
}

export function getControlPlaneVersionInfo({cluster_name}) {

}

export function getMachineDeploymentVersionInfo({cluster_name, resource_name}) {

}

export function getControlPlaneObject({cluster_name}) {

}

export function getMachineDeploymentObject({cluster_name, resource_name}) {

}

export function getMachineDeployments({cluster_name}) {

}

/////



export default [
	exportHelper("getManagementClusters", getManagementClusters),
	exportHelper("getSupportedProviders", getSupportedProviders),
	exportHelper("getClusters", getClusters),
	exportHelper("getCluster", getCluster),
	exportHelper("getClusterConfiguration", getClusterConfiguration),
	exportHelper("setClusterConfiguration", setClusterConfiguration),
	exportHelper("isNameValid", isNameValid),
	exportHelper("deleteCluster", deleteCluster),
	exportHelper("upgradeControlPlane", upgradeControlPlane),
	exportHelper("upgradeWorkerNode", upgradeWorkerNode),
];
