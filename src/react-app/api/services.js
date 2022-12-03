export async function prepareKubectl() {
	return await servicesAPI.prepareKubectl();
}

export async function checkKubectl() {
	return (await servicesAPI.checkKubectl()).status;
}

export default {
	prepareKubectl,
	checkKubectl,
};
