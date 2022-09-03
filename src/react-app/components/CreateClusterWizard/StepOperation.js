import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { translate } from "../../locales";
import { useSnackbar } from "notistack";
import React from "react";
import { useState } from "react";
import Wrapper from "./Wrapper";

export default function StepOperation(props) {
	const snack = useSnackbar().enqueueSnackbar;
	const [operation, setOperation] = useState("");
	const _next = props.nextStep;
	const _goto = props.goToNamedStep;
	// const _back = props.previousStep;

	return (
		<Wrapper
			disableBack
			onNextClick={() => {
				if (operation === "newCluster") {
					_goto("managementCluster");
					return;
				}
				if (operation === "existingCluster") {
					_goto("clusterKubeConfig");
					return;
				}
				snack(translate("errSelectOperation"), {
					variant: "error",
					autoHideDuration: 2000,
				});
			}}
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
				Küme ekle
			</Typography>
			<Typography>
				Herhangi bir altyapı sağlayıcısında bulunan Kubernetes kümenizi
				eklemek
				<br />
				için 'Varolan küme' seçeneğini, yönetim kümesi yardımıyla bir
				altyapı sağlayıcısında
				<br />
				küme oluşturmak için 'Yeni küme' seçeneğini seçin.
			</Typography>
			<RadioGroup
				value={operation}
				onChange={(e) => setOperation(e.target.value)}
			>
				<FormControlLabel
					value="newCluster"
					control={<Radio />}
					label={translate("newCluster")}
				/>
				<FormControlLabel
					value="existingCluster"
					control={<Radio />}
					label={translate("existingCluster")}
				/>
			</RadioGroup>
		</Wrapper>
	);
}
