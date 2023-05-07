import { getManagementCluster } from "kos-fe/api/management-cluster";
import { useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export function useViewModel(props: DefaultStepProps) {
	const { managementClusterName, clusterName } = useParams();
	const formMethods = useForm();
	const wizard = useWizard();

	const getReplicaCount = async () => {
		const managementCluster = await getManagementCluster(managementClusterName);
		const cluster = managementCluster.clusters.find((x) => x.name == clusterName);

		if (wizard.data.updateNode == "worker") {
			formMethods.setValue("replicaCount", cluster.workerCount);
		} else {
			formMethods.setValue("replicaCount", {
				id: cluster.controlPlaneCount,
				value: cluster.controlPlaneCount,
				label: cluster.controlPlaneCount,
			});
		}
	};

	const goBack = () => {
		props.goToNamedStep("selectUpdateNode");
	};

	const goNext = formMethods.handleSubmit((values: any) => {
		if (wizard.data.updateNode == "worker") {
			wizard.updateData("replicaCount", values.replicaCount);
		} else {
			wizard.updateData("replicaCount", values.replicaCount.value);
		}
		props.goToNamedStep("update");
	});

	return {
		formMethods,
		goBack,
		goNext,
		getReplicaCount,
		updateNode: wizard.data.updateNode,
	};
}
