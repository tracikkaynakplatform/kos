import React from "react";
import { CircularProgress } from "@mui/material";
import { StepWizardWrapper } from "./";

export default function StepBaseLoading({ info, title, ...props }) {
	return (
		<StepWizardWrapper title={title} text={info} {...props}>
			<CircularProgress />
		</StepWizardWrapper>
	);
}
