import { useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";

export function useViewModel(props: DefaultStepProps) {
	const formMethods = useForm();
	const wizard = useWizard();

	const goNext = formMethods.handleSubmit((values: any) => {
		wizard.updateData("updateNode", values.updateNode);
		props.goToNamedStep("selectReplicaCount");
	});

	return {
		formMethods,
		goNext,
	};
}
