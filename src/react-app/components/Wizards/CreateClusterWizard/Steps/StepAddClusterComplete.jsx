import React from "react";
import { StepWizardWrapper } from "../../../Steps";

export default function StepAddClusterComplete({ onFinish, ...props }) {
	return (
		<StepWizardWrapper
			onNextClick={() => onFinish()}
			disableBack
			width={500}
			title="Küme oluşturma başarılı"
			text="Küme oluşturma işlemi başarıyla sonuçlandı. Oluşturduğunuz
			kümenin hazır olup olmadığını kümeler menüsünden takip
			edebilirsiniz."
			{...props}
		/>
	);
}
