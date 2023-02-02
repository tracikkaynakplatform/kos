// import { Clusterawsadm } from "../../../main/services/clusterawsadm";
import { AwsConfig } from "../../../main/k8s/awsConfig";
import { logger } from "../../../main/logger";
import { Clusterawsadm } from "../../../main/services/Clusterawsadm";

function makeAWSConfigFromEnvVars() {
	return AwsConfig.fromEnv(process.env);
}

function isNonEmptyString(str) {
	return typeof str !== "undefined" && str.length > 0;
}

test(`testing AwsConfig from environment variables`, () => {
	const awsConfig = makeAWSConfigFromEnvVars();

	expect(isNonEmptyString(awsConfig.aws_region)).toBeTruthy();
	expect(isNonEmptyString(awsConfig.aws_access_key_id)).toBeTruthy();
	expect(isNonEmptyString(awsConfig.aws_secret_access_key)).toBeTruthy();
});

test(`testing public AMI listing via clusterawsadm`, async () => {
	const awsConfig = makeAWSConfigFromEnvVars();
	const clusterawsadm = new Clusterawsadm(awsConfig);

	let imageList = await clusterawsadm.listPublicAMIs({
		//kubernetesVersion : "1.25.2",
		os: "ubuntu-20.04",
	});

	expect(isNonEmptyString(awsConfig.aws_b64encoded_credentials)).toBeTruthy();
	expect(imageList.kind == "AWSAMIList").toBeTruthy();
	expect(imageList.items.length > 0).toBeTruthy();

	logger.debug(`imageList = ${JSON.stringify(imageList, null, "\t")}`);
});
