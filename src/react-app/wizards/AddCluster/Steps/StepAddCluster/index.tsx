import { CircularProgress } from "kos-fe/components/UI";
import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";

export function StepAddCluster(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper disableBack disableNext stepName={props.stepName} title="Cluster adding" onLoad={viewModel.addCluster}>
			<div className="w-full h-full flex items-center justify-center">
				<div className="w-5 h-5">
					<CircularProgress />
				</div>
			</div>
		</StepWrapper>
	);
}
