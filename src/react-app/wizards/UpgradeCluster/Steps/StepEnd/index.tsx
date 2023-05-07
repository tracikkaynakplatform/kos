import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";

export function StepEnd(props: DefaultStepProps) {
	const viewModel = useViewModel();

	return (
		<StepWrapper
			stepName={props.stepName}
			title="Finish"
			text="Node(s) patched successfully. The upgrade process may take several minutes. You can check last status of the cluster from details page."
			onNextClick={viewModel.goNext}
			disableBack
			width={600}
		/>
	);
}
