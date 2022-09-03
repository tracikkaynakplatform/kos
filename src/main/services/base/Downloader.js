import { get as _get } from "request";
import { access, constants } from "fs";
import process, { cwd } from "process";
import { chmod } from "fs";
import findInPath from "../../utils/find-in-path";
import downloadFile from "../../utils/download-file";

class Downloader {
	constructor(url, name) {
		this.url = url;
		this.name = name;
		this.os = process.platform;
		this.path = `${cwd()}/bin/${this.name}`;
	}

	/**
	 * Kullanılabilecek çalıştırılabilir dosyanın yolunu döndürür.
	 *
	 * @throws {Error} - Çalıştırılabilir dosya bulunamaz ise fırlatır.
	 * @returns {Promise<string>} - Çalıştırılabilir dosya yolu.
	 */
	async check() {
		try {
			return await findInPath(this.name);
		} catch (err) {
			return new Promise((resolve, reject) => {
				access(this.path, constants.F_OK, (err) => {
					if (!err) return resolve(this.path);
					return reject(err);
				});
			});
		}
	}

	/**
	 * Son sürüm dosya indirirken kullanılacak bilgileri döndürür.
	 *
	 * @throws {Error} - Bağlantı sırasında bir sorun ile karşılaşırsa fırlatır.
	 * @returns {Promise<object>} - Dosya bilgilerini tutan nesneyi döndürür.
	 */
	async getOsObject() {
		return new Promise((resolve, reject) => {
			_get(
				this.url,
				{
					headers: {
						"User-Agent": "kos",
					},
				},
				(error, response, body) => {
					if (error) reject(error);
					body = JSON.parse(body);
					body.assets.filter((item) => {
						if (item.name.search(this.os) !== -1) {
							resolve(item);
							return;
						}
					});
				}
			);
		});
	}

	/**
	 * Çalıştırılabilir dosyanın son sürümünü indirir ve ./bin/ dizinine kayıt eder.
	 * @returns {Promise<boolean>}
	 */
	async download() {
		const data = await this.getOsObject();
		await downloadFile(data.browser_download_url, this.path);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o777, (err) => {
				if (err) reject(err);
				resolve(this.path);
			});
		});
	}
}

export default Downloader;
