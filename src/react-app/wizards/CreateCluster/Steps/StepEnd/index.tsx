import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";

export function StepEnd(props: DefaultStepProps) {
	const viewModel = useViewModel();

	return (
		<StepWrapper
			stepName={props.stepName}
			disableBack
			onNextClick={viewModel.returnToMainPage}
			title="Finish"
			text="Your cluster created successfully. You can view or edit your cluster by management cluster detail page."
		/>
	);
}
