import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { kubectl } from "../../../../api";
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
				_goto("end");
			}}
			{...props}
		/>
	);
}
