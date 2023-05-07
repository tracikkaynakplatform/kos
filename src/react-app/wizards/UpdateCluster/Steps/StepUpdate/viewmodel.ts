import { updateWorker, updateControlPlane } from "kos-fe/api/management-cluster";
import { useReversibleLayout, useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useParams } from "react-router-dom";

export function useViewModel(props: DefaultStepProps) {
	const { managementClusterName, clusterName } = useParams();
	const layout = useReversibleLayout();
	const wizard = useWizard();

	const updateNode = () => {
		layout.disableBack();
		modalErrorHandler(
			async () => {
				if (wizard.data.updateNode == "worker") {
					await updateWorker(managementClusterName, clusterName, +wizard.data.replicaCount);
				} else {
					await updateControlPlane(managementClusterName, clusterName, +wizard.data.replicaCount);
				}
				props.goToNamedStep("end");
			},
			() => props.goToNamedStep("selectReplicaCount"),
			() => layout.enableBack()
		);
	};

	return {
		updateNode,
	};
}
