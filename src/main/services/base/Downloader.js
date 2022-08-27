import { get as _get } from 'request';
import { createWriteStream, existsSync } from "fs";
import { cwd } from "process";

class Downloader {

	constructor(url, name) {
		this.url = url;
		this.name = name;
		this.os = process.platform;
		this.path = `${cwd()}/bin/${this.name}`;
	}

	/**
	 * Kullanılabilecek ${this.name} çalıştırılabilir dosyasının yolunu döndürür.
	 * @returns {Promise<void>}
	 */
	async check() {
		const path = `${cwd()}/bin/${this.name}`;
		if (existsSync(path)) {
			return path;
		} else {
			return undefined;
		}
	}


	/**
	 * Son sürüm ${this.url} indirirken kullanılacak bilgileri döndürür.
	 * @returns {Promise<object>}
	 */
	async getOsObject() {
		_get(this.url, (error, response, body) => {
			response.assets.filter(item => {
				if (item.name.search(this.os) !== -1) {
					return item;
				}
			});
		});
	}

	/**
	 * Son sürüm ${this.url} indirir ve ./bin/${this.url} dizinine kayıt eder.
	 * @returns {Promise<boolean>}
	 */
	async download() {
		const data = await this.getOsObject();
		_get(data.browser_download_url, (error, response, body) => {
			response.pipe(createWriteStream(this.path));
		});
		return true;
	}

}

module.exports = Downloader;
