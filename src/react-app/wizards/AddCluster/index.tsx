import { StepWizard } from "kos-fe/wizards";
import { StepAddCluster, StepEnd, StepEnterClusterName, StepEnterKubeconfig } from "./Steps";

export function AddCluster() {
	return (
		<StepWizard>
			<StepEnterKubeconfig stepName="enterKubeconfig" />
			<StepEnterClusterName stepName="enterClusterName" />
			<StepAddCluster stepName="addCluster" />
			<StepEnd stepName="end" />
		</StepWizard>
	);
}
