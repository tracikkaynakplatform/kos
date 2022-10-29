import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { translate } from "../../locales";
import { useWizard } from "../../hooks/useWizard";
import { PROVIDER_TYPE } from "../../../main/providers";
import clusterConfig from "../../api/clusterConfig";
import kubeConfig from "../../api/kubeConfig";
import StepInput from "../StepInput.jsx";

export default function StepSelectProvider({ goToNamedStep, ...props }) {
	const snack = useSnackbar().enqueueSnackbar;
	const [providers, setProviders] = useState([]);
	const wizard = useWizard();
	const _goto = goToNamedStep;

	return (
		<StepInput
			onLoad={async () => {
				let config = await kubeConfig.loadManagementConfig(
					props.manClusterName
				);
				await wizard.updateData("config", config);
				setProviders(await clusterConfig.getSupportedProviders(config));
			}}
			onNextClick={(fields) => {
				if (!!fields.provider) {
					_goto(fields.provider);
					return;
				}
				snack(translate("errSelectOperation"), {
					variant: "error",
					autoHideDuration: 2000,
				});
			}}
			disableBack
			title="Altyapı sağlayıcısı seçin"
			text="Oluşturulacak kümenin hangi altyapı sağlayıcısı kullanılarak
			oluşturulacağını seçin."
			width={500}
			fields={[
				{
					title: "Altyapı Sağlayıcısı",
					type: "select",
					values: providers.map((p) => {
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
					}),
					name: "provider",
				},
			]}
			{...props}
		>
			{/* 	<FormControl fullWidth>
				<InputLabel>{translate("provider")}</InputLabel>
				<Select
					value={provider}
					label={translate("provider")}
					onChange={(e) => setProvider(e.target.value)}
				>
					{providers.map((x, i) => (
						<MenuItem value={x.key} key={i}>
							{x.name}
						</MenuItem>
					))}
				</Select>
			</FormControl> */}
		</StepInput>
	);
}
