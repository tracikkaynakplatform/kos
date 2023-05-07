import { useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";

export function useViewModel(props: DefaultStepProps) {
	const formMethods = useForm();
	const wizard = useWizard();

	const goNext = formMethods.handleSubmit((values: any) => {
		wizard.updateData("upgradeNode", values.upgradeNode);
		props.goToNamedStep("selectVersion");
	});

	return {
		formMethods,
		goNext,
	};
}
