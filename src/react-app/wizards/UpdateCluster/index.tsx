import { StepWizard } from "../StepWizard";
import { StepEnd, StepUpdate, StepSelectReplicaCount, StepSelectUpdateNode } from "./Steps";

export function UpdateCluster() {
	return (
		<StepWizard>
			<StepSelectUpdateNode stepName="selectUpdateNode" />
			<StepSelectReplicaCount stepName="selectReplicaCount" />
			<StepUpdate stepName="update" />
			<StepEnd stepName="end" />
		</StepWizard>
	);
}
