import { ManagementCluster } from "kos/service/ManagementCluster";
import { Infrastructure } from "kos/model/Infrastructure";
import { AwsCli } from "kos/service/Executables/AwsCli";
import { NotImplementedError } from "kos/error/NotImplementedError";

export async function getMachineTypes(managementClusterName: string, infrastructure: Infrastructure, region?: string): Promise<any> {
	const managementCluster = new ManagementCluster(managementClusterName);
	await managementCluster.load();

	switch (infrastructure) {
		case Infrastructure.AWS:
			const cli = new AwsCli({
				AWS_ACCESS_KEY_ID: managementCluster.configuration.AWS_ACCESS_KEY_ID,
				AWS_B64ENCODED_CREDENTIALS: managementCluster.configuration.AWS_B64ENCODED_CREDENTIALS,
				AWS_REGION: region ?? managementCluster.configuration.AWS_REGION ?? "eu-west-1",
				AWS_SECRET_ACCESS_KEY: managementCluster.configuration.AWS_SECRET_ACCESS_KEY,
			});
			return await cli.listMachineTypes();
	}
	throw new NotImplementedError();
}
