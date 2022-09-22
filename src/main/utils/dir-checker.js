import { access, mkdir, constants } from "fs";
import { cwd } from "process";

// Programın çalışması için  gereken temel dizinler
export const DIRS = {
	config: "config",
	bin: "bin",
	clusters: "config/clusters",
	managementClusters: "config/clusters/man-clusters",
};

export default async function dirCheck(dir) {
	let path = `${cwd()}/${dir}`;
	return new Promise((resolve, reject) => {
		access(path, constants.F_OK, (err) => {
			if (!err) resolve(path);
			else {
				mkdir(path, { recursive: true }, (err) => {
					if (!err) resolve(path);
					reject(err);
				});
			}
		});
	});
}
