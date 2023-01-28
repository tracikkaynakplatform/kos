import { writeFileSync } from "original-fs";
import tmp from "tmp";
import { KubeConfig } from "../k8s/KubeConfig";
import Kubectl from "../services/Kubectl";
import { exportHelper } from "./exportHelper";

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

export async function apply(config, yaml, ...args) {
	return new Promise(async (resolve, reject) => {
		let kctl = new Kubectl();
		try {
			await KubeConfig.tempConfig(kctl.config, config, async () => {
				const file = tmp.fileSync();
				writeFileSync(file.name, yaml, { encoding: "utf-8" });
				let result = await kctl.apply(file.name, ...args);
				file.removeCallback();
				resolve(result);
			});
		} catch (err) {
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

export function getControlPlaneVersionInfo({namespace="default", cluster_name}) {

}

export function getMachineDeploymentVersionInfo({namespace="default", cluster_name, resource_name}) {

}

export function getControlPlaneObject({namespace="default", cluster_name}) {

}

export function getMachineDeploymentObject({namespace="default", cluster_name, resource_name}) {

}

export async function getMachineDeployments({namespace="default", cluster_name}) {
	let machines = [];

	machines = await execKube(config, async (kctl) => {
		return await kctl.get(...args);
	});
		
	(async () => {
		machines = await kctl.get(ResourceType.Machine, "", {
			label: [
				`cluster.x-k8s.io/cluster-name=${clusterName}`,
				"!cluster.x-k8s.io/control-plane",
			],
			outputType: "json",
		});	
	})();


}

/////

export default [
	exportHelper("get", get),
	exportHelper("currentContext", currentContext),
	exportHelper("apply", apply),
	exportHelper("applyFile", applyFile),
	exportHelper("delete_", delete_),
];
