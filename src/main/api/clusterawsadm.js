import { Clusterawsadm } from "../services/Clusterawsadm";
import { AwsConfig } from "../k8s/awsConfig";
import { exportHelper } from "./exportHelper";

export async function listPublicAMIs(
	configENV,
	kubernetesVersion,
	os,
	region = null,
	env = {}
) {
	let config = AwsConfig.fromEnv(configENV);
	let cadm = new Clusterawsadm(config);

	if (!region) region = config.aws_region;

	return await cadm.listPublicAMIs(kubernetesVersion, os, region, env);
}

export default [exportHelper("listPublicAMIs", listPublicAMIs)];
