import React, { useState } from "react";
import { useWizard } from "../../../../hooks/useWizard";
import { useSnackbar } from "notistack";
import { clusterConfig, kubeConfig } from "../../../../api";
import { logger } from "../../../../logger";
import { StepBaseLoading } from "../../../Steps";
import { PROVIDER_CLASS, PROVIDER_TYPE } from "../../../../providers";
import { envVariables } from "../../../../providers/aws";
import { getEnv } from "../../../../api/env";

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

					// Default configuration
					let configuration = { provider: {} };
					for (let provider of wizard.data.supportedProviders) {
						switch (provider) {
							case PROVIDER_TYPE.AWS:
								let awsConfig = {};
								for (let config of envVariables)
									awsConfig[config.name] =
										(await getEnv(config.name)) ?? "";

								configuration.provider[
									PROVIDER_CLASS[PROVIDER_TYPE.AWS]
								] = awsConfig;
								break;
						}
					}
					await clusterConfig.setClusterConfiguration(
						wizard.data.clusterName,
						configuration
					);
					_goto("end");
				} catch (err) {
					logger.error(err.message);
					snack("Bir hata oluştu!", { variant: "error", autoHideDuration: 4000 });
				}
			}}
			width={400}
			title="Kayıt ediliyor"
			info={info}
		/>
	);
}
