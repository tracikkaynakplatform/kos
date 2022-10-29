import React, { useState } from "react";
import { useWizard } from "../../hooks/useWizard";
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
			fields={[
				{
					title: "Küme Adı",
					type: "string",
					name: "clusterName",
				},
				{
					title: "Kubernetes Versiyonu",
					type: "select",
					values: [
						"v1.20.15",
						"v1.22.15",
						"v1.23.12",
						"v1.23.13",
						"v1.24.4",
						"v1.24.6",
						"v1.24.7",
						"v1.25.3",
					],
					name: "kubVersion",
				},
				{
					title: "Master Makina Sayısı",
					type: "number",
					name: "masterCount",
				},
				{
					title: "Worker Makina Sayısı",
					type: "number",
					name: "workerCount",
				},
			]}
			{...props}
		/>
	);
}
