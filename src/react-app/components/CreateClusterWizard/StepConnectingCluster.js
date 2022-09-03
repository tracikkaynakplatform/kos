import { Typography, CircularProgress, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import { translate } from "../../locales";
import Wrapper from "./Wrapper";

export default function StepConnectingCluster(props) {
	const snack = useSnackbar().enqueueSnackbar;
	// const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			disableBack
			disableNext
			onNextClick={() => {}}
			onBackClick={() => {}}
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
