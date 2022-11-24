import React from "react";
import { eksVersions, machineTypes, regions } from "../../../providers/aws";
import { useWizard } from "../../../hooks/useWizard";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import StepWizardWrapper from "../../Steps/StepWizardWrapper.jsx";
import InputText from "../../FormInputs/InputText.jsx";
import InputSelect from "../../FormInputs/InputSelect.jsx";

export default function StepAWSProviderEKSConfig({ goToNamedStep, ...props }) {
	const { handleSubmit, control } = useForm();
	const wizard = useWizard();

	return (
		<StepWizardWrapper
			onBackClick={() => {
				goToNamedStep("selectAWSClusterType");
			}}
			onNextClick={handleSubmit(async (fields) => {
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				wizard.updateData("type", "eks");
				goToNamedStep("AWSCreateCluster");
			})}
			title="AWS-EKS Küme Bilgileri"
			text="Oluşturulacak EKS kümesinin detaylarını girin."
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
						items={eksVersions}
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
					<InputText
						name="sshKeyName"
						control={control}
						label="SSH anahtar adı"
						rules={{
							required: "SSH anahtar adını giriniz",
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
						name="region"
						control={control}
						label="Bölge"
						items={regions}
						rules={{
							required: "Bölge giriniz",
							minLength: {
								value: 1,
								message: "Bölge giriniz",
							},
						}}
					/>
				</Grid>
			</Grid>
		</StepWizardWrapper>
	);
}
