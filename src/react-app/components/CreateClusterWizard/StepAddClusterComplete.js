import { Typography, CircularProgress, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import { translate } from "../../locales";
import Wrapper from "./Wrapper";
import { useWizard } from ".";

export default function StepAddClusterComplete(props) {
	//const snack = useSnackbar().enqueueSnackbar;
	const wizard = useWizard();
	// const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			stepIndex={props.stepIndex}
			disableNext
			disableBack
			onLoad={async () => {}}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Küme oluşturma başarılı.
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Typography>
					Küme oluşturma işlemi başarıyla sonuçlandı. Oluşturduğunuz
					kümenin hazır olup olmadığını kümeler menüsünden takip
					edebilirsiniz. [Sihirbaz sonlanır]
				</Typography>
			</Box>
		</Wrapper>
	);
}
