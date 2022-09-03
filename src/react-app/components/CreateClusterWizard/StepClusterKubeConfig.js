import { Typography, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { translate } from "../../locales";
import React from "react";
import Wrapper from "./Wrapper";
import { useWizard } from ".";

export default function StepClusterKubeConfig(props) {
	const [kubeconfigData, setKubeconfigData] = useState("");
	const wizard = useWizard();
	const [textFieldEnabled, setTextFieldEnabled] = useState(true);
	const [buttonsEnabled, setButtonsEnabled] = useState(true);
	const snack = useSnackbar().enqueueSnackbar;
	const closeSnack = useSnackbar().closeSnackbar;
	const _next = props.nextStep;
	const _goto = props.goToNamedStep;
	const _back = props.previousStep;

	return (
		<Wrapper
			disableBack={!buttonsEnabled}
			disableNext={!buttonsEnabled}
			onNextClick={async () => {}}
			onBackClick={() => {
				_goto("operation");
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
				Küme bilgileri
			</Typography>
			<Typography>
				Eklemek istediğiniz kümenin kubeconfig içeriğini giriniz.
				<br />
				(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği
				alınmıştır)
			</Typography>
			<TextField
				disabled={!textFieldEnabled}
				onChange={(e) => setKubeconfigData(e.target.value)}
				value={kubeconfigData}
				sx={{ mt: 2, mb: 2, width: "700px" }}
				label={translate("kubeConfigContent")}
				multiline
				rows={15}
			/>
		</Wrapper>
	);
}
