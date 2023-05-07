import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";
import { CircularProgress } from "kos-fe/components/UI";

export function StepCreateCluster(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			disableBack
			disableNext
			onLoad={viewModel.onLoad}
			stepName={props.stepName}
			title="Cluster creating"
			text={viewModel.status}
			width={500}
			extraButtons={<button onClick={viewModel.continueBackground}>Continue at background</button>}
		>
			<div className="w-full flex items-center justify-center">
				<div className="w-[100px] h-[100px]">
					<CircularProgress />
				</div>
			</div>
		</StepWrapper>
	);
}
