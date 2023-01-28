import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useWizard, WizardProvider } from "../../../hooks/useWizard";
import { StepApplyTemplates, StepEnd, StepSelectVersion } from "./Steps";
import StepWizard from "../../../lib/react-step-wizard";
import StepSelectUpgradeType from "./Steps/StepSelectUpgradeType";

function Content({ onFinish, onError }) {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepName("selectUpgradeType");
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepName(stats.activeStepName);
			}}
			transitions={{}}
		>
			<StepSelectUpgradeType stepName="selectUpgradeType" />
			<StepSelectVersion stepName="selectVersion" />
			<StepApplyTemplates stepName="applyTemplates" />
			<StepEnd onFinish={onFinish} stepName="end" />
		</StepWizard>
	);
}

export default function UpgradeClusterWizard({
	manClusterName,
	clusterName,
	onFinish,
	onError,
}) {
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
			<WizardProvider additionalData={{ manClusterName, clusterName }}>
				<Content onError={onError} onFinish={onFinish} />
			</WizardProvider>
		</Box>
	);
}
