import { ReactNode } from "react";

export type ReversibleLayoutContextType = {
	isBackEnabled: boolean;
	enableBack: () => void;
	disableBack: () => void;
	setOnBackClick: (handler: () => void) => void;
	onBackClick?: () => void;
};

export interface ReversibleLayoutProviderProps {
	children?: ReactNode;
}
