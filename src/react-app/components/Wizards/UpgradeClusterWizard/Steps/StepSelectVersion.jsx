import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepWizardWrapper } from "../../../Steps";
import { useForm } from "react-hook-form";
import { InputSelect } from "../../../FormInputs";
import { kubeConfig, kubectl } from "../../../../api";
import { Typography } from "@mui/material";

export default function StepSelectVersion({ goToNamedStep, ...props }) {
	const [versions, setVersions] = useState(["Yükleniyor..."]);
	const [info, setInfo] = useState("");
	const wizard = useWizard();
	const { handleSubmit, control, setValue } = useForm();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			onLoad={async () => {
				setInfo("Yükleniyor...");
				setVersions(["Yükleniyor..."]);
				setValue("kubVersion", "Yükleniyor...");

				const managementClusterConfig =
					await kubeConfig.loadManagementConfig(
						wizard.manClusterName
					);
				const controlPlaneVersion =
					await kubectl.getPossibleControlPlaneVersions(
						managementClusterConfig,
						wizard.clusterName
					);
				const workerVersion = await kubectl.getPossibleWorkerVersions(
					managementClusterConfig,
					wizard.clusterName
				);

				let _versions = [];
				if (wizard.data.upgradeType == "worker") {
					_versions = workerVersion.versions;
					setInfo(
						<>
							Şu anki Worker sürümü: {workerVersion.current}
							<br />
							Şu anki Control Plane sürümü:{" "}
							{controlPlaneVersion.current}
						</>
					);
				} else if (wizard.data.upgradeType === "controlPlane") {
					_versions = controlPlaneVersion.versions;
					setInfo(
						<>
							Şu anki Control Plane sürümü:{" "}
							{controlPlaneVersion.current}
							<br />
							Şu anki Worker sürümü: {workerVersion.current}
						</>
					);
				}

				if (_versions.length == 0) {
					setInfo("Kullanılabilecek bir sürüm bulunmuyor.");
					setVersions(["Yok"]);
					setValue("kubVersion", "Yok");
					return;
				}

				setVersions(_versions);
				setValue("kubVersion", _versions[0]);
			}}
			onBackClick={() => {
				_goto("selectUpgradeType");
			}}
			onNextClick={handleSubmit(async (fields) => {
				if (
					fields.kubVersion === "" ||
					fields.kubVersion === "Yükleniyor..." ||
					fields.kubVersion === "Yok"
				) {
					snack("Lütfen bir versiyon seçiniz", { variant: "error", autoHideDuration: 4000 });
					return;
				}
				wizard.updateData("toVersion", fields.kubVersion);
				_goto("applyTemplates");
			})}
			title="Sürüm bilgilerini girin"
			text={info}
			width={600}
			{...props}
		>
			<div className="w-full flex flex-col gap-3 justify-items-stretch">
				<InputSelect
					defaultValue="Yükleniyor..."
					name="kubVersion"
					control={control}
					items={versions}
				/>
				{wizard.data.upgradeType === "controlPlane" && (
					<Typography>
						* Eğer aradığınız versiyon listede bulunmuyorsa, ilk
						önce worker node'ların sürümlerini değiştirmeyi deneyin.
					</Typography>
				)}
			</div>
		</StepWizardWrapper>
	);
}
