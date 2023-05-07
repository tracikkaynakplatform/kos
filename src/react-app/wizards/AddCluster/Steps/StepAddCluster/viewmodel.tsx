import { addManagementCluster } from "kos-fe/api/management-cluster";
import { useReversibleLayout } from "kos-fe/contexts/ReversibleLayoutContext";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";

export function useViewModel(props: DefaultStepProps) {
	const layout = useReversibleLayout();
	const wizard = useWizard();

	const addCluster = async () => {
		layout.disableBack();
		modalErrorHandler(
			async () => {
				await addManagementCluster(wizard.data.name, wizard.data.config);
				props.goToNamedStep("end");
			},
			() => props.goToNamedStep("enterClusterName"),
			() => layout.enableBack()
		);
	};

	return {
		addCluster,
	};
}
