import Clusterctl from "../services/Clusterctl";

export const clusterctlService = new Clusterctl();

async function check() {
	return await clusterctlService.check();
}

async function download() {
	return await clusterctlService.download();
}

async function setConfig(_, content) {
	await clusterctlService.config.changeContent(content);
}

async function setConfigPath(_, path) {
	return await clusterctlService.config.changePath(path);
}

async function getConfig() {
	return clusterctlService.config.config;
}

async function getConifgPath() {
	return clusterctlService.config.path;
}

async function generateCluster(
	_,
	clusterName,
	kubernetesVersion,
	masterCount,
	workerCount,
	isDocker
) {
	return await clusterctlService.generateCluster(
		clusterName,
		kubernetesVersion,
		masterCount,
		workerCount,
		isDocker
	);
}

export default [
	{
		name: "clusterctl:setConfig",
		action: setConfig,
	},
	{
		name: "clusterctl:check",
		action: check,
	},
	{
		name: "clusterctl:download",
		action: download,
	},
	{
		name: "clusterctl:generateCluster",
		action: generateCluster,
	},
	{
		name: "clusterctl:setConfigPath",
		action: setConfigPath,
	},
	{
		name: "clusterctl:getConfig",
		action: getConfig,
	},
	{
		name: "clusterctl:getConifgPath",
		action: getConifgPath,
	},
];
