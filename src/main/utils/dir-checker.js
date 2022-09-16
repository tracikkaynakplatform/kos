import { access, mkdir, constants } from "fs";
import { cwd } from "process";

// Programın çalışması için  gereken temel dizinler
export const DIRS = {
	config: "config",
	bin: "bin",
	clusters: "config/clusters",
	managementClusters: "config/clusters/man-clusters",
	workloadClusters: "config/clusters/workload",
};

/**
 * Çalışma dizini altında istenen dizinin var olup
 * olmadığını döndürür. Eğer dizin cwd() + dizin yolunda
 * bulunmuyorsa oluşturmayı dener. Oluşturma işlemi
 * başarılı ise yolu döndürür. Başarısız ise hata
 * fırlatır.
 *
 * @param {string} dir - Yolu istenen dizin. {@var DIRS} içerisinden bir dizin olmalı.
 * @throws {Error} - Olmayan dizini oluşturma sırasında bir hata ile karşılaşırsa fırlatır.
 * @throws {Error} - {@param dir} isimli bir dizin {@var {DIRS}} içerisinde yoksa fırlatır.
 * @returns {Promise<string>} - Dizinin yolunu döndürür.
 */
export default async function dirCheck(dir) {
	dir = DIRS[dir];
	if (!dir) throw new Error("Dizin bilgisi verilmedi: " + dir);
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
