import { get as _get } from 'request';
import { existsSync } from "fs";
import { cwd } from "process";
import downloadFile from "../../utils/download-file";

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
	check() {
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
		return new Promise((resolve, reject) => {
			_get(this.url, (error, response, body) => {
				if (error)
					reject(error);
				response.assets.filter(item => {
					if (item.name.search(this.os) !== -1) {
						resolve(item);
						return ;
					}
				});
			});
		});
	}

	/**
	 * Son sürüm ${this.url} indirir ve ./bin/${this.url} dizinine kayıt eder.
	 * @returns {Promise<boolean>}
	 */
	async download() {
		const data = await this.getOsObject();
		return await downloadFile(data.browser_download_url, this.path);
	}

}

export default Downloader;
