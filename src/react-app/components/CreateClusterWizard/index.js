import { Box } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import StepWizard from "react-step-wizard";
import StepOperation from "./StepOperation";
import StepKubeConfig from "./StepKubeConfig";
import StepSelectProvider from "./StepSelectProvider";
import StepKindProviderConfig from "./StepKindProviderConfig";
import StepDigitalOceanSSHkey from "./StepDigitalOceanSSHkey";
import StepDigitalOceanClusterConfig from "./StepDigitalOceanClusterConfig";

const WizardContext = createContext({});
export const useWizard = () => useContext(WizardContext);
function WizardProvider({ children }) {
	const [data, setData] = useState({});

	const updateData = (key, value) => {
		let newData = Object.assign({}, data);
		newData[key] = value;
		setData(newData);
	};

	return (
		<WizardContext.Provider
			value={{
				data,
				updateData,
			}}
		>
			{children}
		</WizardContext.Provider>
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
				<StepWizard transitions={{}}>
					<StepOperation />
					<StepKubeConfig />
					<StepSelectProvider stepName="selectProvider" />
					<StepKindProviderConfig stepName="kind" />
					<StepDigitalOceanSSHkey stepName="digitalocean" />
					<StepDigitalOceanClusterConfig stepName="digitalocean-clusterconfig" />
				</StepWizard>
			</WizardProvider>
		</Box>
	);
}
