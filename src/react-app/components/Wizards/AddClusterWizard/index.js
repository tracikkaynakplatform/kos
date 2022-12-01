import React, { useEffect } from "react";
import { useWizard, WizardProvider } from "../../../hooks/useWizard";
import { Box } from "@mui/material";
import { StepWizard } from "../../../lib/react-step-wizard";
import {
	StepConnecting,
	StepEnterClusterName,
	StepSaving,
	StepEnd,
	StepKubeConfig,
} from "./Steps";

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
			<StepEnterClusterName stepName="enterClusterName" />
			<StepSaving stepName="saving" />
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
				height: "100vh",
			}}
		>
			<WizardProvider>
				<Content />
			</WizardProvider>
		</Box>
	);
}
