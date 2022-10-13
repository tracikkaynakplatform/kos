import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper.jsx";
import kubectl from "../../api/kubectl";
import clusterctl from "../../api/clusterctl";
import kubeConfig from "../../api/kubeConfig";

export default function StepGetClusterInfo({
	onError,
	goToNamedStep,
	...props
}) {
	const [infoText, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<Wrapper
			disableNext
			disableBack
			onLoad={async () => {
				try {
					const config = await kubeConfig.loadManagementConfig(
						wizard.manClusterName
					);
					// TODO: Provider tipini bul.
					const templates = await kubectl.get(
						config,
						"dockermachinetemplate",
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

					delete workerTemplate.metadata.creationTimestamp;
					delete workerTemplate.metadata.generation;
					delete workerTemplate.metadata.resourceVersion;
					delete workerTemplate.metadata.uid;

					controlPlaneTemplate.metadata.name += "-kos-upgrade";
					workerTemplate.metadata.name += "-kos-upgrade";

					// TODO: Provider tipini de wizard data'ya ekle.
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
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Küme hakkında bilgi toplanıyor...
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<Typography>{infoText}</Typography>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
