export async function getEnv(name) {
	return await envAPI.getEnv(name);
}

export default {
	getEnv,
};
