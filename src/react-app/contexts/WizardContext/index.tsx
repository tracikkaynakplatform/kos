import { createContext, useContext, useState } from "react";
import { WizardContextType, WizardProviderProps } from "./types";

const WizardContext = createContext<WizardContextType | any>({});
export const useWizard = () => useContext(WizardContext) as WizardContextType;

export function WizardProvider(props: WizardProviderProps) {
	const [data, setData] = useState({ ...props.additionalData });
	const [stepName, setStepName] = useState("");

	const updateData = async (key: any, value: any) => {
		let newData: any = {};
		newData[key] = value;
		await setData((data: any) => ({
			...data,
			...newData,
		}));
	};

	return (
		<WizardContext.Provider
			value={{
				data,
				stepName,
				setStepName,
				updateData,
				goToNamedStep: () => {},
			}}
		>
			{props.children}
		</WizardContext.Provider>
	);
}
