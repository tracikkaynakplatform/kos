import React from "react";
import { Typography, Box } from "@mui/material";
import Wrapper from "../StepWizardWrapper";

export default function StepAWSProviderConfig({ goToNamedStep, ...props }) {
	return (
		<Wrapper
			onBackClick={() => {
				goToNamedStep("selectProvider");
			}}
			onNextClick={() => {}}
			{...props}
		>
			AWS Bilgileri
		</Wrapper>
	);
}
