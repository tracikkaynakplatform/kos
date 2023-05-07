import managementClusterAPIs from "./management-cluster";
import osAPIs from "./OS";
import taskAPIs from "./task";

import { ipcMain } from "electron";
import { Logger } from "kos-shared/Logger";
import { API, APIFunctionObject } from "./types";

export const apis: API[] = [managementClusterAPIs, osAPIs, taskAPIs];

export function initAPIs() {
	apis.forEach((apiGroup) => {
		const apiNames = new Set();
		apiGroup.functions.forEach((api: APIFunctionObject) => {
			if (!apiNames.has(api.name)) {
				ipcMain.handle(`${apiGroup.namespace}.${api.name}`, async (_, args) => {
					try {
						return await api.function(...args);
					} catch (err) {
						Logger.error(err);
						throw err;
					}
				});
				apiNames.add(api.name);
			}
		});
	});
}
