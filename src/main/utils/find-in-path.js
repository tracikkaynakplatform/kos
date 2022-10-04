import { env, platform } from "process";
import { access, constants } from "fs";

/**
 * @description Bir dizin veya dosyanın varlığını denetler
 * @param {String} path Kontrol edilecek dizin/dosya
 * @returns {Promise<Boolean>} Dizin/dosya var ise true aksi halde false döner.
 */
async function checkExists(path) {
	return new Promise((res, rej) => {
		access(path, constants.F_OK, (err) => {
			if (!err) return res(path);
			return rej(err);
		});
	});
}

/**
 * @description PATH çevre değişkeni içerisindeki dizinlerden birinde fileName isimli bir dosya olup olmadığını bulur.
 * @param {String} fileName Dosya adı.
 * @throws {Error} PATH 	çevre değişkeni mevcut değilse fırlatır.
 * @throws {Error} Dosya bulunamaz ise fırlatır.
 * @returns {Promise<String>} Dosyanın tam yolunu döndürür.
 */
export default async function findInPath(fileName) {
	let path = "";
	let splitChar = ":";
	if (platform == "win32") splitChar = ";";
	let paths = env.PATH?.split(splitChar);
	if (!paths) throw new Error("PATH çevre değişkeni mevcut değil");
	for (let p of paths) {
		path = `${p}/${fileName}`;
		try {
			await checkExists(path);
			return path;
		} catch (err) {}
	}
	throw new Error("Dosya bulunamadı");
}
