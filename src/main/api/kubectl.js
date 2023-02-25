import { writeFileSync } from "original-fs";
import tmp from "tmp";
import { KubeConfig } from "../k8s/KubeConfig";
import Kubectl, { ResourceType } from "../services/Kubectl";
import { exportHelper } from "./exportHelper";
import { Task } from "../tasks/task";
import { patches } from "../kubernetesVersions";

export async function execKube(config, callback) {
	let result = null;
	let kctl = new Kubectl();

	await KubeConfig.tempConfig(kctl.config, config, async () => {
		result = await callback(kctl);
	});
	return result;
}

export async function get(config, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.get(...args);
	});
}

export async function delete_(config, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.delete_(...args);
	});
}

export async function currentContext(config) {
	return await execKube(config, async (kctl) => {
		return await kctl.currentContext();
	});
}

export async function applyFile(config, file, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.apply(file, ...args);
	});
}

export async function patch(config, ...args) {
	return await execKube(config, async (kctl) => {
		return await kctl.patch(...args);
	});
}


export async function apply(config, yaml, ...args) {
	return new Promise(async (resolve, reject) => {
		let kctl = new Kubectl();
		const file = tmp.fileSync();
		try {
			await KubeConfig.tempConfig(kctl.config, config, async () => {
				writeFileSync(file.name, yaml, { encoding: "utf-8" });
				let result = await kctl.apply(file.name, ...args);
				file.removeCallback();
				resolve(result);
			});
		} catch (err) {
			file.removeCallback();
			reject(err);
		}
	});
}

// *Plane = ControlPlane OR WorkloadPlane..
//
// get*Object and get*Version get_resource (input) object
// {
//   namespace: "the name of the namespace, for namespaced resources."
//	 cluster_name: "name of the cluster: eg: capi-quickstart",
//   resource_name: "name of the subject, if there is many of them. Null for controlplane.."
// }
//
// spec:
//   versioning_info object (returned and filtered):
//   replicas: 3: number (last applied/set value..)
//   version: v1.25.5: string (last applied/set value..)
//   rolloutStrategy:   ## kept for future rollout progress testing..
//     rollingUpdate:
// 	    maxSurge: 1
//      maxUnavailable: 0
//     type: RollingUpdate
// status:
//   version: v1.24.9: string (min version for controlPlane, nil in workloadPlanes)
//   observedGeneration: 2: number (increased with each patch/apply)
//   readyReplicas: 3: number (will be 3 or 4, with 1 surge rollout deployment)
//   updatedReplicas: 3: number (will be 1,2,3 for a 3 node *Plane, ==replicas in a stable one)

// returns tristate: true, false or nil (unknown)
//   returns true, if it is (almost) sure a rollout is in progress.
//   a null return may also mean a no-rollout (esp. for machinedeployments).
export function isRolloutInProgress(versioning_info) {
	if (
		versioning_info.status.version &&
		versioning_info.status.version != versioning_info.spec.version
	) {
		// upgrading controlPlane:
		return true;
	}

	if (
		versioning_info.status.updatedReplicas < versioning_info.spec.replicas
	) {
		// any rolling update on *Plane:
		return true;
	}

	if (
		versioning_info.status.updatedReplicas ==
			versioning_info.spec.replicas &&
		versioning_info.status.version &&
		versioning_info.status.version == versioning_info.spec.version
	) {
		// nothing on controlPlane
		return false;
	}

	// could not determine...
	//   Still, WorkloadPlane is probably not in a rollout progress..
	return null;
}

export async function getControlPlaneVersionInfo(
	config,
	{ namespace = "default", cluster_name }
) {
	let resource_name = await get(config, "Cluster", cluster_name, {
		outputType: "json",
	});
	resource_name = resource_name.spec.controlPlaneRef.name;

	let resource = await get(config, "KubeadmControlPlane", resource_name, {
		outputType: "json",
	});

	return resource;
}

export async function getMachineDeploymentVersionInfo(
	config,
	{ namespace = "default", resource_name }
) {
	let resource = await get(config, "MachineDeployment", resource_name, {
		outputType: "json",
	});

	return resource;
}

export async function getMachineDeployments(
	config,
	{ namespace = "default", cluster_name }
) {
	let machines = [];

	// TODO: namespace is not used, yet..

	let machinesStr = await get(config, "MachineDeployment", "", {
		outputType: `jsonpath='{$.items[?(@.spec.clusterName=="${cluster_name}")].metadata.name}'`,
	});

	machines = machinesStr.split(" ");
	machines = machines.map((x) => x.slice(1, -1));

	return machines;
}

function filterVersions(supportedMinors, version) {
	const versions = [];
	for (const v of supportedMinors) {
		if (v < 24) continue;
		if (patches[v]) {
			for (const patch of patches[v]) {
				const versionText = `${version[0]}.${v}.${patch}`;
				if (version.join(".") != versionText)
					versions.push(versionText);
			}
		}
	}
	return versions;
}

export async function getPossibleWorkerVersions(config, clusterName) {
	const info = await getControlPlaneVersionInfo(config, {
		cluster_name: clusterName,
	});
	const machines = await getMachineDeployments(config, {
		cluster_name: clusterName,
	});
	const machineDeployment = await getMachineDeploymentVersionInfo(config, {
		resource_name: machines[0],
	});

	const version = info?.spec.version.split(".");
	return {
		current: machineDeployment?.spec.template.spec.version,
		versions: filterVersions(
			[
				parseInt(version[1]),
				parseInt(version[1]) - 1,
				parseInt(version[1]) - 2,
			],
			version
		),
	};
}

export async function getPossibleControlPlaneVersions(config, clusterName) {
	const machines = await getMachineDeployments(config, {
		cluster_name: clusterName,
	});
	const info = await getMachineDeploymentVersionInfo(config, {
		resource_name: machines[0],
	});
	const controlPlane = await getControlPlaneVersionInfo(config, {
		cluster_name: clusterName,
	});

	const version = info?.spec.template.spec.version.split(".");
	return {
		current: controlPlane?.spec.version,
		versions: filterVersions(
			[
				parseInt(version[1]),
				parseInt(version[1]) + 1,
				parseInt(version[1]) + 2,
			],
			version
		),
	};
}

export default [
	exportHelper("get", get),
	exportHelper("currentContext", currentContext),
	exportHelper("apply", apply),
	exportHelper("patch", patch),
	exportHelper("applyFile", applyFile),
	exportHelper("delete_", delete_),

	exportHelper("getMachineDeployments", getMachineDeployments),
	exportHelper(
		"getMachineDeploymentVersionInfo",
		getMachineDeploymentVersionInfo
	),
	exportHelper("getControlPlaneVersionInfo", getControlPlaneVersionInfo),
	exportHelper("isRolloutInProgress", isRolloutInProgress),

	exportHelper(
		"getPossibleControlPlaneVersions",
		getPossibleControlPlaneVersions
	),
	exportHelper("getPossibleWorkerVersions", getPossibleWorkerVersions),
];
