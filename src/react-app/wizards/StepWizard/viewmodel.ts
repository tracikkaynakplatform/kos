import { useWizard } from "kos-fe/contexts/WizardContext";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";

export function useViewModel(firstStepName: string) {
	const wizard = useWizard();

	useComponentDidMount(() => {
		wizard.setStepName(firstStepName);
	});

	const updateStepName = (stats: { activeStep: number; previousStep: number; activeStepName: string }) => {
		wizard.setStepName(stats.activeStepName);
	};

	return {
		updateStepName,
	};
}
