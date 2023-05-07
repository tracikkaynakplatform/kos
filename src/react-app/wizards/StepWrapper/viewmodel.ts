import { useWizard } from "kos-fe/contexts/WizardContext";
import { useEffect } from "react";

export function useViewModel(stepName: string, onLoad?: () => void) {
	const { stepName: currentStepName } = useWizard();

	useEffect(() => {
		if (stepName === currentStepName) {
			onLoad?.();
		}
	}, [currentStepName]);
}
