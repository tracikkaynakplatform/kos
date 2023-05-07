import { upgradeWorker, upgradeControlPlane } from "kos-fe/api/management-cluster";
import { useReversibleLayout, useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useParams } from "react-router-dom";

export function useViewModel(props: DefaultStepProps) {
	const { managementClusterName, clusterName } = useParams();
	const layout = useReversibleLayout();
	const wizard = useWizard();

	const upgradeNode = () => {
		layout.disableBack();
		modalErrorHandler(
			async () => {
				if (wizard.data.upgradeNode == "worker") {
					await upgradeWorker(managementClusterName, clusterName, wizard.data.version);
				} else {
					await upgradeControlPlane(managementClusterName, clusterName, wizard.data.version);
				}
				props.goToNamedStep("end");
			},
			() => props.goToNamedStep("selectVersion"),
			() => layout.enableBack()
		);
	};

	return {
		upgradeNode,
	};
}
