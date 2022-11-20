export async function listRegions(configENV, service = "ec2") {
	return await awsAPI.listRegions(configENV, service);
}

export async function listKeyPairs(configENV, service = "ec2", region = null) {
	return await awsAPI.listKeyPairs(configENV, service, region);
}

export default { listRegions, listKeyPairs };
