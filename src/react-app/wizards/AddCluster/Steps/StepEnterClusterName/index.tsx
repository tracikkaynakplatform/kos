import { FormProvider } from "kos-fe/contexts";
import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { InputTextField } from "kos-fe/components/HookForm";
import { useViewModel } from "./viewmodel";

export function StepEnterClusterName(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Management cluster's name"
			text="Enter management cluster's name"
			onLoad={viewModel.loadContextName}
			onNextClick={viewModel.goToNextStep}
			onBackClick={viewModel.goBackStep}
			width={500}
			height={250}
		>
			<FormProvider {...viewModel.formMethods}>
				<InputTextField name="name" />
			</FormProvider>
		</StepWrapper>
	);
}
