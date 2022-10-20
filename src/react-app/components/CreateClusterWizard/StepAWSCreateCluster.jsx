import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import clusterctl from "../../api/clusterctl";
import kubectl from "../../api/kubectl";
import StepBaseLoading from "../StepBaseLoading.jsx";

export default function StepAWSCreateCluster({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			title="Küme oluşturuluyor..."
			info={info}
			disableBack
			disableNext
			onLoad={async () => {
				try {
					setInfo(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clusterctl generate)"
					);
					let yaml = await clusterctl.generateCluster(
						wizard.data.config,
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.masterCount,
						wizard.data.workerCount,
						false,
						"aws",
						{
							AWS_REGION: wizard.data.region,
							AWS_SSH_KEY_NAME: wizard.data.sshKeyName,
							AWS_CONTROL_PLANE_MACHINE_TYPE:
								wizard.data.masterMachineType,
							AWS_NODE_MACHINE_TYPE:
								wizard.data.workerMachineType,
						}
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
										"json",
										wizard.data.clusterName
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
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("AWSProviderConfig");
				}
			}}
			{...props}
		/>
	);
}
