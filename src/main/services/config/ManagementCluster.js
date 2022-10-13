import fs from "fs";
import KubeConfig from "../../k8s/KubeConfig";
import Kubectl from "../Kubectl";
import dirCheck, { DIRS } from "../../utils/dir-checker";
import { PROVIDER_TYPE } from "../../providers";

/**
 * @description Kümeyi temsil eden nesneyi tanımlar.
 * @typedef {Object} Cluster
 * @property {string} name - Kümenin adı.
 * @property {string} status - Kümenin durum bilgisi.
 * @property {Number} provider - Kümenin bulunduğu altyapı sağlayıcısının kimlik numarası.
 */
/** @typedef {import('../../providers').ProviderType} ProviderType */

/**
 * Yönetim kümesini temsil eden ve kayıtlı kümeler ile işlem yapmaya yarayan sınıf.
 */
export default class ManagementCluster {
	constructor(name) {
		/**
		 * @description Yönetim kümesinin adı.
		 * @type {string}
		 * @public
		 */
		this.name = name ?? "";

		/**
		 * @description Yönetim kümesi tarafından desteklenen altyapı sağlayıcılarının listesi. Bu listedeki numaralar {@link ProviderType} tarafından sağlanan ID numaralarından ibarettir.
		 * @type {Array<Number>}
		 * @public
		 */
		this.supportedProviders = [];

		/**
		 * @description Bu yönetim kümesine kayıtlı olan kümelerin listesi.
		 * @type {Array<Cluster>}
		 * @public
		 */
		this.clusters = [];

		/**
		 * @description Yönetim kümesinin config nesnesi.
		 * @type {KubeConfig}
		 * @public
		 */
		this.config = new KubeConfig();
	}

	async getClusters() {
		let kctl = new Kubectl();
		let result = [];

		await KubeConfig.tempConfig(
			kctl.config,
			this.config.config,
			async () => {
				let clusterList = await kctl.get("cluster", "json", "-A");
				clusterList = clusterList?.items;

				for (let i of clusterList) {
					let provider = i.spec.infrastructureRef.kind;
					switch (provider) {
						case "DockerCluster":
							provider = PROVIDER_TYPE.DOCKER;
							break;
						case "DOCluster":
							provider = PROVIDER_TYPE.DIGITAL_OCEAN;
							break;
						case "AWSCluster":
							provider = PROVIDER_TYPE.AWS;
							break;
					}
					result.push({
						name: i.metadata.name,
						provider,
						status: i.status.phase,
					});
				}
			}
		);
		this.clusters = result;
		return result;
	}

	async getSupportedProviders() {
		let kctl = new Kubectl();
		let providers = [];
		await KubeConfig.tempConfig(
			kctl.config,
			this.config.config,
			async () => {
				let pods = await kctl.get("pods", "json", "-A"); // --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' -A
				for (let i of pods.items) {
					switch (i.metadata.namespace) {
						case "capd-system":
							providers.push(PROVIDER_TYPE.DOCKER);
							break;
						case "capdo-system":
							providers.push(PROVIDER_TYPE.DIGITAL_OCEAN);
							break;
						case "capa-system":
							providers.push(PROVIDER_TYPE.AWS);
							break;
					}
				}
			}
		);
		this.supportedProviders = providers;
		return providers;
	}

	static async getManagementClusters() {
		let dir = await dirCheck(DIRS.managementClusters);
		return new Promise((resolve, reject) => {
			fs.readdir(dir, async (err, files) => {
				if (err) reject(err);
				let configFiles = files.filter((x) =>
					x.endsWith(".kubeconfig")
				);
				let clusterList = [];
				for (const conf of configFiles) {
					try {
						let manCluster = new ManagementCluster(
							conf.split(".").slice(0, -1).join(".")
						);

						await manCluster.config.changePath(`${dir}/${conf}`);
						await manCluster.getClusters();
						await manCluster.getSupportedProviders();
						clusterList.push(manCluster);
					} catch (err) {
						reject(err);
					}
				}
				resolve(clusterList);
			});
		});
	}
}
