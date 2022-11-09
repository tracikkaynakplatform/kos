import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepEnd(props) {
	const nav = useNavigate();
	return (
		<Wrapper
			disableBack
			onNextClick={() => nav("/management-clusters", { replace: true })}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Küme ekleme başarılı!
			</Typography>
		</Wrapper>
	);
}