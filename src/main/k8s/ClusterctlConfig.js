import { execSync } from "child_process";
import { cwd } from "process";
import Clusterctl from "../services/Clusterctl";

class ClusterctlConfig {
	constructor() {
		this.managementConfig = "";
	}

	// TODO: Yönetim kümesini ilklendirme:
	// async initCluster(kubeConfig) {
	//
	// }

	#checkClusterctl() {
		let path = Clusterctl.check();
		if (!!!path) throw new Error("clusterctl bulunamadı");
		return path;
	}

	setManagementClusterConfig(kubeConfig) {
		this.managementConfig = kubeConfig;
	}

	generateCluster(
		clusterName,
		kubernetesVersion,
		masterCount,
		workerCount,
		isDocker = false
	) {
		let args = ["generate", "cluster", clusterName];
		let managementConfigFile =
			cwd() + `/config/cluster-create-${clusterName}.yaml`;

		if (isDocker) {
			args.push("--flavor");
			args.push("development");
		}
		args.push("--kubernetes-version");
		args.push(kubernetesVersion);

		args.push("--control-plane-machine-count");
		args.push(masterCount);

		args.push("--worker-machine-count");
		args.push(workerCount);

		fs.writeFileSync(managementConfigFile, this.managementConfig);
		return execSync(`${this.#checkClusterctl()} ${args.join(" ")}`, {
			env: { KUBECONFIG: managementConfigFile },
		}).toString();
	}
}

export default new ClusterctlConfig();
