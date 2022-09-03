import Downloader from "./base/Downloader";
import { execFile } from "child_process";
import { get as _get } from "request";
import downloadFile from "../utils/download-file";
import { chmod } from "fs";
import KubeConfig from "../k8s/KubeConfig";

export default class Kubectl extends Downloader {
	/**
	 * kubectl ile işlem yapmaya yarayan sınıf.
	 * @constructor
	 */
	constructor() {
		super("https://dl.k8s.io/release/", "kubectl");
		this.version = null;
		this.config = null;
	}

	/**
	 * Son sürüm kubectl indirilecek dosyanın sürüm numarasını döndürür.
	 * @returns {Promise<boolean>}
	 */
	async getVersion() {
		return new Promise((resolve, reject) => {
			_get(
				"https://dl.k8s.io/release/stable.txt",
				(error, response, body) => {
					if (error) reject(error);
					this.version = body;
					resolve(true);
				}
			);
		});
	}

	/**
	 * Son sürüm kubectl indirirken kullanılacak url'i bind eder.
	 * @returns {Promise<void>}
	 */
	async getDownloadUrl() {
		await this.getVersion();
		switch (this.os) {
			case "darwin":
			case "linux":
				this.url = `https://dl.k8s.io/release/${this.version}/bin/${this.os}/amd64/kubectl`;
				break;
			case "win32":
				this.url = `https://dl.k8s.io/release/${this.version}/bin/windows/amd64/kubectl.exe`;
				break;
		}
	}

	/**
	 * Son sürüm kubectl indirir ve ./bin/ dizinine kayıt eder.
	 */
	async download() {
		await this.getDownloadUrl();
		await downloadFile(this.url, this.path);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o777, (err) => {
				if (err) reject(err);
				resolve(this.path);
			});
		});
	}

	/**
	 * "kubectl get" eylemini gerçekleştirir.
	 *
	 * @throws {Error} - kubectl yok ise hata fırlatır.
	 * @throws {Error} - kubectl'i çalıştırma ile ilgili bir sorun oluşursa hata fıraltır.
	 * @returns {Promise<string>} - Çıktıyı döndürür.
	 */
	async get(resource, outputType = "json", ...additionalArgs) {
		let path = await this.check();
		const args = ["get", resource];

		if (outputType == "json") args.push(...["-o", "json"]);
		args.push(...additionalArgs);

		return new Promise((resolve, reject) => {
			execFile(
				path,
				args,
				{
					env: { KUBECONFIG: this.config.path },
					encoding: "utf-8",
				},
				(err, stdout, stderr) => {
					if (err) reject(err);
					resolve(stdout);
				}
			);
		});
	}

	/**
	 *
	 * @param {string} file
	 */
	async apply(file) {}
}
