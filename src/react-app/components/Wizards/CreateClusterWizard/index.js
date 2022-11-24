import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useWizard, WizardProvider } from "../../../hooks/useWizard";
import StepWizard from "../../../lib/react-step-wizard";
import StepSelectProvider from "./StepSelectProvider.jsx";
import StepKindProviderConfig from "./StepKindProviderConfig.jsx";
import StepAddClusterCompleted from "./StepAddClusterComplete.jsx";
import StepKindCreateCluster from "./StepKindCreateCluster.jsx";
import StepAWSProviderConfig from "./StepAWSProviderConfig.jsx";
import StepAWSCreateCluster from "./StepAWSCreateCluster.jsx";
import StepSelectAWSClusterType from "./StepSelectAWSClusterType.jsx";
import StepAWSProviderEKSConfig from "./StepAWSProviderEKSConfig.jsx";

function Content({ onFinish }) {
	const wizard = useWizard();

	useEffect(() => {
		wizard.setStepName("selectProvider");
	}, []);

	return (
		<StepWizard
			onStepChange={(stats) => wizard.setStepName(stats.activeStepName)}
			transitions={{}}
		>
			<StepSelectProvider
				manClusterName={wizard.manClusterName}
				stepName="selectProvider"
			/>

			{/* Kind */}
			<StepKindProviderConfig stepName="kindProviderConfig" />
			<StepKindCreateCluster stepName="kindCreateCluster" />

			{/* AWS */}
			<StepSelectAWSClusterType stepName="selectAWSClusterType" />
			<StepAWSProviderConfig stepName="AWSProviderConfig" />
			<StepAWSProviderEKSConfig stepName="AWSProviderEKSConfig" />
			<StepAWSCreateCluster stepName="AWSCreateCluster" />

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
