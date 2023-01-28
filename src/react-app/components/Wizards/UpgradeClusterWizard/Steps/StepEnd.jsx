import React from "react";
import { Typography } from "@mui/material";
import { StepWizardWrapper } from "../../../Steps";

export default function StepEnd({ onFinish, ...props }) {
	return (
		<StepWizardWrapper
			disableBack
			onNextClick={async () => {
				onFinish?.();
			}}
			title="Yükseltme tamamlandı"
			text="Küme yükseltme işlemi başarıyla sonuçlandı. Kümenin yükseltme durumuyla ilgili bilgiyi detay sayfasından alabilirsiniz."
			width={400}
			{...props}
		/>
	);
}
