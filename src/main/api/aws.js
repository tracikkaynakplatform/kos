import { Aws } from "../services/aws";
import { AwsConfig } from "../k8s/awsConfig";
import { exportHelper } from "./exportHelper";

export async function listRegions(configENV, service = "ec2") {
	let config = AwsConfig.fromEnv(configENV);
	let aws = new Aws(config);
	return await aws.listRegions(service);
}

export async function listKeyPairs(configENV, service = "ec2", region = null) {
	let config = AwsConfig.fromEnv(configENV);
	let aws = new Aws(config);
	return await aws.listKeyPairs(service, region);
}

export default [
	exportHelper("listRegions", listRegions),
	exportHelper("listKeyPairs", listKeyPairs),
];
