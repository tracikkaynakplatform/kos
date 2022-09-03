import { cwd } from "process";
import { execFile } from "child_process";
import fs from "fs";
import KubeConfig from "../k8s/KubeConfig";
import dirCheck, { DIRS } from "../utils/dir-checker";
import Downloader from "./base/Downloader";

export default class Clusterctl extends Downloader {
	/**
	 * clusterctl ile işlemler yapmaya yarayan sınıf.
	 *
	 * @constructor
	 */
	constructor() {
		super(
			"https://api.github.com/repos/kubernetes-sigs/cluster-api/releases/latest",
			"clusterctl"
		);
		this.config = null;
	}

	/**
	 * Yeni küme oluşturmak için gereken yaml dosyasını oluşturur ve yolunu döndürür.
	 *
	 * @throws {Error} - cwd() + config dizini yoksa ve oluşturulamıyorsa fırlatır.
	 * @throws {Error} - yaml dosyasına yazılamadığında fırlatır.
	 * @throws {Error} - clusterctl bulunamaz ise hata fırlatır.
	 * @param {string} clusterName - Oluşturulacak kümenin adı.
	 * @param {string} kubernetesVersion - Küme için kullanılacak Kubernetes versiyonu (Yönetim kümesi tarafından desteklenmeli).
	 * @param {Number} masterCount - Control-plane (Master) makine sayısı.
	 * @param {Number} workerCount - Worker (slave) makine sayısı.
	 * @param {boolean} isDocker - Docker provider için eklenmesi gereken fazladan bir parametre mevcut. Eğer küme docker provider için oluşturuluyorsa true verilmeli.
	 * @returns {Promise<string>} - Yönetim kümesine uygulanarak yeni küme oluşturmaya yarayan .yaml dosyasının yolunu döndürür. Bu yaml dosyası cwd() + /config/cctl-generate-kumeadi-zamandamgasi.yaml olarak kayıt edilir.
	 */
	async generateCluster(
		clusterName,
		kubernetesVersion,
		masterCount,
		workerCount,
		isDocker = false
	) {
		let configPath = await dirCheck(DIRS.config);
		let cctlPath = await this.check();
		let yamlPath = `${configPath}/cctl-generate-${clusterName}-${Date.now()}.yaml`;
		let args = ["generate", "cluster", clusterName];

		if (isDocker) args.push("--flavor", "development");

		args.push(...["--kubernetes-version", kubernetesVersion]);
		args.push(...["--control-plane-machine-count", masterCount]);
		args.push(...["--worker-machine-count", workerCount]);

		return new Promise((resolve, reject) => {
			execFile(
				cctlPath,
				args,
				{
					env: { KUBECONFIG: this.config.path },
					encoding: "utf-8",
				},
				(err, stdout, stderr) => {
					if (err) reject(err);
					fs.writeFile(yamlPath, stdout, (err) => {
						if (err) return reject(err);
						resolve(yamlPath);
					});
				}
			);
		});
	}
}
