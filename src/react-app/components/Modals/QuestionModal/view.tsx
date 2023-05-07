import { ReactNode } from "react";

export type QuestionModalProps = {
	message: string;
	title?: string;
	children?: ReactNode;
	on?: (choice: string) => void;
};

export function View(props: QuestionModalProps) {
	return (
		<div className="flex flex-col gap-5">
			{!!props.title && <div className="font-bold text-xl">{props.title}</div>}
			<div className="p-2">{props.message}</div>
			<div className="flex self-end gap-2">{props.children}</div>
		</div>
	);
}
