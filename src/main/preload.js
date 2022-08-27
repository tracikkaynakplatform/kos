import { contextBridge, ipcMain, ipcRenderer } from "electron";
import apis from './api';

contextBridge.exposeInMainWorld('kubectl', {
	check: () => ipcRenderer.invoke('kubectl:check'),
	download: () => ipcRenderer.invoke('kubectl:download'),
	get: (resourceType, kubeConfig) => ipcRenderer.invoke('kubectl:get', resourceType, kubeConfig)
})

contextBridge.exposeInMainWorld('kubeConfig', {
	loadFromDefault: () => ipcRenderer.invoke('kubeConfig:loadFromDefault')
})

contextBridge.exposeInMainWorld('providers', {
	getProviders: (kubeConfig) => ipcRenderer.invoke('providers:getProviders', kubeConfig)
});