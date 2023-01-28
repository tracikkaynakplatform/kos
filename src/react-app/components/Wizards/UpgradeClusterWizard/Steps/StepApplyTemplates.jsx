import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { clusterConfig } from "../../../../api";
import { PROVIDER_TYPE } from "../../../../providers";
import yaml from "js-yaml";

export default function StepApplyTemplates({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			info={info}
			title="Küme sürümü yükseltiliyor"
			disableNext
			disableBack
			onLoad={async () => {
				let upgradeFunction;
				let operation;

				if (wizard.data.updateType === "worker") {
					upgradeFunction = clusterConfig.upgradeWorkerNode;
				} else if (wizard.data.updateType === "controlPlane") {
					upgradeFunction = clusterConfig.upgradeControlPlane;
				}

				while (
					!(operation = await upgradeFunction({
						managementClusterName: wizard.manClusterName,
						clusterName: wizard.clusterName,
						toVersion: wizard.data.toVersion,
					})).finish
				) {
					if (info != operation.status) setInfo(operation.status);
				}
				if (operation.error) {
					snack(operation.error, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("selectVersion");
				} else {
					_goto("end");
				}
			}}
			{...props}
		/>
	);
}
