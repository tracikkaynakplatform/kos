import { contextBridge, ipcRenderer } from "electron";
import { apis } from "./api";

const mainWorld: any = {};

for (const apiGroup of apis) {
	for (const apiFunction of apiGroup.functions) {
		if (!mainWorld[apiGroup.namespace]) {
			mainWorld[apiGroup.namespace] = {};
		}
		const wrappedFunction = (...args: any[]) => ipcRenderer.invoke(`${apiGroup.namespace}.${apiFunction.name}`, args);
		mainWorld[apiGroup.namespace][apiFunction.name] = wrappedFunction;
	}
}

for (let api of Object.keys(mainWorld)) {
	contextBridge.exposeInMainWorld(api, mainWorld[api]);
}
