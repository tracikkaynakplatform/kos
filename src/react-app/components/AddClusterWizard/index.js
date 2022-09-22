import React, { useEffect } from "react";
import StepWizard from "react-step-wizard";
import { useWizard, WizardProvider } from "../../hooks/useWizard";
import StepKubeConfig from "./StepKubeConfig";
import StepConnecting from "./StepConnecting";
import { Box } from "@mui/material";
import StepEnd from "./StepEnd";

function Content(props) {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepIndex(0);
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepIndex(stats.activeStep - 1);
			}}
			transitions={{}}
		>
			<StepKubeConfig stepIndex={0} stepName="kubeConfig" />
			<StepConnecting stepIndex={1} stepName="connecting" />
			<StepEnd stepIndex={2} stepName="end" />
		</StepWizard>
	);
}

export default function AddClusterWizard() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
			}}
		>
			<WizardProvider>
				<Content />
			</WizardProvider>
		</Box>
	);
}
