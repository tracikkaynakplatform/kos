import React, { useState } from "react";
import { kubernetesVersions, machineTypes } from "../../../../providers/aws";
import { useWizard } from "../../../../hooks/useWizard";
import { StepWizardWrapper } from "../../../Steps";
import { Grid } from "@mui/material";
import { InputText, InputSelect } from "../../../FormInputs";
import { useForm } from "react-hook-form";
import { checkAWSCli, checkConfig, getAWSInfo } from "../aws";
import { logger } from "../../../../logger";
import { useSnackbar } from "notistack";
import { useModal } from "../../../../hooks/useModal";
import { info } from "autoprefixer";

export default function StepAWSProviderConfig({ goToNamedStep, ...props }) {
	const [regions, setRegions] = useState(["Yükleniyor..."]);
	const [sshKeys, setSshKeys] = useState(["Yükleniyor..."]);
	const snack = useSnackbar().enqueueSnackbar;
	const { handleSubmit, control, setValue } = useForm();
	const modal = useModal();
	const wizard = useWizard();
	const isEdit = wizard.data.clusterInfo ? true : false;

	const reloadForm = async (region) => {
		try {
			if (!(await checkAWSCli(goToNamedStep, modal))) return;
			// console.log(`wizard.data = \n${JSON.stringify(wizard.data, null, 2)}`);
			const info = await checkConfig(
				goToNamedStep,
				modal,
				wizard.manClusterName,
				region ?? regions[0]
			);
			if (!info) return;

			// console.log(`credentials_region = ${info.credentials_region}`);

			if (!region) {
				setRegions(info.regions);
				setValue("region", info.credentials_region ?? info.regions[0]);
			}

			setSshKeys(info.sshKeys?.map((x) => x.KeyName));
			setValue("sshKeyName", info.sshKeys[0]?.KeyName ?? "");
		} catch (err) {
			logger.error(err.message);
			snack(
				"Bir hata oluştu! Altyapı sağlayıcısının yapılandırmasını kontrol edin.",
				{
					variant: "error",
					autoHideDuration: 5000,
				}
			);
		}
	};

	return (
		<StepWizardWrapper
			onLoad={async () => {
				if (
					regions[0] === "Yükleniyor..." ||
					sshKeys[0] === "Yükleniyor..."
				)
					await reloadForm();
			}}

			disableBack={isEdit}

			onBackClick={() => {
				goToNamedStep("selectAWSClusterType");
			}}
			onNextClick={handleSubmit(async (fields) => {
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				wizard.updateData("type", "ec2");
				goToNamedStep("AWSCreateCluster");
			})}
			title="AWS Küme Bilgileri"
			width={500}
			{...props}
		>
			<Grid container spacing={1}>
				<Grid item xs={6}>
					<InputText
						disabled={isEdit}
						name="clusterName"
						control={control}
						label="Küme adı"
						rules={{
							required: "Küme adı giriniz",
							minLength: {
								value: 3,
								message: "Minimum uzunluk 3 karakter olmalı",
							},
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<InputSelect
						disabled={isEdit}
						name="kubVersion"
						control={control}
						label="Kubernetes versiyonu"
						items={kubernetesVersions}
						rules={{
							required: "Versiyon giriniz",
							minLength: {
								value: 1,
								message: "Versiyon giriniz",
							},
						}}
					/>
				</Grid>


				<Grid item xs={6}>
					<InputSelect
						name="masterCount"
						control={control}
						label="Control Plane adedi"
						items={["1", "3", "5", "7"]}
						defaultValue={1}
						// componentProps={{ type: "number" }}
						rules={{
							required: "Control Plane adedi giriniz",
							min: {
								value: 1,
								message: "Control Plane adedi giriniz",
							},
						}}
					/>
				</Grid>

				{/* <Grid item xs={6}>
					<InputText
						name="masterCount"
						control={control}
						label="Control Plane adedi"
						defaultValue={1}
						componentProps={{ type: "number" }}
						rules={{
							required: "Lütfen adet giriniz",
							min: {
								value: 1,
								message: "Lütfen adet giriniz",
							},
						}}
					/>
				</Grid> */}

				<Grid item xs={6}>
					<InputText
						name="workerCount"
						control={control}
						defaultValue={1}
						label="Worker adedi"
						componentProps={{ type: "number" }}
						rules={{
							required: "Lütfen adet giriniz",
							min: {
								value: 1,
								message: "Lütfen adet giriniz",
							},
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<InputSelect
						disabled={isEdit}
						name="sshKeyName"
						control={control}
						label="SSH anahtar adı"
						items={sshKeys}
						defaultValue={sshKeys[0]}
						rules={{
							required: "SSH anahtarını seçiniz",
							validate: (x) =>
								x != "Yükleniyor..."
									? true
									: "SSH anahtarını seçiniz",
						}}
					/>
				</Grid>

				<Grid item xs={6}>
					<InputSelect
						disabled={isEdit}
						name="workerMachineType"
						control={control}
						label="Worker makina tipi"
						items={machineTypes.map((x) => x.name)}
						rules={{
							required: "Makina tipini giriniz",
							minLength: {
								value: 1,
								message: "Makina tipini giriniz",
							},
						}}
					/>
				</Grid>

				<Grid item xs={6}>
					<InputSelect
						name="masterMachineType"
						disabled={isEdit}
						control={control}
						label="Control Plane makina tipi"
						items={machineTypes.map((x) => x.name)}
						rules={{
							required: "Makina tipini giriniz",
							minLength: {
								value: 1,
								message: "Makina tipini giriniz",
							},
						}}
					/>
				</Grid>

				<Grid item xs={6}>
					<InputSelect
						disabled={isEdit}
						name="region"
						control={control}
						label="Bölge"
						items={regions}
						defaultValue={ info.credentials_region ?? regions[0]}
						rules={{
							required: "Bölge giriniz",
							onChange: async (e, val = e.target.value) => {
								await setSshKeys(["Yükleniyor..."]);
								setValue("sshKeyName", "Yükleniyor...");
								await reloadForm(val);
							},
							validate: (x) =>
								x != "Yükleniyor..." ? true : "Bölge giriniz",
						}}
					/>
				</Grid>
			</Grid>
		</StepWizardWrapper>
	);
}
