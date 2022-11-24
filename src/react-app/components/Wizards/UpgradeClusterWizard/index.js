import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useWizard, WizardProvider } from "../../../hooks/useWizard";
import StepWizard from "../../../lib/react-step-wizard";
import StepGetClusterInfo from "./StepGetClusterInfo.jsx";
import StepSelectVersion from "./StepSelectVersion.jsx";
import StepApplyTemplates from "./StepApplyTemplates.jsx";
import StepEnd from "./StepEnd.jsx";

function Content({ onFinish, onError }) {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepName("getClusterInfo");
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepName(stats.activeStepName);
			}}
			transitions={{}}
		>
			<StepGetClusterInfo onError={onError} stepName="getClusterInfo" />
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
