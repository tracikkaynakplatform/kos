import React from "react";
import { kubernetesVersions, machineTypes, regions } from "../../providers/aws";
import { useWizard } from "../../hooks/useWizard";
import StepInput from "../StepInput.jsx";

export default function StepAWSProviderConfig({ goToNamedStep, ...props }) {
	const wizard = useWizard();

	return (
		<StepInput
			onBackClick={() => {
				goToNamedStep("selectAWSClusterType");
			}}
			onNextClick={async (fields) => {
				// TODO: Girdi doğrulama
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				wizard.updateData("type", "ec2");
				goToNamedStep("AWSCreateCluster");
			}}
			title="AWS Küme Bilgileri"
			fields={{
				clusterName: {
					title: "Küme Adı",
					type: "text",
					size: 6,
				},
				kubVersion: {
					title: "Kubernetes Versiyonu",
					type: "select",
					items: kubernetesVersions,
					value: kubernetesVersions[0],
					size: 6,
				},
				masterCount: {
					title: "Control Plane Adedi",
					type: "number",
					value: 1,
					size: 6,
				},
				workerCount: {
					title: "Worker Adedi",
					type: "number",
					value: 1,
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
				masterMachineType: {
					title: "Control Plane Türü",
					type: "select",
					items: machineTypes.map((x) => x.name),
					value: machineTypes.map((x) => x.name)[0],
					size: 6,
				},
				workerMachineType: {
					title: "Worker Türü",
					type: "select",
					items: machineTypes.map((x) => x.name),
					value: machineTypes.map((x) => x.name)[0],
					size: 6,
				},
			}}
			width={500}
			{...props}
		/>
	);
}
