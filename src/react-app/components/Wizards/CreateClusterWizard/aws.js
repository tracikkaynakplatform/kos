import { useSnackbar } from "notistack";
import { clusterConfig, aws, env, services } from "../../../api";
import { envVariables } from "../../../providers/aws";

export async function getAWSInfo(managementClusterName, region) {
	let credentials = await clusterConfig.getClusterConfiguration(
		managementClusterName
	);

	credentials = credentials.provider.AWS;

	for (let config of envVariables)
		if (credentials[config.name] == "")
			credentials[config.name] = await env.getEnv(config.name);

	return {
		regions: await aws.listRegions(credentials),
		sshKeys: await aws.listKeyPairs(
			credentials,
			"ec2",
			region ?? credentials.AWS_REGION
		),
	};
}
