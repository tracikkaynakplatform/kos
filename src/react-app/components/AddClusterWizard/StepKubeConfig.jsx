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
				sx={{ mt: 2, mb: 2, width: "700px" }}
				label="kubeconfig içeriği"
				multiline
				rows={15}
			/>
		</Wrapper>
	);
}
