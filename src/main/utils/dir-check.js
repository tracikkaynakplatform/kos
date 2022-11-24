import { mkdirSync, constants, accessSync } from "fs";
import { cwd, env } from "process";

// import { platform } from "../services/base/platform";
// TODO: check os for different home directory path
export const basePath = env.HOME ? env.HOME + "/.kos" : cwd();

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

	/**
	 * @property Root directory of the KOS configuration.
	 * @type string
	 */
	kos: "",
};

/**
 * Checks the existence of given directory. If there isn't creates it.
 * @param	{DIRS} dir	The directory will be checked.
 * @returns	{String}	Absolute path of the directory.
 * @throws				Throws if directory doesn't exist and unable to create it.
 */
export function dirCheck(dir) {
	let path = `${basePath}/${dir}`;
	try {
		accessSync(path, constants.F_OK);
	} catch (err) {
		mkdirSync(path, { recursive: true });
	}
	return path;
}
