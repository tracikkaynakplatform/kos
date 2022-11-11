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
			onNextClick={async (fields) => {
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				wizard.updateData("type", "eks");
				goToNamedStep("AWSCreateCluster");
			}}
			title="AWS-EKS Küme Bilgileri"
			text="Oluşturulacak EKS kümesinin detaylarını girin."
			fields={{
				clusterName: {
					title: "Küme Adı",
					type: "text",
					size: 6,
				},
				kubVersion: {
					title: "EKS Kubernetes Versiyonu",
					type: "select",
					items: eksVersions,
					value: eksVersions[0],
					size: 6,
				},
				workerCount: {
					title: "Worker Makina Sayısı",
					type: "number",
					size: 6,
				},
				workerMachineType: {
					title: "Worker Makina Tipi",
					type: "select",
					items: machineTypes.map((x) => x.name),
					value: machineTypes.map((x) => x.name)[0],
					size: 6,
				},
				sshKeyName: {
					title: "SSH Anahtarı",
					type: "text",
					size: 6,
				},
				region: {
					title: "Bölge",
					type: "select",
					items: regions,
					value: regions[0],
					size: 6,
				},
			}}
			width={500}
			{...props}
		/>
	);
}
