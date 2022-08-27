import BaseDownloader from './base/Downloader';
import { cwd, platform } from "process";
import { get as _get } from 'request';
import { createWriteStream } from "fs";

class Kubectl extends BaseDownloader {
	/**
	 * @param {string} url
	 * @param {string} name
	 * @param {string} os
	 * @param {string} path
	 */
	constructor() {
		const url = 'https://api.github.com/repos/kubernetes/kubectl/tags/latest';
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
		await _get(this.url, (error, response, body) => {
			this.version = body
		});
		return this.version;
	}

	/**
	 * Son sürüm ${this.url} indirirken kullanılacak url'i bind eder.
	 * @returns {Promise<void>}
	 */
	async getDownloadUrl() {
		this.getVersion();
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
	 * @returns {Promise<boolean>}
	 */
	async download() {
		this.getDownloadUrl()
		_get(this.url, (error, response, body) => {
			response.pipe(createWriteStream(this.path));
		});
		return true;
	}
}

module.exports = new Kubectl();
