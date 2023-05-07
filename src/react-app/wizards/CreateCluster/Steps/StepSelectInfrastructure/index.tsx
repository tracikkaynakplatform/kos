import { FormProvider } from "kos-fe/contexts";
import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { InputSelect } from "kos-fe/components/HookForm";
import { useViewModel } from "./viewmodel";

export function StepSelectInfrastructure(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			onLoad={viewModel.loadInfrastructures}
			onNextClick={viewModel.goToNextStep}
			disableBack
			title="Select Infrastructure"
			width={600}
			text="Select an infrastructure where the new cluster will be installed on it."
		>
			<FormProvider {...viewModel.formMethods}>
				<InputSelect name="infrastructure" isLoading={viewModel.isLoading()} options={viewModel.infrastructures} />
			</FormProvider>
		</StepWrapper>
	);
}
