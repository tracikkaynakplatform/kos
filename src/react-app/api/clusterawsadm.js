export async function listPublicAMIs(
	configENV,
	kubernetesVersion,
	os,
	region = null,
	env = {}
) {
	return await clusterawsadmAPI.listPublicAMIs(
		configENV,
		kubernetesVersion,
		os,
		region,
		env
	);
}

export default { listPublicAMIs };
