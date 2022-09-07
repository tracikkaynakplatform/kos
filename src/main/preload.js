import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("kubectl", {
	check: () => ipcRenderer.invoke("kubectl:check"),
	download: () => ipcRenderer.invoke("kubectl:download"),
	get: (...args) => ipcRenderer.invoke("kubectl:get", ...args),
	apply: (...args) => ipcRenderer.invoke("kubectl:apply", ...args),
	setConfig: (content) => ipcRenderer.invoke("kubectl:setConfig", content),
	getConfig: () => ipcRenderer.invoke("kubectl:getConfig", content),
	setConfigPath: (path) => ipcRenderer.invoke("kubectl:setConfigPath", path),
	getConfigPath: () => ipcRenderer.invoke("kubectl:getConfigPath", path),
});

contextBridge.exposeInMainWorld("kubeConfig", {
	defaultConfig: () => ipcRenderer.invoke("kubeConfig:defaultConfig"),
});

contextBridge.exposeInMainWorld("providers", {
	getProviders: (kubeConfig) =>
		ipcRenderer.invoke("providers:getProviders", kubeConfig),
});

contextBridge.exposeInMainWorld("clusterctl", {
	check: () => ipcRenderer.invoke("clusterctl:check"),
	download: () => ipcRenderer.invoke("clusterctl:download"),
	setConfig: (content) => ipcRenderer.invoke("clusterctl:setConfig", content),
	getConfig: () => ipcRenderer.invoke("clusterctl:getConfig", content),
	setConfigPath: (path) =>
		ipcRenderer.invoke("clusterctl:setConfigPath", path),
	getConfigPath: () => ipcRenderer.invoke("clusterctl:getConfigPath", path),
	generateCluster: (
		clusterName,
		kubernetesVersion,
		masterCount,
		workerCount,
		isDocker = false
	) =>
		ipcRenderer.invoke(
			"clusterctl:generateCluster",
			clusterName,
			kubernetesVersion,
			masterCount,
			workerCount,
			isDocker
		),
});
