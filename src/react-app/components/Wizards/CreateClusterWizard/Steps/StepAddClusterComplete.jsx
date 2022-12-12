import React from "react";
import { useLayout } from "../../../../hooks/useLayout";
import { StepWizardWrapper } from "../../../Steps";

export default function StepAddClusterComplete({ onFinish, ...props }) {
	const layout = useLayout();
	return (
		<StepWizardWrapper
			onNextClick={() => onFinish()}
			onLoad={() => layout.enableBack()}
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
