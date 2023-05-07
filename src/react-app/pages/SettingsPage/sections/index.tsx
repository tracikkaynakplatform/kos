import { ReactNode } from "react";
import { ThemeSettingsSection } from "./ThemeSettingsSection";

type SettingSection = {
	title: string;
	content: ReactNode;
};

export const settingSections: SettingSection[] = [
	{
		title: "Theme",
		content: <ThemeSettingsSection />,
	},
];
