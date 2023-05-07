import { useViewModel } from "./viewmodel";
import { StepWrapperProps } from "./types";

export function StepWrapper(props: StepWrapperProps) {
	useViewModel(props.stepName, props.onLoad);

	return (
		<div
			className=" flex flex-col p-4 shadow-xl rounded-lg text-black dark:text-white border-2 border-gray-600 dark:border-gray-100"
			style={{ width: (props.width ?? 300) + "px", height: props.height ? props.height + "px" : undefined }}
		>
			<div className="text-xl font-bold pb-4 pt-4">{props.title}</div>
			{!!props.text ? <div>{props.text}</div> : null}
			<div className="mt-3 mb-3 flex gap-3">{props.children}</div>
			<div className="flex-1" />
			<hr />
			<div className="mt-3 flex justify-end gap-3">
				{props.extraButtons}
				<div className="flex-1" />
				<button disabled={!!props.disableBack} onClick={props.onBackClick}>
					Back
				</button>
				<button disabled={!!props.disableNext} onClick={props.onNextClick}>
					Next
				</button>
			</div>
		</div>
	);
}
