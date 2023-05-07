import { removeManagementCluster as removeManagementClusterAPI } from "kos-fe/api/management-cluster";
import { LoadingModal } from "kos-fe/components/Modals/LoadingModal";
import { YesNoModal } from "kos-fe/components/Modals/YesNoModal";
import { useModalStore } from "kos-fe/stores/useModalStore";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useViewModel(managementClusterName: string) {
	const [isExpanded, setIsExpanded] = useState<boolean>(true);
	const { openModal, closeModal } = useModalStore();
	const navigate = useNavigate();

	const openManagementClusterPage = () => {
		navigate(`/management-clusters/${managementClusterName}`);
	};

	const removeManagementCluster = async () => {
		const handler = (choice: string) => {
			switch (choice) {
				case "yes":
					openModal(<LoadingModal title="Removing management cluster." />, true);
					modalErrorHandler(async () => {
						await removeManagementClusterAPI(managementClusterName);
						navigate(0);
						closeModal();
					});
					break;
				case "no":
					closeModal();
					break;
			}
		};

		openModal(
			<YesNoModal
				message={`Are you sure to remove '${managementClusterName}' from KOS?`}
				title="Remove management cluster"
				yesButtonText="Remove"
				noButtonText="Cancel"
				on={handler}
			/>
		);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return {
		openManagementClusterPage,
		removeManagementCluster,
		isExpanded,
		toggleExpand,
	};
}
