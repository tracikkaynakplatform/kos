import { QuestionModal } from "../QuestionModal";
import { QuestionModalProps } from "../QuestionModal/view";

export type YesNoModalProps = QuestionModalProps & {
	yesButtonText?: string;
	noButtonText?: string;
};

export function View(props: YesNoModalProps) {
	return (
		<QuestionModal {...props}>
			<button className="w-20 self-end bg-red-300" onClick={() => props.on?.("yes")}>
				{props.yesButtonText ?? "Yes"}
			</button>
			<button className="w-20 self-end" onClick={() => props.on?.("no")}>
				{props.noButtonText ?? "No"}
			</button>
		</QuestionModal>
	);
}
