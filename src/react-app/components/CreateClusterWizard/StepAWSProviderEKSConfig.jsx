import React from "react";
import { eksVersions, machineTypes, regions } from "../../providers/aws";
import { useWizard } from "../../hooks/useWizard";
import StepInput from "../StepInput.jsx";

export default function StepAWSProviderEKSConfig({ goToNamedStep, ...props }) {
	const wizard = useWizard();

	return (
		<StepInput
			onBackClick={() => {
				goToNamedStep("selectAWSClusterType");
			}}
			onNextClick={async (fields) => {}}
			title="AWS-EKS Küme Bilgileri"
			text="Oluşturulacak EKS kümesinin detaylarını girin."
			fields={[
				{
					title: "Küme Adı",
					type: "string",
					name: "clusterName",
					size: 6,
				},
				{
					title: "EKS Kubernetes Versiyonu",
					type: "select",
					values: eksVersions,
					name: "kubVersion",
					size: 6,
				},
				{
					title: "Worker Makina Sayısı",
					type: "number",
					name: "workerCount",
					size: 6,
				},
				{
					title: "Worker Makina Tipi",
					type: "select",
					values: machineTypes.map((x) => x.name),
					name: "workerMachineType",
					size: 6,
				},
				{
					title: "SSH Anahtarı",
					type: "string",
					name: "sshKeyName",
					size: 6,
				},
				{
					title: "Bölge",
					type: "select",
					values: regions,
					name: "region",
					size: 6,
				},
			]}
			width={500}
			{...props}
		/>
	);
}
