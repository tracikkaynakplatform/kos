import { Infrastructure } from "kos-fe/models/Infrastructure";

export async function getKeyPairs(managementClusterName: string, infrastructure: Infrastructure, region?: string): Promise<string[]> {
	return await window["managementClusterAPI"]["getKeyPairs"](managementClusterName, infrastructure, region);
}
