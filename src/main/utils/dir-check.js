import { mkdirSync, constants, accessSync } from "fs";
import { cwd } from "process";

/**
 * @description Needed directories for KOS.
 */
export const DIRS = {
	/**
	 * @property Directory that holds KOS configuration files.
	 * @type string
	 */
	config: "config",

	/**
	 * @property Directory that holds client executable files.
	 * @type string
	 */
	bin: "bin",

	/**
	 * @property Directory that holds kubeconfig files of management clusters.
	 * @type string
	 */
	managementClusters: "config/clusters/man-clusters",
};

/**
 * Checks the existence of given directory. If there isn't creates it.
 * @param	{DIRS} dir	The directory will be checked.
 * @returns	{String}	Absolute path of the directory.
 * @throws				Throws if directory doesn't exist and unable to create it.
 */
export function dirCheck(dir) {
	let path = `${cwd()}/${dir}`;
	try {
		accessSync(path, constants.F_OK);
	} catch (err) {
		mkdirSync(path, { recursive: true });
	}
	return path;
}
