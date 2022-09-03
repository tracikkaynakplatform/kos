import { access, constants } from "fs";
import { env, cwd } from "process";
import fs from "fs";

export default class KubeConfig {
	/**
	 * kubeconfig içeriğini temsil eden bir sınıf.
	 *
	 * @constuctor
	 * @param {string} config - kubeconfig içeriği.
	 */
	constructor(config) {
		this.config = config;
		this.path = `${cwd()}/config/kc-${Date.now()}.yaml`;
	}

	/**
	 * Kullanılacak kubeconfig yolunu değiştirir.
	 *
	 * @throws {Error} - Yol değiştirme sırasında this.delete() ve this.write() çağırılır. Bir hata ile karşılaşırsa fırlatır.
	 * @param {string} path - Yeni kubeconfig yolu.
	 * @returns {Promise<void>}
	 */
	async changePath(path) {
		return new Promise((resolve, reject) => {
			access(this.path, F_OK, async (err) => {
				try {
					if (!err) await this.delete();
					this.path = path;
					await this.write();
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		});
	}

	/**
	 * kubeconfig içeriğini değiştirir ve {@var this.path} içine kayıt eder.
	 *
	 * @throws {Error} - {@function this.write()} metodu çağırılırken bir hata ile karşılaşırsa fırlatır.
	 * @param {string} content - Yeni kubeconfig içeriği.
	 */
	async changeContent(content) {
		this.config = content;
		await this.write();
	}

	/**
	 * {@var this.path} yolunda bulunan dosyayı okur ve içeriğini
	 * {@var this.config}'e atar.
	 *
	 * @throws {ErrnoException} - Dosya okuma sırasında bir hata ile karşılaşırsa fırlatır.
	 * @returns {Promise<string>} - config dosya içeriği.
	 */
	async load() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, { encoding: "utf-8" }, (err, data) => {
				if (err) reject(err);
				this.config = data;
				resolve(data);
			});
		});
	}

	/**
	 * Kubeconfig içeriğini cwd() + '/config/kc-zamandamgasi.yaml'
	 * olarak kayıt eder. Herhangi bir hata ile karşılaşılması
	 * durumunda Error fırlatır.
	 *
	 * @throws {Error} - Yazma sırasında bir hata ile karşılaşırsa fırlatır.
	 * @returns {Promise<void>}
	 */
	async write() {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, this.config, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	/**
	 * cwd() + '/config/kc-zamndamgasi.yaml' olarak kayıt
	 * edilen config dosyasını siler. Herhangi bir hata
	 * ile karşılaşılması durumunda Error fırlatır.
	 *
	 * @throws {Error} - Silme işlemi başarısız ise fırlatır.
	 * @returns {Promise<void>}
	 */
	async delete() {
		return new Promise((resolve, reject) => {
			fs.unlink(this.path, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	/**
	 * Varsayılan kubeconfig dosyasının içeriğini döndürür.
	 *
	 * @throws {Error} - Dosyayı okuma ile ilgili bir sorun oluşursa hata fırlatır.
	 * @throws {Error} - Varsayılan kubeconfig dosyası yok ise hata fırlatır.
	 * @returns {Promise<string>} - kubeconfig dosya içeriğini döndürür.
	 */
	static async defaultConfig() {
		return new Promise(async (resolve, reject) => {
			try {
				let path = await KubeConfig.defaultConfigPath();
				fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
					if (err) reject(err);
					resolve(data);
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * Sistemde kullanılabilir bir kubeconfig dosyası var ise
	 * yolunu döndürür. Aksi durumlarda hata fırlatır.
	 *
	 * @throws {Error} - Varsayılan bir kubeconfig dosyası bulunamazsa fırlatılır.
	 * @returns {Promise<string>} - kubeconfig dosyasının yolunu döndürür.
	 */
	static async defaultConfigPath() {
		let path = `${env.HOME}/.kube/config`;

		if (env.KUBECONFIG) path = env.KUBECONFIG;
		return new Promise((resolve, reject) => {
			access(path, constants.F_OK, (err) => {
				if (err)
					reject(
						new Error(
							"Kullanılabilir bir kubeconfig dosyası bulunamadı"
						)
					);
				resolve(path);
			});
		});
	}
}
