import { ipcMain } from 'electron';
import config from '../k8s/kubeConfig';
import kubectl from '../k8s/kubectl';

const apis = [
	{
		name: 'kubectl:check',
		action: kubectl.check,
	},
	{
		name: 'kubectl:download',
		action: async (_) => {
			return (await kubectl.download());
		}
	},
	{
		name: 'kubectl:get',
		action: (_, resourceType, kubeConfig) => {
			config.loadFromString(kubeConfig);
			return (config.get(resourceType));
		}
	},
	{
		name: 'kubeConfig:loadFromDefault',
		action: () => {
			config.loadFromDefault();
			return (config.config);
		}
	},

	{
		name: 'providers:getProviders',
		action: (_, kubeConfig) => {
			config.loadFromString(kubeConfig);

			let providers = [];
			let pods = config.get('pods', '-A');

			for (let i of pods.items) {
				switch (i.metadata.namespace) {
					case 'capd-system':
						providers.push('docker');
						break ;
					case 'capdo-system':
						providers.push('digitalocean');
						break ;
				}
			}
			return (providers);
		}
	},
];

export function initApis() {
	apis.map(api => ipcMain.handle(api.name, api.action));
}