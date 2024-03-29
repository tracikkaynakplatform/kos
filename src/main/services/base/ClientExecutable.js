import { get as _get } from "request";
import { access, chmodSync, constants } from "fs";
import { chmod } from "fs";
import { platform } from "./Platform";
import { findInPath } from "../../utils/find-in-path";
import { downloadFile } from "../../utils/download-file";
import { basePath, dirCheck, DIRS } from "../../utils/dir-check";
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
	 *
	 * @param {Any} response string representation of a json object
	 * @param {*} resolve function to call on positive results
	 * @param {*} reject function to call on errors
	 */
	resolveJsonResponse(response, resolve, reject) {
		if (response) {
			try {
				const obj = JSON.parse(response);
				resolve(obj);
			} catch (e) {
				reject(
					`Error while parsing json response: ${e} \nResponse: ${response}`
				);
			}
		} else {
			reject("Null Response");
		}
	}

	/**
	 * Executes with a json-request parameter and parses the resulting string as a json object.
	 * @param {*} object consisting of execution arguments and environment variables.
	 * @returns
	 */
	async jsonExec({ args = [], env = {} }) {
		const response = await this.exec([...args, "--output", "json"], env);

		return new Promise((resolve, reject) => {
			this.resolveJsonResponse(response, resolve, reject);
		});
	}

	/**
	 * Runs the executable file and returns its stdout.
	 * @param 	{Array<String>}		args	The arguments will pass to executable.
	 * @param 	{Object}			env		Environment variables.
	 * @returns {Promise<String>}			stdout of the executable file.
	 * @throws								Throws exception if it can't find the executable file or
	 * 										an error occurred at execution.
	 */
	async exec(args = [], env = {}) {
		const path = await this.check();
		let _args = [];

		for (let i of args) if (i) _args.push(i);

		logger.debug(
			`Executing -> ${path} ${_args.join(" ")} ${
				env && env != {}
					? `with *REDACTED* environment variables`
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
					cwd: basePath,
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
	async check({} = {}) {
		return new Promise((resolve, reject) => {
			try {
				resolve(findInPath(`${this.name}${platform.exeExt}`));
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
	}
}
