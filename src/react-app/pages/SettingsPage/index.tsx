import { DashboardLayout } from "kos-fe/layout";
import { settingSections } from "./sections";

export function SettingsPage() {
	return (
		<DashboardLayout>
			<div className="p-5 flex flex-col gap-3">
				{settingSections.map((section, index) => (
					<div key={index} className="w-full border-2 border-gray-700 dark:border-white rounded-lg p-3 flex flex-col gap-3">
						<div className="font-bold text-xl text-black dark:text-white">{section.title}</div>
						<hr />
						{section.content}
					</div>
				))}
			</div>
		</DashboardLayout>
	);
}
