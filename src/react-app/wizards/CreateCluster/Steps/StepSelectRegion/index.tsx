import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputSelect } from "kos-fe/components/HookForm";

export function StepSelectRegion(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Select region"
			onLoad={viewModel.loadRegions}
			onBackClick={viewModel.goBack}
			onNextClick={viewModel.goNext}
			width={600}
		>
			<FormProvider {...viewModel.formMethods}>
				<InputSelect name="region" isLoading={viewModel.isLoading()} options={viewModel.regions} />
			</FormProvider>
		</StepWrapper>
	);
}
