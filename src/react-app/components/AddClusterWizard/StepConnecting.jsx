import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import StepBaseLoading from "../StepBaseLoading.jsx";
import kubectl from "../../api/kubectl";
import clusterConfig from "../../api/clusterConfig";
import kubeConfig from "../../api/kubeConfig";

export default function StepConnecting(props) {
	const [info, setInfo] = useState("");
	const snack = useSnackbar().enqueueSnackbar;
	const wizard = useWizard();
	const _goto = props.goToNamedStep;

	return (
		<StepBaseLoading
			title="Kümeye bağlanılıyor..."
			info={info}
			disableBack
			disableNext
			stepName={props.stepName}
			onLoad={async () => {
				try {
					setInfo("Yönetim kümesinin adı alınıyor...");
					let manName = await kubectl.currentContext(
						wizard.data.config
					);

					setInfo(
						"Desteklenen altyapı sağlayıcılarının bilgisi alınıyor..."
					);
					let supportedProviders =
						await clusterConfig.getSupportedProviders(
							wizard.data.config
						);

					if (supportedProviders.length == 0)
						throw new Error(
							"Desteklenen altyapı sağlayıcıları bulunamadı!\nKümenin bir yönetim kümesi olduğundan emin olun."
						);

					setInfo(
						"Yönetim kümesi kubeconfig dosyası kayıt ediliyor..."
					);
					await kubeConfig.saveManagementConfig(
						wizard.data.config,
						manName
					);
					_goto("end");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("kubeConfig");
				}
			}}
		/>
	);
}
