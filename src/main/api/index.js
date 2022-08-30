import { ipcMain } from 'electron';
import kubeConfig from '../k8s/KubeConfig';
import kindConfig, { KindSteps } from '../k8s/KindConfig';
import kubectlService from '../services/Kubectl';

const apis = [
	// Kubectl API
	{
		name: 'kubectl:check',
		action: () => kubectlService.check(),
	},
	{
		name: 'kubectl:download',
		action: async (_) => {
			try {
				await kubectlService.download();
				return (true);
			}
			catch (err) {
				return (false);
			}
		}
	},
	{
		name: 'kubectl:get',
		action: (_, resourceType, kubeConfig) => {
			kubeConfig.loadFromString(kubeConfig);
			return (kubeConfig.get(resourceType));
		}
	},
	{
		name: 'kubeConfig:loadFromDefault',
		action: () => {
			kubeConfig.loadFromDefault();
			return (kubeConfig.config);
		}
	},

	// Provider API
	{
		name: 'providers:getProviders',
		action: (_, kubeConfig) => {
			kubeConfig.loadFromString(kubeConfig);

			let providers = [];
			let pods = kubeConfig.get('pods', '-A');

			for (let i of pods.items) {
				switch (i.metadata.namespace) {
					case 'capd-system':
						providers.push('docker');
						break;
					case 'capdo-system':
						providers.push('digitalocean');
						break;
				}
			}
			return (providers);
		}
	},

	// Kind API
	{
		name: 'kind:createCluster',
		action: async (_, name) => {
			await kindConfig.createCluster(name, (status) => console.log(status));
		}
	}
];

export function initApis() {
	apis.map(api => ipcMain.handle(api.name, api.action));
}