import KubeConfig from "../k8s/KubeConfig";
import Kubectl from "../services/Kubectl";

export const kubectlService = new Kubectl();

async function check() {
	return await kubectlService.check();
}

async function download() {
	return await kubectlService.download();
}

async function setConfig(_, content) {
	kubectlService.config = new KubeConfig(content);
	await kubectlService.config.write();
}

async function setConfigPath(_, path) {
	return await kubectlService.config.changePath(path);
}

async function getConfig() {
	return kubectlService.config.config;
}

async function getConifgPath() {
	return kubectlService.config.path;
}

async function get(_, ...args) {
	return await kubectlService.get(...args);
}

export default [
	{
		name: "kubectl:check",
		action: check,
	},
	{
		name: "kubectl:download",
		action: download,
	},
	{
		name: "kubectl:setConfig",
		action: setConfig,
	},
	{
		name: "kubectl:get",
		action: get,
	},
	{
		name: "kubectl:getConfig",
		action: getConfig,
	},
	{
		name: "kubectl:getConifgPath",
		action: getConifgPath,
	},
	{
		name: "kubectl:setConfigPath",
		action: setConfigPath,
	},
];
