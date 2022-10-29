import React from "react";
import StepInput from "../StepInput.jsx";

export default function StepSelectAWSClusterType({ goToNamedStep, ...props }) {
	return (
		<StepInput
			onBackClick={() => {
				goToNamedStep("selectProvider");
			}}
			onNextClick={(fields) => {
				console.log(fields);
				goToNamedStep(fields.clusterType);
			}}
			title="AWS Küme Tipi"
			text={
				'EKS tarafından yönetilen bir küme oluşturmak için "EKS" seçeneğini seçin. Varsayılan yolla küme oluşturmak için"EC2" seçeneğiniz seçin.'
			}
			fields={[
				{
					type: "radio",
					direction: "horizontal",
					name: "clusterType",
					values: [
						{
							label: "EKS",
							value: "AWSProviderEKSConfig",
						},
						{
							label: "EC2",
							value: "AWSProviderConfig",
							checked: true,
						},
					],
				},
			]}
			width={500}
			{...props}
		/>
	);
}
