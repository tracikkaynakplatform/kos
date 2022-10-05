import React, { useEffect } from "react";
import { Box } from "@mui/material";
import StepWizard from "../../lib/react-step-wizard";
import StepSelectProvider from "./StepSelectProvider";
import StepKindProviderConfig from "./StepKindProviderConfig";
import StepDigitalOceanSSHkey from "./StepDigitalOceanSSHkey";
import StepDigitalOceanClusterConfig from "./StepDigitalOceanClusterConfig";
import StepAddClusterCompleted from "./StepAddClusterComplete";
import StepKindCreateCluster from "./StepKindCreateCluster";
import StepAWSProviderConfig from "./StepAWSProviderConfig.jsx";
import { useWizard, WizardProvider } from "../../hooks/useWizard";

function Content({ onFinish }) {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepName("selectProvider");
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepName(stats.activeStepName);
			}}
			transitions={{}}
		>
			<StepSelectProvider
				manClusterName={wizard.manClusterName}
				stepName="selectProvider"
			/>

			{/* Kind */}
			<StepKindProviderConfig stepName="kindProviderConfig" />
			<StepKindCreateCluster stepName="kindCreateCluster" />

			{/* DigitalOcean */}
			<StepDigitalOceanSSHkey stepName="digitalOceanSSHkey" />
			<StepDigitalOceanClusterConfig stepName="digitalOceanClusterConfig" />

			{/* AWS */}
			<StepAWSProviderConfig stepName="AWSProviderConfig" />

			<StepAddClusterCompleted
				stepName="addClusterComplete"
				onFinish={onFinish}
			/>
		</StepWizard>
	);
}

export default function CreateClusterWizard({ manClusterName, onFinish }) {
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
			<WizardProvider additionalData={{ manClusterName }}>
				<Content onFinish={onFinish} />
			</WizardProvider>
		</Box>
	);
}
