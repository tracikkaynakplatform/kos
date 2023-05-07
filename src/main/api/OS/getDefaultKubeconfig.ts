import { accessSync, constants, readFileSync } from "original-fs";

export async function getDefaultKubeconfig(): Promise<any> {
	let path = `${process.env.HOME}/.kube/config`;

	if (process.env.KUBECONFIG) {
		path = process.env.KUBECONFIG;
	}
	try {
		accessSync(path, constants.F_OK);
		const content = readFileSync(path, { encoding: "utf-8" });
		return {
			content,
			path,
		};
	} catch (err) {
		throw new Error("Kubeconfig file couldn't find");
	}
}
