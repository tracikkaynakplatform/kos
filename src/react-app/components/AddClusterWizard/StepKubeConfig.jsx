import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper.jsx";
import kubeConfig from "../../api/kubeConfig";

export default function StepKubeConfig(props) {
	const [kubeconfigData, setKubeconfigData] = useState("");
	const wizard = useWizard();
	const _goto = props.goToNamedStep;

	return (
		<Wrapper
			stepName={props.stepName}
			disableBack
			onLoad={async () =>
				setKubeconfigData(await kubeConfig.defaultConfig())
			}
			onNextClick={async () => {
				await wizard.updateData("config", kubeconfigData);
				_goto("connecting");
			}}
			width={700}
			title="Küme Bilgileri"
			text={
				<>
					Eklemek istediğiniz yönetim kümesinin kubeconfig içeriğini
					giriniz.
					<br />
					(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği
					alınmıştır)
				</>
			}
		>
			<TextField
				onChange={(e) => setKubeconfigData(e.target.value)}
				value={kubeconfigData}
				fullWidth
				label="kubeconfig içeriği"
				multiline
				rows={15}
			/>
		</Wrapper>
	);
}
