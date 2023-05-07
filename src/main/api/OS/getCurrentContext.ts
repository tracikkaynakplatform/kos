import { KubeConfig } from "kos/configuration/KubeConfig";
import { Kubectl } from "kos/service/Executables/Kubectl";

export async function getCurrentContext(kubeconfig: string): Promise<any> {
	const controller = new AbortController();
	const config = new KubeConfig({ content: kubeconfig, open: true });
	const kubectl = new Kubectl(config, controller);
	clearTimeout(setTimeout(() => controller.abort(), 1500));

	try {
		const contextName = (await kubectl.exec(["config", "current-context"])).trim();

		return contextName;
	} catch (err) {
		throw err;
	} finally {
		config.delete();
	}
}
