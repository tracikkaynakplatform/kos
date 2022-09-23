import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper";

export default function StepConnecting(props) {
	const [infoText, setInfoText] = useState("");
	const snack = useSnackbar().enqueueSnackbar;
	const wizard = useWizard();
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			disableBack
			disableNext
			stepIndex={props.stepIndex}
			onLoad={async () => {
				try {
					setInfoText("Yönetim kümesinin adı alınıyor...");
					let manName = await kubectl.currentContext(
						wizard.data.config
					);

					setInfoText(
						"Desteklenen altyapı sağlayıcılarının bilgisi alınıyor..."
					);
					let supportedProviders =
						await clusterConfig.getSupportedProviders(
							wizard.data.config
						);

					if (supportedProviders.length == 0)
						throw new Error(
							"Desteklenen altyapı sağlayıcıları bulunamadı!\nKümenin bir yönetim kümesi olduğundan emin olun."
						);

					setInfoText(
						"Yönetim kümesi kubeconfig dosyası kayıt ediliyor..."
					);
					await kubeConfig.saveManagementConfig(
						wizard.data.config,
						manName
					);
					_goto("end");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("kubeConfig");
				}
			}}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Kümeye bağlanılıyor...
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}
			>
				<Typography>{infoText}</Typography>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
