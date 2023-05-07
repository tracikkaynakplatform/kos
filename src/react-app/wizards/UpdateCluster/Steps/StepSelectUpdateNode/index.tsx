import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputRadioGroup } from "kos-fe/components/HookForm";

export function StepSelectUpdateNode(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Select update type"
			text="Select the node type that you want to update."
			onNextClick={viewModel.goNext}
			disableBack
			width={600}
		>
			<FormProvider {...viewModel.formMethods}>
				<InputRadioGroup
					name="updateNode"
					options={[
						{
							label: "Control Plane",
							value: "controlPlane",
							checked: true,
						},
						{
							label: "Worker",
							value: "worker",
						},
					]}
				/>
			</FormProvider>
		</StepWrapper>
	);
}
