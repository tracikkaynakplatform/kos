import { accessSync, constants, mkdirSync } from "original-fs";
import { cwd, env } from "process";
import { platform } from "./Platform";

export enum Directories {
	Config = "config",
	Binary = "bin",
	ManagementClusterConfig = "config/management-clusters",
	Root = "",
}

export class Environment {
	static basePath: string = env.HOME ? `${env.HOME}/.kos` : cwd();

	public static checkDirectory(directory: Directories): string {
		const path = `${this.basePath}/${directory}`;
		try {
			accessSync(path, constants.F_OK);
		} catch (err) {
			mkdirSync(path, { recursive: true });
		}
		return path;
	}

	public static findInPath(fileName: string): string {
		const pathDelimitter = platform.osFamily == "windows" ? ";" : ":";
		const paths = env.PATH?.split(pathDelimitter);

		if (!paths) {
			throw new Error("PATH environment variable doesn't exists!");
		}

		for (const path of paths) {
			const fullPath = `${path}/${fileName}`;
			try {
				accessSync(fullPath, constants.F_OK);
				return fullPath;
			} catch (err) {}
		}
		throw new Error("File couldn't found");
	}
}
