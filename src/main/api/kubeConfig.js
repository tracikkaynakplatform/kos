import KubeConfig from "../k8s/KubeConfig";

async function defaultConfig() {
	return await KubeConfig.defaultConfig();
}

export default [
	{
		name: "kubeConfig:defaultConfig",
		action: defaultConfig,
	},
];
