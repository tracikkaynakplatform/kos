import { logger } from "../logger";
import Kubectl from "../services/Kubectl";

export async function checkKubectl() {
	try {
		let kctl = new Kubectl();
		await kctl.check();
		return { status: true };
	} catch (err) {
		logger.error(err.message);
		return { status: false };
	}
}

export async function prepareKubectl() {
	try {
		let kctl = new Kubectl();
		await kctl.download();
		return { status: "ok" };
	} catch (err) {
		logger.error(err.message);
		return { message: err.message, status: "err" };
	}
}

export default [checkKubectl, prepareKubectl];
