import { WizardProvider } from "kos-fe/contexts/WizardContext";
import { default as LibStepWizard } from "lib/react-step-wizard";
import { Children, ReactNode } from "react";
import { useViewModel } from "./viewmodel";
import { StepWizardProps } from "./types";

function Content({ children }: { children: ReactNode }) {
	const { updateStepName } = useViewModel(Children.toArray(children)[0]?.props.stepName);

	return (
		<LibStepWizard onStepChange={updateStepName} transitions={{}}>
			{children}
		</LibStepWizard>
	);
}

export function StepWizard(props: StepWizardProps) {
	return (
		<WizardProvider additionalData={props.additionalData}>
			<Content>{props.children}</Content>
		</WizardProvider>
	);
}
