import { Dispatch, ReactNode, SetStateAction } from "react";

export type WizardProviderProps = {
	children?: ReactNode;
	additionalData?: any;
};

export interface WizardContextType {
	data: any;
	stepName: string;
	setStepName: Dispatch<SetStateAction<string>>;
	updateData: (key: any, value: any) => Promise<void>;
	goToNamedStep?: (step: string) => void;
}
