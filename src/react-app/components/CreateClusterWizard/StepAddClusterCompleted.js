import { Typography, Link as MUILink, Box, TextField } from "@mui/material";
import { useState } from "react";
// import { useSnackbar } from 'notistack';
import React from "react";
import Wrapper from "./Wrapper";

export default function StepAddClusterCompleted(props) {
	// const snack = useSnackbar().enqueueSnackbar;
	// const _next = props.nextStep;
	// const _back = props.previousStep;
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			stepIndex={props.stepIndex}
			disableNext
			onLoad={() => console.log("hello")}
			onBackClick={() => {
				_goto("clusterKubeConfig");
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
				Küme bağlantısı başarılı
			</Typography>
			<Box
				sx={{
					mt: "10px",
					mb: "10px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<Typography>
					Küme bağlantısı başarılı bir şekilde gerçekleştirildi.
					[Sihirbaz sonlanır]
				</Typography>
			</Box>
		</Wrapper>
	);
}
