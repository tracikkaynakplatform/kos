import React from "react";
import StepInput from "../StepInput.jsx";

export default function StepSelectAWSClusterType({ goToNamedStep, ...props }) {
	return (
		<StepInput
			onBackClick={() => {
				goToNamedStep("selectProvider");
			}}
			onNextClick={(fields) => {
				goToNamedStep(fields.clusterType);
			}}
			title="AWS Küme Tipi"
			text={
				'EKS tarafından yönetilen bir küme oluşturmak için "EKS" seçeneğini seçin. Varsayılan yolla küme oluşturmak için"EC2" seçeneğiniz seçin.'
			}
			fields={{
				clusterType: {
					type: "radio",
					value: "AWSProviderConfig",
					items: [
						{
							label: "EKS",
							value: "AWSProviderEKSConfig",
						},
						{
							label: "EC2",
							value: "AWSProviderConfig",
						},
					],
				},
			}}
			width={500}
			{...props}
		/>
	);
}
