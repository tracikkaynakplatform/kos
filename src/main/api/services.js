import { logger } from "../logger";
import Kubectl from "../services/Kubectl";
import Clusterctl from "../services/Clusterctl";
import { Aws } from "../services/aws";
import { Clusterawsadm } from "../services/clusterawsadm";

function getExeType(name) {
	switch (name) {
		case "kubectl":
			return new Kubectl();
		case "clusterctl":
			return new Clusterctl();
		case "clusterawsadm":
			return new Clusterawsadm();
		case "aws":
			return new Aws();
	}
}

export async function checkService(name) {
	try {
		await getExeType(name).check();
		return { status: true };
	} catch (err) {
		logger.error(err.message);
		return { status: false };
	}
}

export async function prepareService(name) {
	try {
		await getExeType(name).download();
		return { status: "ok" };
	} catch (err) {
		logger.error(err.message);
		return { message: err.message, status: "err" };
	}
}

export default [checkService, prepareService];
