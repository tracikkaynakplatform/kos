import React from "react";
import { useWizard } from "../../hooks/useWizard";
import { kubernetesVersions } from "../../providers/docker";
import StepInput from "../StepInput.jsx";

export default function StepKindProviderConfig({ goToNamedStep, ...props }) {
	const wizard = useWizard();
	const _goto = goToNamedStep;

	return (
		<StepInput
			onNextClick={async (fields) => {
				// TODO: Girdi doğrulama
				for (let field of Object.keys(fields))
					await wizard.updateData(field, fields[field]);
				_goto("kindCreateCluster");
			}}
			onBackClick={() => {
				_goto("selectProvider");
			}}
			title="Kind - Docker Yapılandırması"
			text="Oluşturmak istediğiniz kümenin bilgilerini giriniz."
			width={400}
			fields={{
				clusterName: {
					title: "Küme Adı",
					type: "text",
				},
				kubVersion: {
					title: "Kubernetes Versiyonu",
					type: "select",
					items: kubernetesVersions,
					value: kubernetesVersions[0],
				},
				masterCount: {
					title: "Control Plane Adedi",
					type: "number",
					value: 1,
				},
				workerCount: {
					title: "Worker Adedi",
					type: "number",
					value: 1,
				},
			}}
			{...props}
		/>
	);
}
