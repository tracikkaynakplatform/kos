import React from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import StepBaseLoading from "../StepBaseLoading.jsx";
import { PROVIDER_CLASS } from "../../providers";
import kubectl from "../../api/kubectl";
import kubeConfig from "../../api/kubeConfig";
import clusterConfig from "../../api/clusterConfig";

export default function StepGetClusterInfo({
	onError,
	goToNamedStep,
	...props
}) {
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			title="Küme ile ilgili bilgi toplanıyor..."
			disableNext
			disableBack
			onLoad={async () => {
				try {
					const config = await kubeConfig.loadManagementConfig(
						wizard.manClusterName
					);
					const clusters = await clusterConfig.getClusters(config);
					let cluster;
					for (let i of clusters) {
						if (i.name == wizard.clusterName) {
							cluster = i;
							break;
						}
					}
					console.log("Cluster: ", cluster);
					if (!cluster) {
						snack("Küme bulunamadı!", {
							variant: "error",
							autoHideDuration: 2000,
						});
						onError();
						return;
					}
					const templates = await kubectl.get(
						config,
						`${PROVIDER_CLASS[cluster.provider]}machinetemplate`,
						"json"
					);
					let cpRegex = new RegExp(
						`${wizard.clusterName}-control-plane.*`,
						"g"
					);
					let wRegex = new RegExp(`${wizard.clusterName}-md-.*`, "g");
					var controlPlaneTemplate = null;
					var workerTemplate = null;
					for (let template of templates.items) {
						if (cpRegex.test(template.metadata.name))
							controlPlaneTemplate = template;
						if (wRegex.test(template.metadata.name))
							workerTemplate = template;

						if (workerTemplate && controlPlaneTemplate) break;
					}
					// Gereksiz veriyi nesnelerden temizle
					delete controlPlaneTemplate.metadata.creationTimestamp;
					delete controlPlaneTemplate.metadata.generation;
					delete controlPlaneTemplate.metadata.resourceVersion;
					delete controlPlaneTemplate.metadata.uid;
					delete controlPlaneTemplate.metadata.annotations;

					delete workerTemplate.metadata.creationTimestamp;
					delete workerTemplate.metadata.generation;
					delete workerTemplate.metadata.resourceVersion;
					delete workerTemplate.metadata.uid;
					delete workerTemplate.metadata.annotations;

					controlPlaneTemplate.metadata.name += "-kos-upgrade";
					workerTemplate.metadata.name += "-kos-upgrade";

					// TODO: Provider tipini de wizard data'ya ekle.
					wizard.updateData("provider", cluster.provider);
					wizard.updateData(
						"controlPlaneTemplate",
						controlPlaneTemplate
					);
					wizard.updateData("workerTemplate", workerTemplate);
					wizard.updateData("config", config);

					_goto("selectVersion");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					onError?.();
				}
			}}
			{...props}
		/>
	);
}
