import BaseDownloader from './base/Downloader';
import { cwd } from "process";
import { get as _get } from 'request';
import downloadFile from "../utils/download-file";
import { chmodSync } from 'fs';

class Kubectl extends BaseDownloader {
	/**
	 * @param {string} url
	 * @param {string} name
	 * @param {string} os
	 * @param {string} path
	 */
	constructor() {
		const url = 'https://dl.k8s.io/release/';
		const name = 'kubectl';
		const os = process.platform;
		const path = `${cwd()}/bin/${name}`;
		const version = null;
		super(url, name);
	}

	/**
	 * Son sürüm ${this.url} indirilecek dosyanın sürüm numarasını döndürür.
	 * @returns {Promise<*>}
	 */
	async getVersion() {
		return new Promise((resolve, reject) => {
			_get('https://dl.k8s.io/release/stable.txt', (error, response, body) => {
				if (error)
					reject(error);
				this.version = body;
				resolve(true);
			});
		});
	}

	/**
	 * Son sürüm ${this.url} indirirken kullanılacak url'i bind eder.
	 * @returns {Promise<void>}
	 */
	async getDownloadUrl() {
		await this.getVersion();
		switch (this.os) {
			case 'darwin' || 'linux':
				this.url = `https://dl.k8s.io/release/${this.version}/bin/${this.os}/amd64/kubectl`;
				break;
			case 'win32':
				this.url = `https://dl.k8s.io/release/${this.version}/bin/windows/amd64/kubectl.exe`;
				break;
		}
	}

	/**
	 * Son sürüm ${this.url} indirir ve ./bin/${this.url} dizinine kayıt eder.
	 */
	async download() {
		await this.getDownloadUrl();
		await downloadFile(this.url, this.path);
		chmodSync(this.path, 0o777);
	}
}

export default new Kubectl();
