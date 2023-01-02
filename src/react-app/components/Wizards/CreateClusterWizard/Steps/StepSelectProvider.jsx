import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { PROVIDER_TYPE } from "../../../../providers";
import { kubeConfig, clusterConfig } from "../../../../api";
import { StepWizardWrapper } from "../../../Steps";
import { useForm } from "react-hook-form";
import { InputSelect } from "../../../FormInputs";

export default function StepSelectProvider({ goToNamedStep, ...props }) {
	const snack = useSnackbar().enqueueSnackbar;
	const [providers, setProviders] = useState(["Yükleniyor..."]);
	const { handleSubmit, control, setValue } = useForm();
	const wizard = useWizard();
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			onLoad={async () => {
				let config = await kubeConfig.loadManagementConfig(
					props.manClusterName
				);
				await wizard.updateData("config", config);
				let prs = await clusterConfig.getSupportedProviders(config);
				prs = prs.map((p) => {
					switch (p) {
						case PROVIDER_TYPE.DOCKER:
							return {
								label: "Kind - Docker",
								value: "kindProviderConfig",
							};
						case PROVIDER_TYPE.DIGITAL_OCEAN:
							return {
								label: "DigitalOcean",
								value: "digitalOceanSSHkey",
							};
						case PROVIDER_TYPE.AWS:
							return {
								label: "AWS - Amazon Web Services",
								value: "selectAWSClusterType",
							};
					}
				});
				setProviders(prs);
				if (prs[0]?.value) setValue("provider", prs[0].value);
			}}
			onNextClick={handleSubmit((values) => {
				if (
					values?.provider === "" ||
					values?.provider === "Yükleniyor..."
				) {
					snack("Lütfen bir sağlayıcı seçin", { variant: "error" });
					return;
				}
				_goto(values.provider);
			})}
			disableBack
			title="Altyapı sağlayıcısı seçin"
			text="Oluşturulacak kümenin hangi altyapı sağlayıcısı kullanılarak
			oluşturulacağını seçin."
			width={500}
			{...props}
		>
			<InputSelect
				defaultValue="Yükleniyor..."
				name="provider"
				control={control}
				items={providers}
			/>
		</StepWizardWrapper>
	);
}
