export async function getEnv(name) {
	return process.env[name];
}

export default [getEnv];
