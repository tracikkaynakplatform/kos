import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputSelect } from "kos-fe/components/HookForm";
import { Icon } from "@iconify/react";

export function StepSelectVersion(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Choice Kubernetes version"
			text="If you don't see the version that you want to upgrade to it, you may need upgrade worker node(s) before."
			onLoad={viewModel.loadVersions}
			onBackClick={viewModel.goBack}
			onNextClick={viewModel.goNext}
			width={600}
		>
			<div className="flex flex-col gap-3 w-full">
				<div className="font-bold text-lg flex gap-2">
					Current version is: {viewModel.currentVersion ?? <Icon icon="eos-icons:loading" />}
				</div>
				<FormProvider {...viewModel.formMethods}>
					<InputSelect name="version" isLoading={viewModel.isLoading()} options={viewModel.possibleVersions} />
				</FormProvider>
			</div>
		</StepWrapper>
	);
}
