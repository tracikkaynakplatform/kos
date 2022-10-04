import { access, mkdir, constants } from "fs";
import { cwd } from "process";

/**
 * @typedef DIRS
 * @type {Object}
 * @property {String} config KOS'un yönetim kümelerine ait kubeconfig dosyalarını, ayrıca kendi yapılandırma dosyalarını sakladığı dizindir.
 * @property {String} bin kubectl, clusterctl gibi KOS'un kullandığı ikili çalıştırılabilir dosyaların tutulduğu dizin.
 * @property {String} managementClusters Yönetim kümelerinin kubeconfig dosyalarının saklandığı dizin.
 */

/**
 * @description KOS'un çalışması için gerekli olan dizinleri tutan nesne tipi.
 * @type {DIRS}
 */
export const DIRS = {
	config: "config",
	bin: "bin",
	managementClusters: "config/clusters/man-clusters",
};

/**
 * @description Girilen dizinin varlığı kontrol eder. Var ise yolunu döndürür. Yok ise oluşturmayı dener.
 * @param {DIRS} dir Kontrol edilecek dizinin yolu.
 * @throws {NodeJS.ErrnoException} Dizin kontrolü yaparken hata ile karşılaşırsa fırlatır.
 * @throws {NodeJS.ErrnoException} Varolmayan dizini oluşturmaya çalışırken bir hata ile karşılaşırsa fırlatır.
 * @returns {Promise<String>} İstenen dizinin yolunu döndürür.
 */
export default async function dirCheck(dir) {
	let path = `${cwd()}/${dir}`;
	return new Promise((resolve, reject) => {
		access(path, constants.F_OK, (err) => {
			if (!err) resolve(path);
			else {
				mkdir(path, { recursive: true }, (err) => {
					if (!err) resolve(path);
					reject(err);
				});
			}
		});
	});
}
