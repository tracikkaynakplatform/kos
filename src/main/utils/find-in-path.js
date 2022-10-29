import { env } from "process";
import { accessSync, constants } from "fs";
import { platform } from "../services/base/platform";

/**
 * Searchs for `fileName` in the PATH environment variable.
 * @param	{String} fileName	Name of the file to search.
 * @returns	{String}			Absolute path of `fileName`.
 * @throws						Throws exception if there is not PATH variable or wouldn't find the file.
 */
export function findInPath(fileName) {
	let path = "";
	let splitChar = ":";
	if (platform.osFamily == "windows") splitChar = ";";
	let paths = env.PATH?.split(splitChar);
	if (!paths) throw new Error("PATH environment variable doesn't exists!");
	for (let p of paths) {
		path = `${p}/${fileName}`;
		try {
			accessSync(path, constants.F_OK);
			return path;
		} catch (err) {}
	}
	throw new Error("File couldn't found");
}
