import { Logger } from "kos-shared/Logger";
import process from "process";

/**
 * Loads and holds (friendly names and utilities for) platform specific client properties.
 * A singleton.
 * @class {Platform}
 */
class Platform {
	/**
	 * Architecture of the current client.
	 * @see process.arch
	 */
	public arch: string = process.arch;

	/**
	 * Executable filename extension convention, used in the current client.
	 */
	public exeExtension: ".exe" | "" = "";

	/**
	 * Operating system (family) name of the current client.
	 * @see process.platform
	 */
	public osFamily: "windows" | "linux" | "darwin";

	private static _instance: Platform;

	constructor() {
		if (Platform._instance) {
			return Platform._instance;
		}
		Platform._instance = this;

		if (this.arch === "x64") {
			this.arch = "amd64";
		}

		switch (process.platform) {
			case "win32":
				this.osFamily = "windows";
				this.exeExtension = ".exe";
				break;
			case "linux":
				this.osFamily = "linux";
				break;
			case "darwin":
				this.osFamily = "darwin";
				break;
			// TODO: Declare a default state.
		}

		Logger.debug(`constructed Platform instance for ${this.osFamily}/${this.arch}`);
	}
}

/**
 * Singleton Platform class instance.
 * @see Platform
 */
const platform = new Platform();

// make 1-level immutable.
Object.freeze(platform);

// no default export, per: https://google.github.io/styleguide/jsguide.html#es-module-exports
export { platform };
