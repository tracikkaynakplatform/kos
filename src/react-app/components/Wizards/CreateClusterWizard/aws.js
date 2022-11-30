import aws from "../../../api/aws";
import clusterConfig from "../../../api/clusterConfig";

export async function getAWSInfo(managementClusterName, region) {
	const credentials = await clusterConfig.getClusterConfiguration(
		managementClusterName
	);

	credentials = credentials.provider.AWS;
	return {
		regions: await aws.listRegions(credentials),
		sshKeys: await aws.listKeyPairs(
			credentials,
			"ec2",
			region ?? credentials.AWS_REGION
		),
	};
}
