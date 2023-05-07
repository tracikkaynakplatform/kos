import { Logger } from "kos-shared/Logger";
import { KubeconfigNotFoundError } from "kos/error/KubeconfigNotFoundError";
import { Directories, Environment } from "kos/service/Environment";
import { customAlphabet } from "nanoid";
import { accessSync, constants, readFileSync, unlinkSync, writeFileSync } from "original-fs";

const tmpFileName = customAlphabet("1234567890abcdefghijklmnoprstuvyzqwx", 10);

export type KubeConfigOptions = {
	path?: string;
	content?: string;
	open?: boolean;
};

export class KubeConfig {
	private _content: string;
	private _path: string;

	public constructor({ content, path, open }: KubeConfigOptions = {}) {
		this._content = content ?? "";
		this._path = path ?? `${Environment.checkDirectory(Directories.Config)}/${tmpFileName()}.yaml`;

		if (open) {
			if (content) {
				this.content = content;
			} else {
				this.load();
			}
		}
	}

	/**
	 * Content of config file.
	 */
	public get content() {
		return this._content;
	}
	public set content(value: string) {
		this._content = value;
		this.write();
	}

	/**
	 * Path of config file.
	 */
	public get path() {
		return this._path;
	}
	public set path(value: string) {
		this.delete();
		this._path = value;
		this.load();
	}

	/**
	 * Changes current file path to `newPath`
	 * @param newPath New path for kubeconfig file.
	 */
	public changePath(newPath: string) {
		this.delete();
		this._path = newPath;
		this.write();
	}

	/**
	 * Loads content of the file.
	 */
	public load() {
		try {
			accessSync(this._path, constants.F_OK);
		} catch (err) {
			throw new KubeconfigNotFoundError(this._path);
		}
		this._content = readFileSync(this._path, { encoding: "utf-8" });
	}

	/**
	 * Deletes the config file.
	 */
	public delete() {
		try {
			unlinkSync(this._path);
		} catch (err) {
			Logger.error(err);
		}
	}

	/**
	 * Saves content to file.
	 */
	public write() {
		writeFileSync(this._path, this._content, { encoding: "utf-8", mode: 0o600 });
	}
}
