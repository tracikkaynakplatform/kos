import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { clusterctl, kubectl } from "../../../../api";
import { logger } from "../../../../logger";
import { useLayout } from "../../../../hooks/useLayout";

export default function StepKindCreateCluster({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;
	const layout = useLayout();

	return (
		<StepBaseLoading
			title="Küme oluşturuluyor..."
			info={info}
			disableNext
			disableBack
			onLoad={async () => {
				try {
					layout.disableBack();
					setInfo(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clusterctl generate)"
					);
					let yaml = await clusterctl.generateCluster(
						wizard.data.config,
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.masterCount,
						wizard.data.workerCount,
						"docker",
						"development"
					);
					setInfo(
						"YAML dosyası yönetim kümesine uygulanıyor (kubectl apply)"
					);
					await kubectl.apply(wizard.data.config, yaml);
					setInfo(
						"CNI kurulumu için kümenin hazır hale gelmesi bekleniyor..."
					);
					await new Promise(async (resolve, reject) => {
						const interval = setInterval(async () => {
							try {
								let cluster;
								try {
									cluster = await kubectl.get(
										wizard.data.config,
										"cluster",
										wizard.data.clusterName,
										{ outputType: "json" }
									);
								} catch (err) {
									return;
								}

								let ok = false;
								if (cluster.status.phase == "Provisioned") {
									for (let condition of cluster.status
										.conditions) {
										if (condition.status == "False") {
											ok = false;
											break;
										}
										ok = true;
									}
								}
								if (ok) {
									clearInterval(interval);
									resolve();
								}
							} catch (err) {
								clearInterval(interval);
								reject(err);
							}
						}, 5000);
					});
					setInfo(
						"Yeni oluşturulan kümenin kubeconfig bilgisi alınıyor"
					);
					const clusterConfig = await clusterctl.getClusterConfig(
						wizard.data.config,
						wizard.data.clusterName
					);

					setInfo("Calico yükleniyor");
					await kubectl.applyFile(
						clusterConfig,
						"https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/calico.yaml"
					);
					_goto("addClusterComplete");
				} catch (err) {
					layout.enableBack();
					logger.error(err.message);
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("kindProviderConfig");
				}
			}}
			{...props}
		/>
	);
}
