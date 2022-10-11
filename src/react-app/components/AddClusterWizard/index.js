import React, { useEffect } from "react";
import { useWizard, WizardProvider } from "../../hooks/useWizard";
import { Box } from "@mui/material";
import StepWizard from "../../lib/react-step-wizard";
import StepKubeConfig from "./StepKubeConfig.jsx";
import StepConnecting from "./StepConnecting.jsx";
import StepEnd from "./StepEnd.jsx";

function Content() {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepName("kubeConfig");
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepName(stats.activeStepName);
			}}
			transitions={{}}
		>
			<StepKubeConfig stepName="kubeConfig" />
			<StepConnecting stepName="connecting" />
			<StepEnd stepName="end" />
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
