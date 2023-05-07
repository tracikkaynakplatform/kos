import tmp from "tmp";
import { KubeConfig } from "kos/configuration/KubeConfig";
import { ClientExecutable } from "./ClientExecutable";
import { platform } from "../Platform";
import { writeFileSync } from "original-fs";

export enum KubectlResource {
	Cluster = "clusters",
	Node = "nodes",
	Pod = "pods",
	MachineDeployment = "machinedeployments",
	KubeadmControlPlane = "kubeadmcontrolplane",
	Machine = "machines",
	AWSMachineTemplate = "awsmachinetemplate",
	AWSMachine = "awsmachine",
}

export type KubectlOptions = {
	outputType?: "json" | "jsonpath" | "normal";
	label?: string | string[];
	namespace?: string;
	allNamespaces?: boolean;
};

export type KubectlRunOptions = {
	args: (string | undefined)[];
	env?: any;
	options?: KubectlOptions;
};

export type KubectlQueryOptions = {
	resource: KubectlResource;
	name?: string;
	options?: KubectlOptions;
};

export type KubectlApplyOptions = {
	path?: string;
	content?: string;
	options?: KubectlOptions;
};

export type KubectlPatchOptions = KubectlQueryOptions & {
	type: "merge" | "json" | "strategic";
	patch?: string | any;
	patchFile?: string;
};

export class Kubectl extends ClientExecutable {
	private _config: KubeConfig;

	public constructor(config: KubeConfig, abortController?: AbortController) {
		super("kubectl", abortController);
		this._config = config;
	}

	public async get({ resource, name, options }: KubectlQueryOptions) {
		return await this.execKube({
			args: ["get", resource, name],
			options,
		});
	}

	public async delete({ resource, name, options }: KubectlQueryOptions) {
		if (!options) {
			options = {};
		}
		options.outputType = "normal";

		return await this.execKube({
			args: ["delete", resource, name, "--wait=false"],
			options,
		});
	}

	public async patch({ resource, type, name, options, patch, patchFile }: KubectlPatchOptions) {
		const args = ["patch", resource, name];

		if (type) {
			args.push("--type", type);
		}

		if (patch) {
			args.push("-p");
			if (typeof patch === "object") {
				args.push(JSON.stringify(patch));
			} else {
				args.push(patch);
			}
		} else if (patchFile) {
			args.push("--patch-file", patchFile);
		}
		return await this.execKube({
			args,
			options,
		});
	}

	public async apply({ path, content, options }: KubectlApplyOptions): Promise<string | any> {
		if (path) {
			return await this.execKube({
				args: ["apply", "-f", path],
				options,
			});
		}
		if (content) {
			return new Promise(async (resolve, reject) => {
				const file = tmp.fileSync();
				writeFileSync(file.name, content, { encoding: "utf-8" });
				try {
					resolve(
						await this.execKube({
							args: ["apply", "-f", file.name],
							options,
						})
					);
				} catch (err) {
					reject(err);
				} finally {
					file.removeCallback();
				}
			});
		}
		throw new TypeError("No path or content given.");
	}

	public async exec(args?: any[], env?: any): Promise<string> {
		return await super.exec(args, { KUBECONFIG: this._config.path, ...env });
	}

	private async execKube({ args, env, options }: KubectlRunOptions): Promise<string | any> {
		args.push(...this.optionsToArgs(options));
		const output = await this.exec(args, env);

		if (options?.outputType === "normal") {
			return output;
		}

		return JSON.parse(output);
	}

	private optionsToArgs(options?: KubectlOptions): string[] {
		const args: string[] = [];
		if (options?.outputType?.startsWith("json")) {
			args.push("-o", options.outputType);
		} else if (options?.outputType !== "normal") {
			args.push("-o", "json");
		}

		if (options?.label) {
			args.push("-l");
			if (typeof options.label == "string") {
				args.push(options.label);
			} else if (Array.isArray(options.label)) {
				args.push(options.label.join(","));
			}
		}

		if (options?.allNamespaces) {
			args.push("-A");
		} else if (options?.namespace) {
			args.push("-n", options.namespace);
		}

		return args;
	}

	protected async getDownloadUrl(): Promise<string> {
		const response = await fetch("https://dl.k8s.io/release/stable.txt");
		if (response.ok) {
			return `https://dl.k8s.io/release/${await response.text()}/bin/${platform.osFamily}/${platform.arch}/kubectl`;
		} else {
			throw new Error(`Couldn't get download link`);
		}
	}
}
