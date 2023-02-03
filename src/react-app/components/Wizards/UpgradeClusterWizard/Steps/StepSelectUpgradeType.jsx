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
				wizard.updateData("upgradeType", fields.machineType);
				_goto("selectVersion");
			})}
			title="Yükseltilecek makina bilgisi"
			text="Küme üzerindeki yükseltmek istediğiniz makina tipini giriniz"
			width={400}
			{...props}
		>
			<InputRadioGroup
				name="machineType"
				control={control}
				defaultValue="controlPlane"
				options={[
					{
						label: "Control Plane",
						value: "controlPlane",
					},					
					{
						label: "Workers",
						value: "worker",
					},
				]}
			/>
		</StepWizardWrapper>
	);
}
