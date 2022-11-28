import React from "react";
import { useWizard } from "../../../hooks/useWizard";
import StepWizardWrapper from "../../Steps/StepWizardWrapper.jsx";
import { useForm } from "react-hook-form";
import InputText from "../../FormInputs/InputText.jsx";
import kubectl from "../../../api/kubectl";
import clusterConfig from "../../../api/clusterConfig";
import { useSnackbar } from "notistack";
import kubeConfig from "../../../api/kubeConfig";
import { logger } from "../../../logger";

export default function StepEnterClusterName(props) {
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const { handleSubmit, control, setValue } = useForm();
	const _goto = props.goToNamedStep;

	return (
		<StepWizardWrapper
			stepName={props.stepName}
			disableBack
			onLoad={async () => {
				setValue(
					"name",
					await kubectl.currentContext(wizard.data.config)
				);
			}}
			onNextClick={handleSubmit(async (fields) => {
				try {
					if (await clusterConfig.isNameValid(fields.name)) {
						await wizard.updateData("name", fields.name);
						_goto("saving");
					} else {
						snack(
							"Bu isimde bir küme zaten mevcut! Başka bir isim girmeyi deneyin",
							{ variant: "error" }
						);
					}
				} catch (err) {
					logger.error(err.message);
					snack("Bir hata oluştu!", { variant: "error" });
				}
			})}
			width={400}
			title="Küme Bilgileri"
			text="Eklemek olduğunuz yönetim kümesi için bir isim giriniz."
		>
			<InputText
				control={control}
				name="name"
				label="Küme adı"
				rules={{
					required: "Küme adı giriniz",
					minLength: {
						value: 3,
						message: "Minimum uzunluk 3 karakter olmalı",
					},
				}}
			/>
		</StepWizardWrapper>
	);
}
