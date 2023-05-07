import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputSelect, InputTextField } from "kos-fe/components/HookForm";

export function StepSelectReplicaCount(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Enter replica count"
			onLoad={viewModel.getReplicaCount}
			onBackClick={viewModel.goBack}
			onNextClick={viewModel.goNext}
			width={600}
		>
			<FormProvider {...viewModel.formMethods}>
				{viewModel.updateNode == "worker" ? (
					<InputTextField type="number" name="replicaCount" />
				) : (
					<InputSelect
						name="replicaCount"
						options={[1, 3, 5, 7].map((x) => ({
							id: x.toString(),
							label: x.toString(),
							value: x,
						}))}
					/>
				)}
			</FormProvider>
		</StepWrapper>
	);
}
