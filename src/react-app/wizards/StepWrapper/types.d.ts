import { ReactNode } from "react";

export interface StepWrapperProps {
	stepName: string;
	disableBack?: boolean;
	disableNext?: boolean;
	onNextClick?: () => void;
	onBackClick?: () => void;
	onLoad?: () => void;
	title: string | ReactNode;
	text?: string | ReactNode;
	width?: number;
	height?: number;
	children?: ReactNode;
	extraButtons?: ReactNode;
}
