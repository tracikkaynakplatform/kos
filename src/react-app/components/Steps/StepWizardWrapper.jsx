import React, { useEffect } from "react";
import { useWizard } from "../../hooks/useWizard";
import { Button } from "../UI/Button";

export default function StepWizardWrapper({
	disableBack,
	disableNext,
	onBackClick,
	onNextClick,
	onLoad,
	title,
	text,
	stepName,
	width,
	sx,
	children,
}) {
	const wizard = useWizard();
	useEffect(() => {
		if (wizard.stepName == stepName) onLoad?.();
	}, [wizard.stepName]);
	return (
		<div
			className="flex flex-col p-4 shadow-xl rounded-lg border-2 border-gray-100"
			style={{ width: (width ?? 300) + "px", ...sx }}
		>
			<div className="text-xl font-bold pb-4 pt-4">{title}</div>
			{!!text ? <div>{text}</div> : null}
			<div className="mt-3 mb-3 flex gap-3">{children}</div>
			<div className="flex justify-end gap-3">
				<Button
					className="w-20"
					disabled={!!disableBack}
					onClick={onBackClick}
				>
					Geri
				</Button>
				<Button
					className="w-20"
					disabled={!!disableNext}
					onClick={onNextClick}
				>
					İleri
				</Button>
			</div>
		</div>
	);
}
