import fs from "fs";
import { dirCheck, DIRS } from "../utils/dir-check";

/**
 * Configuration manager of KOS.
 */
export class Configuration {
	/**
	 * Instantiate a new Configuration object.
	 */
	constructor() {
		this.path = `${dirCheck(DIRS.kos)}/config.json`;
		this.config = {};
	}

	/**
	 * Saves the current config object to the file.
	 */
	save() {
		dirCheck(DIRS.kos);
		fs.writeFileSync(this.path, JSON.stringify(this.config), {
			encoding: "utf-8",
		});
	}

	/**
	 * Loads the configuration file and fits it into config.
	 */
	load() {
		if (!fs.accessSync(this.path)) {
			this.save();
			this.config = {};
			return;
		}

		const content = fs.readFileSync(this.path, { encoding: "utf-8" });
		this.config = JSON.parse(content);
	}

	/**
	 * Sets the value of configuration.
	 * @param {string}	name	Key of the configuration.
	 * @param {Object}	value	Value of the configuration.
	 */
	setConfig(name, value) {
		this.config[name] = value;
	}

	/**
	 * Gets the value of configuration.
	 * @param 	{string} name	Key of the configuration.
	 * @returns {Object}		Value of configuration or undefined.
	 */
	getConfig(name) {
		return this.config[name];
	}
}
