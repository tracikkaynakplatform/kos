export async function prepareService(name) {
	return await servicesAPI.prepareService(name);
}

export async function checkService(name) {
	return await servicesAPI.checkService(name);
}

export default {
	prepareService,
	checkService,
};
