import React from "react";
import { CircularProgress, Box } from "@mui/material";
import Wrapper from "./StepWizardWrapper.jsx";

export default function StepBaseLoading({ info, title, ...props }) {
	return (
		<Wrapper title={title} text={info} {...props}>
			<CircularProgress />
		</Wrapper>
	);
}
