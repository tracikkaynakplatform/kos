export async function openLink(link) {
	return await osAPI.openLink(link);
}

export default {
	openLink,
};
