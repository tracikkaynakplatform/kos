import { create } from "zustand";

type ThemeType = "dark" | "light";

interface ThemeState {
	theme: ThemeType;
	setLightTheme: () => void;
	setDarkTheme: () => void;
	setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
	theme: "light",
	setTheme: (theme: ThemeType) => set({ theme }),
	setLightTheme: () => set({ theme: "light" }),
	setDarkTheme: () => set({ theme: "dark" }),
}));
