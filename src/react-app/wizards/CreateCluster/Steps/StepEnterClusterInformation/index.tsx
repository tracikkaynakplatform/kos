import { FormProvider } from "kos-fe/contexts";
import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { InputTextField, InputSelect } from "kos-fe/components/HookForm";
import { useViewModel } from "./viewmodel";

export function StepEnterClusterInformation(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Cluster information"
			text="Enter cluster information that you want to create."
			onNextClick={viewModel.goToNextStep}
			onBackClick={viewModel.goBack}
			width={500}
		>
			<FormProvider {...viewModel.formMethods}>
				<div className="flex flex-col gap-5">
					<InputTextField name="name" label="Cluster Name" />
					<InputSelect name="kubernetesVersion" label="Kubernetes Version" options={viewModel.versionOptions} />
					<InputTextField defaultValue="1" type="number" name="controlPlaneCount" label="Control Plane Count" />
					<InputTextField defaultValue="1" type="number" name="workerCount" label="Worker Count" />
				</div>
			</FormProvider>
		</StepWrapper>
	);
}
