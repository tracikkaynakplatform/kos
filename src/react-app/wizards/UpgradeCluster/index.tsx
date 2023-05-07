import { StepWizard } from "../StepWizard";
import { StepEnd, StepUpgrade, StepSelectVersion, StepSelectUpgradeNode } from "./Steps";

export function UpgradeCluster() {
	return (
		<StepWizard>
			<StepSelectUpgradeNode stepName="selectUpgradeNode" />
			<StepSelectVersion stepName="selectVersion" />
			<StepUpgrade stepName="upgrade" />
			<StepEnd stepName="end" />
		</StepWizard>
	);
}
