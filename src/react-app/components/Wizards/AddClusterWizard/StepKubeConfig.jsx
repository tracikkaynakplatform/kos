import React from "react";
import { useWizard } from "../../../hooks/useWizard";
import StepWizardWrapper from "../../Steps/StepWizardWrapper.jsx";
import kubeConfig from "../../../api/kubeConfig";
import { useForm } from "react-hook-form";
import InputText from "../../FormInputs/InputText.jsx";

export default function StepKubeConfig(props) {
	const wizard = useWizard();
	const { handleSubmit, control, setValue } = useForm();
	const _goto = props.goToNamedStep;

	return (
		<StepWizardWrapper
			stepName={props.stepName}
			disableBack
			onLoad={async () =>
				setValue("config", await kubeConfig.defaultConfig())
			}
			onNextClick={handleSubmit(async (fields) => {
				await wizard.updateData("config", fields.config);
				_goto("connecting");
			})}
			width={700}
			title="Küme Bilgileri"
			text={
				<>
					Eklemek istediğiniz yönetim kümesinin kubeconfig içeriğini
					giriniz.
					<br />
					(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği
					alınmıştır)
				</>
			}
		>
			<InputText
				control={control}
				name="config"
				label="kubeconfig dosya içeriği"
				componentProps={{ multiline: true, rows: 15 }}
			/>
		</StepWizardWrapper>
	);
}
