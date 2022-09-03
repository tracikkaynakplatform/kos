import { kubectlService } from "./kubectl";

async function getProviders() {
	let providers = [];
	let pods = JSON.parse(await kubectlService.get("pods", "json", "-A")); // --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' -A
	for (let i of pods.items) {
		switch (i.metadata.namespace) {
			case "capd-system":
				providers.push("docker");
				break;
			case "capdo-system":
				providers.push("digitalocean");
				break;
		}
	}
	return providers;
}

export default [
	{
		name: "providers:getProviders",
		action: getProviders,
	},
];
