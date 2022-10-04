import React, { createContext, useContext, useState } from "react";

const WizardContext = createContext({});
export const useWizard = () => useContext(WizardContext);

export function WizardProvider({ children, additionalData }) {
	const [data, setData] = useState({});
	const [stepIndex, setStepIndex] = useState({});

	const updateData = async (key, value) => {
		let newData = {};
		newData[key] = value;
		await setData((data) => ({
			...data,
			...newData,
		}));
	};

	return (
		<WizardContext.Provider
			value={{
				data,
				stepIndex,
				setStepIndex,
				updateData,
				...additionalData,
			}}
		>
			{children}
		</WizardContext.Provider>
	);
}
