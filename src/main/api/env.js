import { exportHelper } from "./exportHelper";

export async function getEnv(name) {
	return process.env[name];
}

export default [exportHelper("getEnv", getEnv)];
