import React, { useEffect } from "react";
import { Box } from "@mui/material";
import StepWizard from "react-step-wizard";
import StepSelectProvider from "./StepSelectProvider";
import StepKindProviderConfig from "./StepKindProviderConfig";
import StepDigitalOceanSSHkey from "./StepDigitalOceanSSHkey";
import StepDigitalOceanClusterConfig from "./StepDigitalOceanClusterConfig";
import StepAddClusterCompleted from "./StepAddClusterComplete";
import StepKindCreateCluster from "./StepKindCreateCluster";
import { useWizard, WizardProvider } from "../../hooks/useWizard";

function Content({ manClusterName, onFinish }) {
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
			<StepSelectProvider
				manClusterName={manClusterName}
				stepIndex={0}
				stepName="selectProvider"
			/>

			{/* Kind */}
			<StepKindProviderConfig
				stepIndex={1}
				stepName="kindProviderConfig"
			/>
			<StepKindCreateCluster stepIndex={2} stepName="kindCreateCluster" />

			{/* DigitalOcean */}
			<StepDigitalOceanSSHkey
				stepIndex={3}
				stepName="digitalOceanSSHkey"
			/>
			<StepDigitalOceanClusterConfig
				stepIndex={4}
				stepName="digitalOceanClusterConfig"
			/>

			<StepAddClusterCompleted
				stepIndex={5}
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
				height: "100%",
			}}
		>
			<WizardProvider>
				<Content manClusterName={manClusterName} onFinish={onFinish} />
			</WizardProvider>
		</Box>
	);
}
