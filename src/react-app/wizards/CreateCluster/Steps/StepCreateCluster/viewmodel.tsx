import { createCluster } from "kos-fe/api/management-cluster/cluster";
import { getTask } from "kos-fe/api/task";
import { useReversibleLayout } from "kos-fe/contexts/ReversibleLayoutContext";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { TaskStatus } from "kos-fe/models/Task";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useViewModel(props: DefaultStepProps) {
	const [status, setStatus] = useState<string>("Your cluster creating now. Please wait.");
	const { managementClusterName } = useParams();
	const layout = useReversibleLayout();
	const wizard = useWizard();
	const navigate = useNavigate();
	let interval: NodeJS.Timer = null;

	const onLoad = async () => {
		layout.disableBack();

		modalErrorHandler(
			async (handleError: any) => {
				let taskInfo = await createCluster(managementClusterName, wizard.data.name, {
					kubernetesVersion: wizard.data.kubernetesVersion,
					controlPlaneCount: wizard.data.controlPlaneCount,
					workerCount: wizard.data.workerCount,
					infrastructure: wizard.data.infrastructure,
					controlPlaneMachineType: wizard.data.controlPlaneMachineType,
					workerMachineType: wizard.data.workerMachineType,
					region: wizard.data.region,
					sshKeyName: wizard.data.sshKeyName,
				});

				interval = setInterval(async () => {
					try {
						taskInfo = await getTask(taskInfo.id);
						if (taskInfo.status == TaskStatus.Finish) {
							clearInterval(interval);
							layout.enableBack();
							props.goToNamedStep("end");
						}
						setStatus(taskInfo.message);
					} catch (err) {
						clearInterval(interval);
						handleError(err);
					}
				}, 1000);
			},
			() => {
				layout.enableBack();
				props.goToNamedStep("enterClusterInformation");
			}
		);
	};

	const continueBackground = () => {
		clearInterval(interval);
		navigate(-1);
	};

	return {
		onLoad,
		status,
		continueBackground,
	};
}
