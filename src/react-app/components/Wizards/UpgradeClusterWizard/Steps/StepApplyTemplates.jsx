import React, { useState } from "react";
import { MessageModal } from "../../../Modals";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { clusterConfig, kubeConfig, kubectl } from "../../../../api";
import { useModal } from "../../../../hooks/useModal";
import { Typography } from "@mui/material";
import { QuestionModal } from "../../../Modals";

export default function StepApplyTemplates({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const modal = useModal();

	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			info={info}
			title="Küme sürümü güncelleniyor"
			disableNext
			disableBack
			onLoad={async () => {
				let upgradeFunction;
				let operation;

				if (wizard.data.upgradeType === "worker") {
					upgradeFunction = clusterConfig.upgradeWorkerNode;
				} else if (wizard.data.upgradeType === "controlPlane") {
					upgradeFunction = clusterConfig.upgradeControlPlane;
				}

				const doUpgrade = async () => {
					while (
						!(operation = await upgradeFunction({
							managementClusterName: wizard.manClusterName,
							clusterName: wizard.clusterName,
							toVersion: wizard.data.toVersion,
							newNodeCount: null, //TODO: will not be used, probably.. remove soon.
						})).finish
					) {
						if (info != operation.status) setInfo(operation.status);
					}
					if (operation.error) {
						modal.showModal(MessageModal, {
							width: 400,
							message: (
								<>
									<Typography fontSize={25}>
										Bir hata oluştu:
									</Typography>
									<br />
									{operation.error}
								</>
							),
						});
						_goto("selectVersion");
					} else {
						_goto("end");
					}
				};

				setInfo("Kümenin durumu denetleniyor");

				const managementClusterConfig =
					await kubeConfig.loadManagementConfig(
						wizard.manClusterName
					);
				const controlPlaneVersion =
					await kubectl.getControlPlaneVersionInfo(
						managementClusterConfig,
						{ cluster_name: wizard.clusterName }
					);
				const machineDeployments = await kubectl.getMachineDeployments(
					managementClusterConfig,
					{ cluster_name: wizard.clusterName }
				);

				const checkMachinesRollout = async () => {
					for (const machine of machineDeployments) {
						if (
							await kubectl.isRolloutInProgress(
								await kubectl.getMachineDeploymentVersionInfo(
									managementClusterConfig,
									{
										resource_name: machine,
									}
								)
							)
						)
							return true;
					}
					return false;
				};

				let controlPlaneRollout = false;
				let workerRollout = false;

				if (
					(controlPlaneRollout = await kubectl.isRolloutInProgress(
						controlPlaneVersion
					)) ||
					(workerRollout = await checkMachinesRollout())
				) {
					modal.showModal(QuestionModal, {
						message: (
							<>
								Aşağıdaki kaynaklar üzerinde yükseltme işlemi
								devam ediyor. Devam etmek istediğinize emin
								misiniz?
								<br />
								<br />
								{controlPlaneRollout ? (
									<>
										* Control Plane
										<br />
									</>
								) : null}
								{workerRollout ? (
									<>
										* Worker
										<br />
									</>
								) : null}
							</>
						),
						width: 500,
						yesButtonText: "Evet",
						noButtonText: "Hayır",

						onYesClick() {
							doUpgrade();
							modal.closeModal();
						},
						onNoClick() {
							_goto("selectVersion");
							modal.closeModal();
						},
					});
					return;
				}
				doUpgrade();
			}}
			{...props}
		/>
	);
}
