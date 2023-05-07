import { LoadingModal } from "kos-fe/components/Modals/LoadingModal";
import { YesNoModal } from "kos-fe/components/Modals/YesNoModal";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { useModalStore } from "kos-fe/stores/useModalStore";
import { Cluster } from "kos-fe/models/Cluster";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getClusterKubeconfig, deleteCluster as deleteClusterAPI } from "kos-fe/api/management-cluster/cluster";

export function useViewModel(cluster: Cluster) {
	const { managementClusterName } = useParams();
	const [isEditable, setIsEditable] = useState<boolean>(true);
	const [isDeletable, setIsDeletable] = useState<boolean>(true);
	const [statusColor, setStatusColor] = useState<string>("");
	const [statusText, setStatusText] = useState<string>("");
	const { openModal, closeModal } = useModalStore();
	const navigate = useNavigate();

	useComponentDidMount(() => {
		setIsEditable(cluster.status == "Provisioned");
		setIsDeletable(cluster.status != "Deleting");

		switch (cluster.status) {
			case "Provisioning":
				setStatusColor("yellow");
				break;
			case "Provisioned":
				setStatusColor("green");
				break;
			case "Deleting":
				setStatusColor("red");
				break;
		}

		setStatusText(cluster.status);
		for (const condition of cluster.conditions) {
			if (!condition.status) {
				setStatusText(condition.message);
			}
		}
	});

	const copyKubeconfig = () => {
		toast.promise(
			async () => {
				const kubeconfig = await getClusterKubeconfig(managementClusterName, cluster.name);
				await navigator.clipboard.writeText(kubeconfig);
			},
			{
				pending: `Copying '${cluster.name}' kubeconfig`,
				success: "Kubeconfig has been copied to the clipboard",
				error: {
					render: ({ data }) => <span>{data.message}</span>,
				},
			}
		);
	};

	const deleteCluster = () => {
		const handler = (choice: string) => {
			switch (choice) {
				case "yes":
					openModal(<LoadingModal title="Deleting cluster" />, true);
					modalErrorHandler(async () => {
						await deleteClusterAPI(managementClusterName, cluster.name);
						closeModal();
						navigate(0);
					});
					break;
				case "no":
					closeModal();
					break;
			}
		};

		openModal(
			<YesNoModal
				message={`Are you sure to delete '${cluster.name}'? (This operation cannot be undone)`}
				title="Delete cluster"
				yesButtonText="Delete"
				noButtonText="Cancel"
				on={handler}
			/>
		);
	};

	const upgradeCluster = () => {
		navigate(`/management-clusters/${managementClusterName}/${cluster.name}/upgrade`);
	};

	const updateCluster = () => {
		navigate(`/management-clusters/${managementClusterName}/${cluster.name}/update`);
	};

	return {
		isDeletable,
		isEditable,
		statusColor,
		copyKubeconfig,
		deleteCluster,
		updateCluster,
		upgradeCluster,
	};
}
