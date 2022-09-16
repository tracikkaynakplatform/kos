import fs from "fs";

/**
 * Kümeyi temsil eden nesneyi tanımlar.
 * @typedef {Object} Cluster
 * @property {string} name - Kümenin adı.
 * @property {string} config - Kümenin kubeconfig dosyasının yolu.
 * @property {Number} provider - Kümenin bulunduğu altyapı sağlayıcısının kimlik numarası.
 */

import dirCheck, { DIRS } from "../../utils/dir-checker";

export default class ManagementCluster {
	/**
	 * Yönetim kümesini temsil eden ve kayıtlı kümeler ile işlem yapmaya yarayan sınıf.
	 * @param {string} name - Yönetim kümesinin adı.
	 * @param {Array<Number>} supportedProviders - Yönetim kümesinin, yeni kümeler oluşturmayı desteklediği altyapı sağlayıcıları.
	 * @param {Array<Cluster>} clusters - Yönetim kümesinin sahip olduğu kümeler.
	 */
	constructor(name, supportedProviders, clusters) {
		this.name = name;
		this.supportedProviders = supportedProviders;
		this.clusters = clusters;
	}

	/**
	 * Uygulamada kayıtlı yönetim kümelerinin listesini döndürür.
	 *
	 * @throws {Error} - Dizin kontrolleri esnasında bir sorun ile karşılaşırsa fırlatır.
	 * @returns {Promise<Array<ManagementCluster>>} - Kayıtlı yönetim kümelerini döndürür.
	 */
	static async getManagementClusters() {
		let dir = await dirCheck("managementClusters");
		return new Promise((resolve, reject) => {
			fs.readdir(dir, async (err, files) => {
				if (err) reject(err);
				let jsonFiles = files.filter((x) => x.endsWith(".json"));
				let clusterList = [];
				for (const jsFile of jsonFiles) {
					try {
						const data = fs.readFileSync(`${dir}/${jsFile}`, {
							encoding: "utf-8",
						});
						clusterList.push(await JSON.parse(data));
					} catch (err) {
						reject(err);
					}
				}
				resolve(clusterList);
			});
		});
	}
}
