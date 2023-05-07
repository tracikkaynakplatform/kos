import { Infrastructure } from "kos-fe/models/Infrastructure";

export async function getMachineTypes(managementClusterName: string, infrastructure: Infrastructure, region?: string): Promise<string[]> {
	return await window["managementClusterAPI"]["getMachineTypes"](managementClusterName, infrastructure, region);
}
