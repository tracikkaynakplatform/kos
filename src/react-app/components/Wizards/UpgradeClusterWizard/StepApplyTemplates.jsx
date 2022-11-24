import React from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../hooks/useWizard";
import StepBaseLoading from "../../Steps/StepBaseLoading.jsx";
import yaml from "js-yaml";
import kubectl from "../../../api/kubectl";
import { PROVIDER_TYPE } from "../../../providers";

export default function StepApplyTemplates({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			info={info}
			title="Küme sürümü yükseltiliyor"
			disableNext
			disableBack
			onLoad={async () => {
				try {
					if (wizard.data.provider == PROVIDER_TYPE.DOCKER) {
						setInfo("Kümenin sürüm bilgisi değiştiriliyor");
						const cluster = await kubectl.get(
							wizard.data.config,
							"cluster",
							wizard.clusterName,
							{ outputType: "json" }
						);
						cluster.spec.topology.version = wizard.data.kubVersion;

						await kubectl.apply(
							wizard.data.config,
							await yaml.dump(cluster)
						);
					}

					setInfo("Control plane şablonları uygulanıyor");
					const cpTemplate = wizard.data.controlPlaneTemplate;

					if (wizard.data.provider == PROVIDER_TYPE.DOCKER)
						cpTemplate.spec.template.spec.customImage =
							wizard.data.kubVersion;
					else if (wizard.data.provider == PROVIDER_TYPE.AWS)
						cpTemplate.spec.template.spec.ami = {
							id: wizard.data.kubVersion,
						};

					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(cpTemplate)
					);

					const workerTemplate = wizard.data.workerTemplate;

					if (wizard.data.provider == PROVIDER_TYPE.DOCKER)
						workerTemplate.spec.template.spec.customImage =
							wizard.data.kubVersion;
					else if (wizard.data.provider == PROVIDER_TYPE.AWS)
						workerTemplate.spec.template.spec.ami = {
							id: wizard.data.kubVersion,
						};

					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(workerTemplate)
					);

					const kubeadmControlPlane = (
						await kubectl.get(
							wizard.data.config,
							"KubeadmControlPlane",
							"",
							{
								outputType: "json",
								label: `cluster.x-k8s.io/cluster-name=${wizard.clusterName}`,
							}
						)
					).items[0];
					kubeadmControlPlane.spec.machineTemplate.infrastructureRef.name =
						cpTemplate.metadata.name;
					kubeadmControlPlane.spec.version = wizard.data.kubVersion;

					setInfo("KubeadmControlPlane nesnesi uygulanıyor");
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(kubeadmControlPlane)
					);

					setInfo(
						"Worker'lar için MachineDeployment nesneleri alınıyor"
					);
					const machineDeployment = (
						await kubectl.get(
							wizard.data.config,
							"MachineDeployment",
							"",
							{
								outputType: "json",
								label: `cluster.x-k8s.io/cluster-name=${wizard.clusterName}`,
							}
						)
					).items[0];
					machineDeployment.spec.template.spec.infrastructureRef.name =
						workerTemplate.metadata.name;
					machineDeployment.spec.template.spec.version =
						wizard.data.kubVersion;

					setInfo(
						"Worker'lar için MachineDeployment nesneleri uygulanıyor"
					);
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(machineDeployment)
					);

					_goto("end");
				} catch (err) {
					console.error(err);
					snack("Bir hata oluştu", {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("selectVersion");
				}
			}}
			{...props}
		/>
	);
}
