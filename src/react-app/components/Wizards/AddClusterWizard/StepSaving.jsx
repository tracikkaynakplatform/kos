import React, { useState } from "react";
import { useWizard } from "../../../hooks/useWizard";
import StepWizardWrapper from "../../Steps/StepWizardWrapper.jsx";
import { useSnackbar } from "notistack";
import kubeConfig from "../../../api/kubeConfig";
import { logger } from "../../../logger";
import StepBaseLoading from "../../Steps/StepBaseLoading";

export default function StepSaving(props) {
	const [info, setInfo] = useState("Kümeniz KOS'a ekleniyor...");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = props.goToNamedStep;

	return (
		<StepBaseLoading
			stepName={props.stepName}
			disableBack
			disableNext
			onLoad={async () => {
				try {
					await kubeConfig.saveManagementConfig(
						wizard.data.config,
						wizard.data.name
					);
					_goto("end");
				} catch (err) {
					logger.error(err.message);
					snack("Bir hata oluştu!", { variant: "error" });
				}
			}}
			width={400}
			title="Kayıt ediliyor"
			info={info}
		/>
	);
}
