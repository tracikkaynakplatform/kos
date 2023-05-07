import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { useThemeStore } from "kos-fe/stores";

export function useViewModel() {
	const { theme, setTheme } = useThemeStore();

	useComponentDidMount(async () => {
		setTheme(await window["osAPI"]["getConfig"]("theme"));
	});

	return {
		theme,
	};
}
