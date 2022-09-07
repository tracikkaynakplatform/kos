import { Typography, CircularProgress, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import Wrapper from "./Wrapper";
import { useWizard } from ".";

export default function StepKindCreateCluster(props) {
	const snack = useSnackbar().enqueueSnackbar;
	const wizard = useWizard();
	const [infoText, setInfoText] = useState("");
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			stepIndex={props.stepIndex}
			disableNext
			disableBack
			onLoad={async () => {
				try {
					try {
						await clusterctl.check();
					} catch (err) {
						setInfoText("clusterctl bulunamadı! İndiriliyor...");
						await clusterctl.download();
					}
					await clusterctl.setConfig(wizard.data.config);
					setInfoText(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clsuterctl generate)"
					);
					let yamlPath = await clusterctl.generateCluster(
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.masterCount,
						wizard.data.workerCount,
						true
					);
					setInfoText(
						"YAML dosyası yönetim kümesine uygulanıyor (kubectl apply)"
					);
					await kubectl.apply(yamlPath);
					_goto("addClusterComplete");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("kind");
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
				{infoText}
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
