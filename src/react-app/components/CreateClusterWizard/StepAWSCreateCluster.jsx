import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepAWSCreateCluster({ goToNamedStep, ...props }) {
	const [infoText, setInfoText] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<Wrapper
			disableBack
			disableNext
			onLoad={async () => {
				try {
					setInfoText(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clusterctl generate)"
					);
					let yaml = await clusterctl.generateCluster(
						wizard.data.config,
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.masterCount,
						wizard.data.workerCount,
						false,
						"aws",
						{
							AWS_REGION: wizard.data.region,
							AWS_SSH_KEY_NAME: wizard.data.sshKeyName,
							AWS_CONTROL_PLANE_MACHINE_TYPE:
								wizard.data.masterMachineType,
							AWS_NODE_MACHINE_TYPE:
								wizard.data.workerMachineType,
						}
					);
					setInfoText(
						"YAML dosyası yönetim kümesine uygulanıyor (kubectl apply)"
					);
					await kubectl.apply(wizard.data.config, yaml);
					_goto("addClusterComplete");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("AWSProviderConfig");
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
				Küme oluşturuluyor
			</Typography>
			<Box
				sx={{
					p: 3,
					width: "500px",
					display: "flex",
					gap: "10px",
				}}
			>
				<CircularProgress />
				<Typography>{infoText}</Typography>
			</Box>
		</Wrapper>
	);
}
