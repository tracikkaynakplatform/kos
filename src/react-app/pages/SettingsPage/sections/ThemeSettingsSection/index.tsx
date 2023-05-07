import { Switch } from "@headlessui/react";
import { useViewModel } from "./viewmodel";
import { Icon } from "@iconify/react";

export function ThemeSettingsSection() {
	const viewModel = useViewModel();

	return (
		<div>
			<Switch
				checked={viewModel.theme == "dark"}
				onChange={viewModel.onThemeChange}
				className="dark:bg-gray-600 bg-gray-300 relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-white focus-visible:ring-opacity-75"
			>
				<span className="dark:translate-x-9 translate-x-[-9px] absolute top-0 h-[34px] w-[34px] transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out flex items-center justify-center">
					<Icon fontSize="20px" icon={viewModel.theme == "dark" ? "icon-park-outline:dark-mode" : "ic:twotone-light-mode"} />
				</span>
			</Switch>
		</div>
	);
}
