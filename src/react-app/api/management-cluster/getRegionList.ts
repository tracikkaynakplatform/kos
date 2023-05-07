import { Infrastructure } from "kos-fe/models/Infrastructure";

export async function getRegionList(managementClusterName: string, infrastructure: Infrastructure): Promise<string[]> {
	return await window["managementClusterAPI"]["getRegionList"](managementClusterName, infrastructure);
}
