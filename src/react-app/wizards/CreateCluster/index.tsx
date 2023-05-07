import { StepWizard } from "kos-fe/wizards";
import {
	StepSelectInfrastructure,
	StepEnterClusterInformation,
	StepCreateCluster,
	StepEnd,
	StepSelectRegion,
	StepInfrastructureConfig,
} from "./Steps";

export function CreateCluster() {
	return (
		<StepWizard>
			<StepSelectInfrastructure stepName="selectInfrastructure" />
			<StepSelectRegion stepName="selectRegion" />
			<StepInfrastructureConfig stepName="infrastructureConfig" />
			<StepEnterClusterInformation stepName="enterClusterInformation" />
			<StepCreateCluster stepName="createCluster" />
			<StepEnd stepName="end" />
		</StepWizard>
	);
}
