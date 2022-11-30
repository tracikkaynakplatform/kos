import React from "react";
import { useNavigate } from "react-router-dom";
import StepWizardWrapper from "../../Steps/StepWizardWrapper";

export default function StepEnd() {
	const nav = useNavigate();
	return (
		<StepWizardWrapper
			disableBack
			onNextClick={() => nav("/management-clusters", { replace: true })}
			title="Küme ekleme başaralı!"
			text="Yönetim kümeniz başarılı bir şekilde eklendi. Detaylı bilgi için Yönetim Kümeleri sayfasına bakabilirsiniz."
			width={400}
		/>
	);
}
