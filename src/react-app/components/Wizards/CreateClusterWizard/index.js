import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useWizard, WizardProvider } from "../../../hooks/useWizard";
import {
	StepAddClusterComplete,
	StepAWSCreateCluster,
	StepAWSProviderConfig,
	StepAWSProviderEKSConfig,
	StepKindCreateCluster,
	StepKindProviderConfig,
	StepSelectAWSClusterType,
	StepSelectProvider,
	StepFetchWorkloadCluster,
} from "./Steps";
import StepWizard from "../../../lib/react-step-wizard";

function Content({ onFinish }) {
	const wizard = useWizard();

	const isEdit = wizard.clusterName  ? true : false;

	useEffect(() => {
		wizard.setStepName(isEdit ? "fetchWorkloadCluster" : "selectProvider");
	}, []);

	
	console.log(`wizard.clusterName = ${wizard.clusterName} .`);
	return (
		<div>
		{ !isEdit &&
			<StepWizard
				onStepChange={(stats) => wizard.setStepName(stats.activeStepName)}
				transitions={{}}
			>
				
				<StepSelectProvider
					manClusterName={wizard.manClusterName}
					stepName="selectProvider"
				/>
				
				<StepKindProviderConfig stepName="kindProviderConfig" />
				<StepKindCreateCluster stepName="kindCreateCluster" />
			
				<StepSelectAWSClusterType stepName="selectAWSClusterType" />
				<StepAWSProviderConfig stepName="AWSProviderConfig" />
				<StepAWSProviderEKSConfig stepName="AWSProviderEKSConfig" />
				<StepAWSCreateCluster stepName="AWSCreateCluster" />

				<StepAddClusterComplete
					stepName="addClusterComplete"
					onFinish={onFinish}
				/>
			 
			</StepWizard>
		}
		{ isEdit &&
				<StepWizard
				onStepChange={(stats) => wizard.setStepName(stats.activeStepName)}
				transitions={{}}
				>				
					<StepFetchWorkloadCluster
						manClusterName={wizard.manClusterName}
						clusterName={wizard.clusterName}
						stepName="fetchWorkloadCluster"
					/>
					<StepAWSProviderConfig stepName="AWSProviderConfig" />
				</StepWizard>
		}
		</div>
	);
}

export default function CreateClusterWizard({ clusterName, manClusterName, onFinish }) {
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
			<WizardProvider additionalData={{ clusterName, manClusterName }}>
				<Content onFinish={onFinish} />
			</WizardProvider>
		</Box>
	);
}
