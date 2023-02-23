import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { clusterctl, kubectl } from "../../../../api";
import { StepBaseLoading } from "../../../Steps";
import { useLayout } from "../../../../hooks/useLayout";
import { kubeConfig, clusterConfig } from "../../../../api";
import { handleErrorWithSnack } from "../../../../errorHandler";
import { StepWizardWrapper } from "../../../Steps";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";


export default function StepFetchWorkloadCluster({ goToNamedStep, ...props }) {
	const [info, setInfo] = useState(0);
	const [progress, _setProgress] = useState("0");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;
	const layout = useLayout();
	let config;

	//TODO: Move this to user-preferences and set according to user language preference.
	const UITexts = {
		LoadingClusterData : 'Küme bilgisi yükleniyor',
		LoadedClusterData : 'Küme bilgisi yüklendi',
		ErrLoadingClusterData : 'Küme bilgisi yüklenemedi',
		ClusterNotReady: 'Küme hazır değil veya zaten değiştiriliyor. Sonra tekrar deneyiniz',
		ClientInvocationError: 'Kümeye erişim hatası',
		ClientInvocationResultError: 'Kümeye erişim sonucu hatası'
	}

	Object.freeze(UITexts);

  const onErr = async (err) => {
		console.error(err);
		layout.enableBack();
		snack(err.message, {
			variant: "error",
			autoHideDuration: 5000,
		});
		//TODO..
		if (wizard.data.type === "ec2") _goto("AWSProviderConfig");
		else if (wizard.data.type === "eks")
			_goto("AWSProviderEKSConfig");
	};

	const sleep = async (t) => {
		return await new Promise(r => setTimeout(r, t));
	}

	const setProgress = (val) => {
		_setProgress(val);
		(async () => { await sleep(500) })();
	}

	const getKubeResource = async (kind, name, namespace = 'default') => {
		let resource;
		try {
			resource = await kubectl.get(
				config,
				kind,
				name,
				{ outputType: "json" }
			);
		} catch (err) {
			throw {name: 'ClientInvocationError', message: `${UITexts.ClientInvocationError}: ${err.message}`};
		}
		console.log(`${namespace}.${kind}.${name} = \n${JSON.stringify(resource, null, 2)}`);
		if (resource?.metadata?.name != name) 
			{ throw {
					name: 'ClientInvocationResultError', 
					message: `${UITexts.ClientInvocationResultError}: ${name}`
				}; }
		
		return resource;
	};

	const baseOnload = async () => {
		let cluster, controlPlane, machineDeployments, machineDeployment0;
		try {
			// layout.disableBack();
			console.log(`props = \n${JSON.stringify(props, null, 2)}`);
			let clusterName = props.clusterName;
			await wizard.updateData("clusterName", clusterName);

			setInfo(
				UITexts.LoadingClusterData + ` for ${clusterName} ...`
			);
			console.log(UITexts.LoadingClusterData + ` for ${clusterName} ...`);
			
			setProgress(10);
			

			config = await kubeConfig.loadManagementConfig(
				props.manClusterName
			);
			await wizard.updateData("config", config);

			setProgress(20);
			

			// fetch cluster
			cluster = await getKubeResource('cluster', clusterName); //TODO: namespace

			// fetch controlplane
			controlPlane = await getKubeResource(
				cluster.spec.controlPlaneRef.kind, 
				cluster.spec.controlPlaneRef.name,
				cluster.spec.controlPlaneRef.namespace);

			setProgress(40);
			

			// fetch machineDeployments:
			// TODO: handle multiple machineDeployments
			try {
				machineDeployments = await kubectl.getMachineDeployments(
					config,
					{"namespace": cluster?.metadata?.namespace, "cluster_name" : clusterName}
				);
			} catch (err) {
				throw {name: 'ClientInvocationError', message: `${UITexts.ClientInvocationError}: ${err.message}`};
			}
			console.log(`machineDeployments = \n${JSON.stringify(machineDeployments, null, 2)}`);
			if (machineDeployments?.length <= 0) 
				{ throw new Error(`E-MDL ${UITexts.ClientInvocationError}`); }

			setProgress(60);
			

			machineDeployment0 = await getKubeResource(
				'MachineDeployment',
				machineDeployments[0],
				cluster.spec.controlPlaneRef.namespace
			);
			
			setProgress(80);
			

			let clusterInfo = {
				'cluster': cluster,
				'controlPlane' : controlPlane,
				'machineDeployments' : [machineDeployment0]
			}

			setInfo(UITexts.LoadedClusterData);

			setProgress(100);
			wizard.updateData('clusterInfo' , clusterInfo);
			
			setTimeout(() => {
				_goto("AWSProviderConfig");
			}, 1000);
			
		} catch (err) {
			await onErr(err);
		}
	};

	return (
		<StepWizardWrapper
			title={UITexts.LoadingClusterData}
			info={info}
			text={info}
			disableBack
			disableNext
			onLoad={() => handleErrorWithSnack(snack, baseOnload, onErr) }
			{...props}
		>

				<LinearProgress 
					// color={progress < 100 ? "secondary" : "primary"}
					variant="determinate"
					value={progress}
					style={{ width: "100%" }}
				/>

			</StepWizardWrapper>
	);

}
