import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import Wrapper from "./StepWizardWrapper.jsx";

export default function StepBaseLoading({ info, title, ...props }) {
	return (
		<Wrapper {...props}>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				{title}
			</Typography>
			<Box
				sx={{
					m: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<Typography>{info}</Typography>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
