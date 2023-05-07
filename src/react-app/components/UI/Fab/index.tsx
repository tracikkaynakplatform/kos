import { Icon } from "@iconify/react";
import { useViewModel } from "./viewmodel";
import { FabProps } from "./types";

export function Fab(props: FabProps) {
	const viewModel = useViewModel(props.horizontalAlign, props.verticalAlign);

	return (
		<button
			style={{
				position: "absolute",
				left: viewModel.leftSpace,
				right: viewModel.rightSpace,
				top: viewModel.topSpace,
				bottom: viewModel.bottomSpace,
				...props.style,
			}}
			onClick={props.onClick}
			disabled={props.disabled}
			className={`button fixed flex items-center justify-center rounded-full w-[50px] h-[50px] text-white bg-gray-400 hover:bg-gray-500 `}
		>
			{!!props.icon ? <Icon icon={props.icon} color="white" fontSize="30px" /> : <div>{props.children}</div>}
		</button>
	);
}
