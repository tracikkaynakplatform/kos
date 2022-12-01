import React from "react";
import { useForm } from "react-hook-form";
import { useWizard } from "../../../../hooks/useWizard";
import { kubernetesVersions } from "../../../../providers/docker";
import { InputSelect, InputText } from "../../../FormInputs";
import { StepWizardWrapper } from "../../../Steps";

export default function StepKindProviderConfig({ goToNamedStep, ...props }) {
	const wizard = useWizard();
	const { handleSubmit, control } = useForm();
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			onNextClick={handleSubmit(async (fields) => {
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				_goto("kindCreateCluster");
			})}
			onBackClick={() => {
				_goto("selectProvider");
			}}
			title="Kind - Docker Yapılandırması"
			text="Oluşturmak istediğiniz kümenin bilgilerini giriniz."
			width={400}
			{...props}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					gap: "10px",
				}}
			>
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
				<InputSelect
					name="kubVersion"
					control={control}
					label="Kubernetes versiyonu"
					items={kubernetesVersions}
					defaultValue={kubernetesVersions[0]}
					rules={{
						required: "Versiyon giriniz",
						minLength: {
							value: 1,
							message: "Versiyon giriniz",
						},
					}}
				/>
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
						setValueAs: (v) => parseInt(v),
					}}
				/>
				<InputText
					name="workerCount"
					control={control}
					label="Worker adedi"
					defaultValue={1}
					componentProps={{ type: "number" }}
					rules={{
						required: "Lütfen adet giriniz",
						min: {
							value: 1,
							message: "Lütfen adet giriniz",
						},
						setValueAs: (v) => parseInt(v),
					}}
				/>
			</div>
		</StepWizardWrapper>
	);
}
