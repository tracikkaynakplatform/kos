import { Typography, CircularProgress, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import { translate } from "../../locales";
import Wrapper from "./Wrapper";
import { useWizard } from ".";

export default function StepConnectingCluster(props) {
	const snack = useSnackbar().enqueueSnackbar;
	const wizard = useWizard();
	const [infoText, setInfoText] = useState("");
	// const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			stepIndex={props.stepIndex}
			disableNext
			disableBack
			onLoad={async () => {
				try {
					try {
						await kubectl.check();
					} catch (err) {
						const downloadSnack = snack(
							"kubectl bulunamadı! İndiriliyor...", // TODO: snackbar yükleniyor tasarımında olacak.
							{ variant: "info", persist: true }
						);

						await kubectl.download();
						closeSnack(downloadSnack);
					}

					snack("kubectl çalıştırılıyor...", {
						variant: "info",
						autoHideDuration: 2000,
					});
					await kubectl.get("namespace", "json", "-A");
					snack("Küme ile bağlantı sağlandı", {
						variant: "success",
						autoHideDuration: 2000,
					});
					_goto("addClusterCompleted");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("clusterKubeConfig");
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
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
