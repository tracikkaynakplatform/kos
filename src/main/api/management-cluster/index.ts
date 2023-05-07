import { exportAPI } from "kos/api/exportAPI";
import { getManagementCluster } from "./getManagementCluster";
import { addManagementCluster } from "./addManagementCluster";
import { removeManagementCluster } from "./removeManagementCluster";
import { getRegionList } from "./getRegionList";
import { updateManagementCluster } from "./updateManagementCluster";
import { getKeyPairs } from "./getKeyPairs";
import { getMachineTypes } from "./getMachineTypes";
import { upgradeControlPlane } from "./upgradeControlPlane";
import { createCluster, deleteCluster, getClusterKubeconfig, getPossibleControlPlaneVersions, getPossibleWorkerVersions } from "./cluster";
import { upgradeWorker } from "./upgradeWorker";
import { updateControlPlane } from "./updateControlPlane";
import { updateWorker } from "./updateWorker";

const api = {
	namespace: "managementClusterAPI",
	functions: [
		exportAPI("getManagementCluster", getManagementCluster),
		exportAPI("addManagementCluster", addManagementCluster),
		exportAPI("removeManagementCluster", removeManagementCluster),
		exportAPI("updateManagementCluster", updateManagementCluster),
		exportAPI("getClusterKubeconfig", getClusterKubeconfig),
		exportAPI("deleteCluster", deleteCluster),
		exportAPI("createCluster", createCluster),
		exportAPI("getRegionList", getRegionList),
		exportAPI("getKeyPairs", getKeyPairs),
		exportAPI("getMachineTypes", getMachineTypes),
		exportAPI("getPossibleControlPlaneVersions", getPossibleControlPlaneVersions),
		exportAPI("getPossibleWorkerVersions", getPossibleWorkerVersions),
		exportAPI("upgradeControlPlane", upgradeControlPlane),
		exportAPI("upgradeWorker", upgradeWorker),
		exportAPI("updateControlPlane", updateControlPlane),
		exportAPI("updateWorker", updateWorker),
	],
};

export default api;
