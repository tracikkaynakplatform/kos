import { get as _get } from "request";
import { access, chmodSync, constants } from "fs";
import { chmod } from "fs";
import { platform } from "./platform";
import { findInPath } from "../../utils/find-in-path";
import { downloadFile } from "../../utils/download-file";
import { dirCheck, DIRS } from "../../utils/dir-check";
import { execFile } from "child_process";
import { logger } from "../../logger";
/**
 * Represents common code for client executables, like kubectl, clusterctl ...
 */
export class ClientExecutable {
	MAX_DOWNLOAD_RETRIES = 3;

	/**
	 * Instantiate a new ClientExecutable object with given parameters.
	 * @param {String} url		Releases API link of target executable file. eg. {@link https://api.github.com/repos/kubernetes-sigs/cluster-api/releases/latest}
	 * @param {String} name		The name of the executable to be saved.
	 */
	constructor(url, name) {
		/**
		 * @property GitHub API URL
		 * @type {String}
		 */
		this.url = url;

		/**
		 * @property Executable file name. (Not absolute or relative path)
		 * @type {String}
		 */
		this.name = name;

		/**
		 * @property Download retry count.
		 * @type {Number}
		 */
		this.downloadRetries = 0;

		/**
		 * @property Complete path of the executable file.
		 * @type {String}
		 */
		this.path = `${dirCheck(DIRS.bin)}/${this.name}${platform.exeExt}`;
	}

	/**
	 * Runs the executable file and returns its stdout.
	 * @param 	{Array<String>}		args	The arguments will pass to executable.
	 * @param 	{Object}			env		Environment variables.
	 * @returns {Promise<String>}			stdout of the executable file.
	 * @throws								Throws exception if it can't find the executable file or
	 * 										an error occured at execution of the file.
	 */
	async exec(args = [], env = {}) {
		const path = await this.check();
		const _args = [];

		for (let i of args) if (i) _args.push(i);

		logger.debug(
			`Executing -> ${path} ${_args.join(" ")} ${
				env && env != {}
					? `with ${Object.keys(env ?? {}).map(
							(x) => `${x}=${env[x]}`
						)}environment variables`
					: ""
			}`
		);

		return new Promise((resolve, reject) => {
			execFile(
				path,
				_args,
				{
					env: env,
					encoding: "utf-8",
				},
				(err, stdout) => {
					if (err) return reject(err);
					resolve(stdout);
				}
			);
		});

	}

	/**
	 * Checks existence of the executable file.
	 * @returns {Promise<String>}	Path of the executable file.
	 * @throws						Throws exception if it can't find the executable file.
	 */
	async check({}={}) {
		return new Promise((resolve, reject) => {
			try {
				resolve(findInPath(this.name));
			} catch (err) {
				access(this.path, constants.F_OK, (err) => {
					if (err) return reject(err);
					resolve(this.path);
				});
			}
		});
	}

	/**
	 * Gets the last version information of the executable file from GitHub API.
	 * @throws						Throws exception if the connection has errors.
	 * @returns {Promise<object>}	Information for executable file or undefined.
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
				(error, _, body) => {
					if (error) return reject(error);
					body = JSON.parse(body);
					body.assets.filter((item) => {
						if (item.name.search(platform.osFamily) !== -1)
							return resolve(item);
					});
					resolve();
				}
			);
		});
	}

	/**
	 * Downloads latest version of the executable file and saves it to the binary directory.
	 * @throws Throws exception if the connection has errors or cannot give permissions to the downloaded file.
	 * @see DIRS.bin
	 */
	async download() {
		const data = await this.getOsObject();
		await downloadFile(data.browser_download_url, this.path);
		chmodSync(this.path, 0o755);
		return new Promise((resolve, reject) => {
			chmod(this.path, 0o755, (err) => {
				if (err) return reject(err);
				resolve(this.path);
			});
		});
	}
}
