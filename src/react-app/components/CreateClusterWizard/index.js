import { Box } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import StepWizard from "react-step-wizard";
import StepOperation from "./StepOperation";
import StepManagementCluster from "./StepManagementCluster";
import StepSelectProvider from "./StepSelectProvider";
import StepKindProviderConfig from "./StepKindProviderConfig";
import StepDigitalOceanSSHkey from "./StepDigitalOceanSSHkey";
import StepDigitalOceanClusterConfig from "./StepDigitalOceanClusterConfig";
import StepClusterKubeConfig from "./StepClusterKubeConfig";
import StepConnectingCluster from "./StepConnectingCluster";
import StepAddClusterCompleted from "./StepAddClusterCompleted";

const WizardContext = createContext({});
export const useWizard = () => useContext(WizardContext);
function WizardProvider({ children }) {
	const [data, setData] = useState({});
	const [stepIndex, setStepIndex] = useState({});

	const updateData = (key, value) => {
		let newData = Object.assign({}, data);
		newData[key] = value;
		setData(newData);
	};

	return (
		<WizardContext.Provider
			value={{
				data,
				stepIndex,
				setStepIndex,
				updateData,
			}}
		>
			{children}
		</WizardContext.Provider>
	);
}

function Content(props) {
	const wizard = useWizard();
	return (
		<StepWizard
			onStepChange={(stats) => {
				wizard.setStepIndex(stats.activeStep - 1);
			}}
			transitions={{}}
		>
			<StepOperation stepIndex={0} stepName="operation" />

			<StepManagementCluster stepIndex={1} stepName="managementCluster" />
			<StepSelectProvider stepIndex={2} stepName="selectProvider" />
			<StepKindProviderConfig stepIndex={3} stepName="kind" />
			<StepDigitalOceanSSHkey stepIndex={4} stepName="digitalocean" />
			<StepDigitalOceanClusterConfig
				stepIndex={5}
				stepName="digitalocean-clusterconfig"
			/>

			<StepClusterKubeConfig stepIndex={6} stepName="clusterKubeConfig" />

			<StepConnectingCluster stepIndex={7} stepName="connectingCluster" />

			<StepAddClusterCompleted
				stepIndex={8}
				stepName="addClusterCompleted"
			/>
		</StepWizard>
	);
}

export default function CreateClusterWizard(props) {
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
