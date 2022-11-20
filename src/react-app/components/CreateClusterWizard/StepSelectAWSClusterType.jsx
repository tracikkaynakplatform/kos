import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";
import StepWizardWrapper from "../StepWizardWrapper.jsx";

export default function StepSelectAWSClusterType({ goToNamedStep, ...props }) {
	const [service, setService] = useState("AWSProviderConfig");
	return (
		<StepWizardWrapper
			onBackClick={() => {
				goToNamedStep("selectProvider");
			}}
			onNextClick={() => {
				goToNamedStep(service);
			}}
			title="AWS Küme Tipi"
			text={
				"Küme oluşturmak için kullanmak istediğiniz AWS servisini seçiniz"
			}
			width={500}
			{...props}
		>
			<RadioGroup
				sx={{ flexDirection: "column" }}
				defaultValue="AWSProviderConfig"
				onChange={(e) => setService(e.target.value)}
			>
				<FormControlLabel
					control={<Radio />}
					value="AWSProviderEKSConfig"
					label="EKS - Elastic Kubernetes Service"
				/>
				<FormControlLabel
					control={<Radio />}
					value="AWSProviderConfig"
					label="EC2 - Elastic Compute Cloud"
				/>
			</RadioGroup>
		</StepWizardWrapper>
	);
}
