import { contextBridge, ipcRenderer } from "electron";
import { apis } from "./api";

const mainWorld = {};

for (let apiGroup of apis) {
	for (let api of apiGroup.apis) {
		if (!mainWorld[apiGroup.namespace]) mainWorld[apiGroup.namespace] = {};
		mainWorld[apiGroup.namespace][api.name] = (...args) =>
			ipcRenderer.invoke(`${apiGroup.namespace}:${api.name}`, args);
	}
}

for (let api of Object.keys(mainWorld)) {
	contextBridge.exposeInMainWorld(api, mainWorld[api]);
}
