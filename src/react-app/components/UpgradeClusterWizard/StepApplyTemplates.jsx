import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import yaml from "js-yaml";
import Wrapper from "../StepWizardWrapper.jsx";
import kubectl from "../../api/kubectl";

export default function StepApplyTemplates({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<Wrapper
			disableNext
			disableBack
			onLoad={async () => {
				try {
					setInfo("Control plane şablonları uygulanıyor");
					const cpTemplate = wizard.data.controlPlaneTemplate;
					cpTemplate.spec.template.spec.customImage =
						wizard.data.cpKubVersion.id;
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(cpTemplate)
					);

					setInfo("Worker şablonları uygulanıyor");
					const workerTemplate = wizard.data.workerTemplate;
					workerTemplate.spec.template.spec.customImage =
						wizard.data.wKubVersion.id;
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(workerTemplate)
					);

					setInfo("KubeadmControlPlane nesnesi düzenleniyor");
					const kubeadmControlPlane = (
						await kubectl.get(
							wizard.data.config,
							"KubeadmControlPlane",
							"json",
							"-l",
							`cluster.x-k8s.io/cluster-name=${wizard.clusterName}`
						)
					).items[0];
					kubeadmControlPlane.spec.machineTemplate.infrastructureRef.name =
						cpTemplate.metadata.name;
					kubeadmControlPlane.spec.version =
						wizard.data.cpKubVersion.version;

					setInfo("KubeadmControlPlane nesnesi uygulanıyor");
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(kubeadmControlPlane)
					);

					setInfo(
						"Worker'lar için MachineDeployment nesneleri alınıyor'"
					);
					const machineDeployment = (
						await kubectl.get(
							wizard.data.config,
							"MachineDeployment",
							"json",
							"-l",
							`cluster.x-k8s.io/cluster-name=${wizard.clusterName}`
						)
					).items[0];
					machineDeployment.spec.template.spec.infrastructureRef.name =
						workerTemplate.metadata.name;
					machineDeployment.spec.template.spec.version =
						wizard.data.wKubVersion.version;

					setInfo(
						"Worker'lar için MachineDeployment nesneleri uygulanıyor'"
					);
					await kubectl.apply(
						wizard.data.config,
						await yaml.dump(machineDeployment)
					);
					_goto("end");
				} catch (err) {
					console.error(err);
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("selectVersion");
				}
			}}
			{...props}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Makine şablonları uygulanıyor (kubectl apply)
			</Typography>
			<Box
				sx={{
					m: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<Typography>{info}</Typography>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
