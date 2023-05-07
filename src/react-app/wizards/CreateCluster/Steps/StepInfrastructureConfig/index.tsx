import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputSelect } from "kos-fe/components/HookForm";

export function StepInfrastructureConfig(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Configure infrastructure"
			text="Select your infrastructure configuration such as SSH key and machine types."
			onLoad={viewModel.loadOptions}
			onBackClick={viewModel.goBack}
			onNextClick={viewModel.goNext}
			width={600}
		>
			<FormProvider {...viewModel.formMethods}>
				<div className="flex flex-col gap-5">
					<InputSelect name="sshKeyName" label="SSH Key" isLoading={viewModel.isLoading()} options={viewModel.keyPairs} />
					<InputSelect
						name="controlPlaneMachineType"
						label="Control Plane Machine Type"
						isLoading={viewModel.isLoading()}
						options={viewModel.machineTypes}
					/>
					<InputSelect
						name="workerMachineType"
						label="Worker Machine Type"
						isLoading={viewModel.isLoading()}
						options={viewModel.machineTypes}
					/>
				</div>
			</FormProvider>
		</StepWrapper>
	);
}
