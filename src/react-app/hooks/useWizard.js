import React, { createContext, useContext, useState } from "react";

const WizardContext = createContext({});
export const useWizard = () => useContext(WizardContext);

export function WizardProvider({ children }) {
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
			}}
		>
			{children}
		</WizardContext.Provider>
	);
}
