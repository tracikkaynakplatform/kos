import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useNavigate } from "react-router-dom";

export function StepEnd(props: DefaultStepProps) {
	const navigate = useNavigate();

	return (
		<StepWrapper
			stepName={props.stepName}
			onNextClick={() => navigate("/", { replace: true })}
			width={400}
			disableBack
			title="Finish"
			text="Management cluster added to KOS successfully. You can examine your management cluster by using management clusters page."
		/>
	);
}
