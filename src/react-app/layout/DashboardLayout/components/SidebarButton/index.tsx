import { Icon } from "@iconify/react";
import { useViewModel } from "./viewmodel";
import { SidebarButtonProps } from "./types";

export function SidebarButton({ href, iconName, label }: SidebarButtonProps) {
	const viewModel = useViewModel();

	return (
		<li
			className={`flex items-center gap-3 transition-all duration-300 justify-between hover:bg-gray-200 text-black dark:text-white dark:bg-dark dark:hover:bg-gray-500 hover:cursor-pointer w-full p-3 ${
				viewModel.isActive(href) ? "dark:bg-gray-500 bg-gray-200" : ""
			}`}
			onClick={() => viewModel.navigateToPage(href)}
		>
			{iconName ? <Icon icon={iconName} fontSize="20px" /> : <div></div>}
			<div>{label}</div>
		</li>
	);
}
