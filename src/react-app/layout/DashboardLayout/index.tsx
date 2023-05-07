import { menuItems } from "kos-fe/constants/sidebar";
import { SidebarButton } from "./components/SidebarButton";
import { DashboardLayoutProps } from "./types";
import { BaseLayout } from "../BaseLayout";

export function DashboardLayout(props: DashboardLayoutProps) {
	return (
		<BaseLayout>
			<div className="flex">
				<div className="transition-all duration-200 h-screen border-r-2 dark:border-r-gray-400 border-r-black bg-white dark:bg-dark">
					<ul className="pt-5 flex flex-col w-64 items-center">
						{menuItems.map((item, index) => (
							<SidebarButton key={index} href={item.path} iconName={item.icon} label={item.label} />
						))}
					</ul>
				</div>
				<div className="transition-all duration-200 flex flex-col flex-grow h-screen bg-white dark:bg-dark relative">
					{props.children}
				</div>
			</div>
		</BaseLayout>
	);
}
