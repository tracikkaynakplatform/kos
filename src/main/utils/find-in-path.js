import { env, platform } from "process";
import { access, constants } from "fs";

async function checkExists(path) {
	return new Promise((res, rej) => {
		access(path, constants.F_OK, (err) => {
			if (!err) return res(path);
			return rej(err);
		});
	});
}

/**
 * PATH çevre değişkeni içerisinde fileName isimli bir
 * dosya olup olmadığını bulur. Eğer dosya mevcut ise
 * yolu, aksi durumda ise undefined döndürü.
 *
 * @param {string} fileName Dosya adı.
 * @returns {Promise<string>} Dosyanın tam yolu.
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
