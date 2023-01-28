import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { PROVIDER_TYPE } from "../../../../providers";
import { StepWizardWrapper } from "../../../Steps";
import { useForm } from "react-hook-form";
import { InputSelect } from "../../../FormInputs";

export default function StepSelectVersion({ goToNamedStep, ...props }) {
	const [versions, setVersions] = useState([]);
	const wizard = useWizard();
	const { handleSubmit, control } = useForm();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			onLoad={async () => {
				// TODO: Load Kubernetes versions dynamically.
				setVersions([
					"v1.24.3",
					"v1.24.4",
					"v1.24.5",
					"v1.24.6",
					"v1.25.3",
					"v1.25.4",
					"v1.25.5",
					"v1.25.6",
				]);
			}}
			onBackClick={() => {
				_goto("selectUpgradeType");
			}}
			onNextClick={handleSubmit(async (fields) => {
				if (fields.kubVersion === "") {
					snack("Lütfen bir versiyon seçiniz", { variant: "error" });
					return;
				}
				wizard.updateData("toVersion", fields.kubVersion);
				_goto("applyTemplates");
			})}
			title="Yükseltme bilgilerini girin"
			{...props}
		>
			<InputSelect name="kubVersion" control={control} items={versions} />
		</StepWizardWrapper>
	);
}
