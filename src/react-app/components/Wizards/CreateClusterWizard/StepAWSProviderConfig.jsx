import React from "react";
import { kubernetesVersions, machineTypes } from "../../../providers/aws";
import { useWizard } from "../../../hooks/useWizard";
import StepWizardWrapper from "../../Steps/StepWizardWrapper.jsx";
import { Grid, Input } from "@mui/material";
import InputText from "../../FormInputs/InputText.jsx";
import InputSelect from "../../FormInputs/InputSelect.jsx";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getAWSInfo } from "./aws";
import { useEffect } from "react";

export default function StepAWSProviderConfig({ goToNamedStep, ...props }) {
	const [regions, setRegions] = useState(["Yükleniyor..."]);
	const [sshKeys, setSshKeys] = useState(["Yükleniyor..."]);

	const { handleSubmit, control, setValue } = useForm();
	const wizard = useWizard();

	const updateOptions = async (region) => {
		let info = await getAWSInfo(
			wizard.manClusterName,
			region ?? regions[0]
		);

		if (!region) {
			setRegions(info.regions);
			setValue("region", info.regions[0]);
		}

		setSshKeys(info.sshKeys?.map((x) => x.KeyName));
		setValue("sshKeyName", info.sshKeys[0]?.KeyName ?? "");
	};

	return (
		<StepWizardWrapper
			onLoad={async () => {
				if (
					regions[0] === "Yükleniyor..." ||
					sshKeys[0] === "Yükleniyor..."
				)
					await updateOptions();
			}}
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
				</Grid>
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
						name="region"
						control={control}
						label="Bölge"
						items={regions}
						defaultValue={regions[0]}
						rules={{
							required: "Bölge giriniz",
							onChange: async (e, val = e.target.value) => {
								await setSshKeys(["Yükleniyor..."]);
								setValue("sshKeyName", "Yükleniyor...");
								await updateOptions(val);
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
