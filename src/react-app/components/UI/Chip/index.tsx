import { Icon } from "@iconify/react";
import { ChipProps } from "./types";

export function Chip(props: ChipProps) {
	return (
		<div className="flex gap-2 items-center rounded-full  border-[1px] border-gray-400 w-fit h-fit p-[5px] px-[10px] text-black dark:text-white">
			{props.iconName && <Icon fontSize="18px" icon={props.iconName} />}
			{props.children}
		</div>
	);
}
