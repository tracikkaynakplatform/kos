import React from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { PROVIDER_CLASS } from "../../../../providers";
import { clusterConfig, kubectl, kubeConfig } from "../../../../api";

export default function StepGetClusterInfo({
	onError,
	goToNamedStep,
	...props
}) {
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			title="Küme ile ilgili bilgi toplanıyor..."
			disableNext
			disableBack
			onLoad={async () => {
				_goto("selectVersion");
			}}
			{...props}
		/>
	);
}
