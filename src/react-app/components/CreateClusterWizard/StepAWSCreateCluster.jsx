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
	const waitForCluster = async () => {
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
						for (let condition of cluster.status.conditions) {
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
	};

	return (
		<StepBaseLoading
			title="Küme oluşturuluyor..."
			info={info}
			disableBack
			disableNext
			onLoad={async () => {
				let yaml;
				try {
					setInfo(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clusterctl generate)"
					);
					yaml = await clusterctl.generateCluster(
						wizard.data.config,
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.type === "ec2"
							? wizard.data.masterCount
							: undefined,
						wizard.data.workerCount,
						"aws",
						wizard.data.type === "eks" ? "eks" : undefined,
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
					if (wizard.data.type === "eks")
						setInfo("Kümenin hazır hale gelmesi bekleniyor");
					else if (wizard.data.type === "ec2")
						setInfo(
							"CNI kurulumu için kümenin hazır hale gelmesi bekleniyor..."
						);
					await waitForCluster();

					if (wizard.data.type === "ec2") {
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
					}
					_goto("addClusterComplete");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					if (wizard.data.type === "ec2") _goto("AWSProviderConfig");
					else if (wizard.data.type === "eks")
						_goto("AWSProviderEKSConfig");
				}
			}}
			{...props}
		/>
	);
}
