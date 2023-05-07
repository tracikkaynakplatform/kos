import { useThemeStore } from "kos-fe/stores";

export function useViewModel() {
	const { setDarkTheme, setLightTheme, theme } = useThemeStore();

	const onThemeChange = (value) => {
		if (value) {
			setDarkTheme();
			window["osAPI"]["setConfig"]("theme", "dark");
		} else {
			setLightTheme();
			window["osAPI"]["setConfig"]("theme", "light");
		}
	};

	return {
		theme,
		onThemeChange,
	};
}
