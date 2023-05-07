import { StepWrapper } from "kos-fe/wizards/StepWrapper";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { CircularProgress } from "kos-fe/components/UI";

export function StepUpdate(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper stepName={props.stepName} title="Updating" onLoad={viewModel.updateNode} disableBack disableNext width={600}>
			<div className="w-full flex items-center justify-center">
				<div className="w-[100px] h-[100px]">
					<CircularProgress />
				</div>
			</div>
		</StepWrapper>
	);
}
