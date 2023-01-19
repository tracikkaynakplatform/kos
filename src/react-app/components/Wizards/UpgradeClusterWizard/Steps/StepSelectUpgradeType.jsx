import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepWizardWrapper } from "../../../Steps";
import { useForm } from "react-hook-form";
import { InputRadioGroup } from "../../../FormInputs";

export default function StepSelectUpgradeType({ goToNamedStep, ...props }) {
	const wizard = useWizard();
	const { handleSubmit, control } = useForm();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			disableBack
			onLoad={async () => {}}
			onNextClick={handleSubmit(async (fields) => {
				console.log(fields);
				_goto("selectVersion");
			})}
			title="Yükseltilecek makina bilgisi"
			text="Küme üzerindeki yükseltmek istediğiniz makina tipini giriniz"
			{...props}
		>
			<InputRadioGroup
				name="machineType"
				control={control}
				options={["Worker Node", "Control Plane"]}
			/>
		</StepWizardWrapper>
	);
}
